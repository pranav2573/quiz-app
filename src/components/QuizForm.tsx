import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Quiz, Question } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { createQuiz } from '../services/firebase';
import QuestionForm from './QuestionForm';

interface QuizFormProps {
  quiz?: Quiz;
  onSubmit?: (quiz: Quiz) => Promise<void>;
}

const QuizForm: React.FC<QuizFormProps> = ({ quiz, onSubmit }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title);
      setDescription(quiz.description);
      setQuestions(quiz.questions);
    }
  }, [quiz]);

  const handleAddQuestion = () => {
    setShowQuestionForm(true);
    setEditingQuestionIndex(null);
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSaveQuestion = (question: Question) => {
    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = question;
      setQuestions(updatedQuestions);
    } else {
      // Add new question
      setQuestions([...questions, question]);
    }
    setShowQuestionForm(false);
  };

  const handleCancelQuestionForm = () => {
    setShowQuestionForm(false);
    setEditingQuestionIndex(null);
  };

  const handleReorderQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newQuestions[index], newQuestions[targetIndex]] = 
    [newQuestions[targetIndex], newQuestions[index]];
    
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create a quiz');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }
    
    if (questions.length < 1) {
      setError('Please add at least one question');
      return;
    }
    
    const newQuiz: Quiz = {
      id: quiz?.id || uuidv4(),
      title: title.trim(),
      description: description.trim(),
      questions,
      createdBy: currentUser.uid,
      createdAt: quiz?.createdAt || new Date()
    };
    
    try {
      setLoading(true);
      setError('');
      
      if (onSubmit) {
        await onSubmit(newQuiz);
      } else {
        await createQuiz(newQuiz);
      }
      
      navigate('/my-quizzes');
    } catch (error) {
      console.error('Error saving quiz:', error);
      setError('Failed to save quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">{quiz ? 'Edit Quiz' : 'Create New Quiz'}</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter quiz title"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter quiz description"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Questions ({questions.length})</h5>
                <Button 
                  variant="primary" 
                  onClick={handleAddQuestion}
                  disabled={showQuestionForm}
                >
                  Add Question
                </Button>
              </div>

              {showQuestionForm && (
                <QuestionForm
                  question={editingQuestionIndex !== null ? questions[editingQuestionIndex] : undefined}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelQuestionForm}
                />
              )}

              {questions.length > 0 ? (
                <div className="questions-list">
                  {questions.map((question, index) => (
                    <Card key={question.id} className="mb-3 shadow-sm hover:shadow-md transition-shadow">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6>Question {index + 1}</h6>
                            <p className="mb-1">{question.text}</p>
                            <small className="text-muted">
                              {question.answers.length} answers 
                              ({question.answers.filter(a => a.isCorrect).length} correct)
                            </small>
                          </div>
                          <div className="d-flex align-items-start gap-2">
                            <div className="d-flex flex-column">
                              <Button 
                                variant="link" 
                                size="sm" 
                                onClick={() => handleReorderQuestion(index, 'up')}
                                disabled={index === 0}
                                className="p-0 mb-1"
                              >
                                ▲
                              </Button>
                              <Button 
                                variant="link" 
                                size="sm" 
                                onClick={() => handleReorderQuestion(index, 'down')}
                                disabled={index === questions.length - 1}
                                className="p-0"
                              >
                                ▼
                              </Button>
                            </div>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              onClick={() => handleEditQuestion(index)}
                              disabled={showQuestionForm}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => handleDeleteQuestion(index)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert variant="info">
                  No questions added yet. Click "Add Question" to get started.
                </Alert>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                variant="success" 
                type="submit" 
                disabled={loading || questions.length === 0}
              >
                {loading ? 'Saving...' : (quiz ? 'Update Quiz' : 'Create Quiz')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuizForm; 