import React, { useState, useEffect } from 'react';
import { Card, Button, ProgressBar, Container, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Quiz, Question, Answer, QuizResult } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { saveQuizResult } from '../services/firebase';
import confetti from 'canvas-confetti';

interface QuizDetailProps {
  quiz: Quiz;
}

const QuizDetail: React.FC<QuizDetailProps> = ({ quiz }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  // Time limit: 60 seconds per question
  const TIME_LIMIT_PER_QUESTION = 60;

  useEffect(() => {
    // Reset timer when starting the quiz or moving to a new question
    setTimeLeft(TIME_LIMIT_PER_QUESTION);
    setStartTime(Date.now());

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, TIME_LIMIT_PER_QUESTION - elapsed);
      
      setTimeLeft(remaining);
      
      if (remaining === 0 && !showResult) {
        clearInterval(timer);
        handleNextQuestion();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex, startTime, showResult]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = Math.floor(((currentQuestionIndex) / quiz.questions.length) * 100);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswerId(answerId);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswerId && !showResult) {
      // If time ran out without selection, mark no answer
      saveAnswer(null);
    } else if (selectedAnswerId) {
      saveAnswer(selectedAnswerId);
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswerId(null);
    } else {
      finishQuiz();
    }
  };

  const saveAnswer = (answerId: string | null) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerId || ''
    }));
  };

  const finishQuiz = () => {
    // Calculate score
    let totalScore = 0;
    
    quiz.questions.forEach(question => {
      const userAnswerId = userAnswers[question.id];
      if (userAnswerId) {
        const correctAnswer = question.answers.find(a => a.isCorrect);
        if (correctAnswer && correctAnswer.id === userAnswerId) {
          totalScore++;
        }
      }
    });
    
    setScore(totalScore);
    setShowResult(true);
    setQuizCompleted(true);
    
    // Trigger confetti if good score (70% or better)
    if (totalScore / quiz.questions.length >= 0.7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // Save result to database if user is logged in
    if (currentUser) {
      saveQuizResultToDatabase(totalScore);
    }
  };

  const saveQuizResultToDatabase = async (totalScore: number) => {
    try {
      setLoading(true);
      
      if (!currentUser) {
        setError('User not logged in');
        return;
      }
      
      const result: QuizResult = {
        id: uuidv4(),
        quizId: quiz.id,
        userId: currentUser.uid,
        score: totalScore,
        totalQuestions: quiz.questions.length,
        completedAt: new Date()
      };
      
      await saveQuizResult(result);
    } catch (error) {
      console.error('Error saving quiz result:', error);
      setError('Failed to save your result. But you can still see your score.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  if (showResult) {
    return (
      <Container className="py-5 animate__animated animate__fadeIn">
        <Card className="shadow-lg border-0">
          <Card.Header className="bg-primary text-white py-3">
            <h3 className="mb-0">Quiz Results</h3>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <div className="text-center mb-4">
              <h4 className="mb-3">{quiz.title}</h4>
              <div className="display-1 fw-bold mb-3 text-primary">
                {score}/{quiz.questions.length}
              </div>
              <ProgressBar 
                now={(score / quiz.questions.length) * 100} 
                variant={score / quiz.questions.length >= 0.7 ? "success" : "warning"}
                className="mb-3"
                style={{ height: "10px" }}
              />
              <p className="lead">
                {score / quiz.questions.length >= 0.8 ? "Excellent work!" :
                 score / quiz.questions.length >= 0.6 ? "Good job!" : 
                 "Keep practicing!"}
              </p>
            </div>
            
            <h5 className="mb-3">Review your answers:</h5>
            <ListGroup variant="flush" className="mb-4">
              {quiz.questions.map((question, index) => {
                const userAnswerId = userAnswers[question.id];
                const userAnswer = userAnswerId 
                  ? question.answers.find(a => a.id === userAnswerId) 
                  : null;
                const correctAnswer = question.answers.find(a => a.isCorrect);
                const isCorrect = userAnswerId === correctAnswer?.id;
                
                return (
                  <ListGroup.Item 
                    key={question.id}
                    className={`border-start border-4 ${isCorrect ? 'border-success' : 'border-danger'}`}
                  >
                    <p className="fw-bold mb-1">Question {index + 1}: {question.text}</p>
                    {userAnswer ? (
                      <p className="mb-1">
                        Your answer: <span className={isCorrect ? 'text-success' : 'text-danger'}>
                          {userAnswer.text}
                        </span>
                      </p>
                    ) : (
                      <p className="text-danger mb-1">No answer provided</p>
                    )}
                    {!isCorrect && (
                      <p className="text-success mb-0">
                        Correct answer: {correctAnswer?.text}
                      </p>
                    )}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
            
            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-primary" 
                onClick={() => navigate('/explore')}
              >
                Explore More Quizzes
              </Button>
              {!currentUser && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate('/login')}
                >
                  Log In to Save Results
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-primary text-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">{quiz.title}</h4>
            <span>Question {currentQuestionIndex + 1}/{quiz.questions.length}</span>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between mb-2">
            <div className="text-muted">Progress</div>
            <div className="text-muted">Time left: {formatTime(timeLeft)}</div>
          </div>
          <ProgressBar 
            now={progress} 
            variant="primary" 
            className="mb-4"
            style={{ height: "8px" }}
          />
          
          <h5 className="mb-4 fw-bold animate__animated animate__fadeIn">{currentQuestion.text}</h5>
          
          <div className="mb-4">
            {currentQuestion.answers.map(answer => (
              <div
                key={answer.id}
                onClick={() => handleAnswerSelect(answer.id)}
                className={`p-3 mb-2 rounded cursor-pointer animate__animated animate__fadeIn shadow-sm
                  ${selectedAnswerId === answer.id ? 'bg-primary text-white' : 'bg-light'}
                  hover:shadow-md transition-all duration-200`}
                style={{ cursor: 'pointer' }}
              >
                {answer.text}
              </div>
            ))}
          </div>
          
          <div className="d-flex justify-content-end">
            <Button 
              variant="primary"
              onClick={handleNextQuestion}
              disabled={!selectedAnswerId && timeLeft > 0}
            >
              {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuizDetail; 