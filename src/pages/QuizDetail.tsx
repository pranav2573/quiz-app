import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { getQuiz } from '../services/firebase';
import { Quiz } from '../types';

const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const quizData = await getQuiz(id);
        setQuiz(quizData as Quiz);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !quiz) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'Quiz not found.'}
        </Alert>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="mb-4">
        <Card.Header as="h2">{quiz.title}</Card.Header>
        <Card.Body>
          <Card.Text>{quiz.description}</Card.Text>
          <div className="mb-3">
            <strong>Number of Questions:</strong> {quiz.questions.length}
          </div>
          <Link to={`/quiz/${quiz.id}`}>
            <Button variant="primary">Start Quiz</Button>
          </Link>
        </Card.Body>
      </Card>

      <h3>Preview Questions</h3>
      {quiz.questions.map((question, index) => (
        <Card key={question.id} className="mb-3">
          <Card.Body>
            <Card.Title>Question {index + 1}</Card.Title>
            <Card.Text>{question.text}</Card.Text>
            <ul className="list-unstyled">
              {question.answers.map((answer) => (
                <li key={answer.id} className="mb-2">
                  • {answer.text}
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default QuizDetail; 