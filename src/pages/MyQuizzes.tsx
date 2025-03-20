import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { getUserQuizzes } from '../services/firebase';
import { Quiz } from '../types';
import { useAuth } from '../contexts/AuthContext';
import QuizCard from '../components/QuizCard';

const MyQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserQuizzes = async () => {
      try {
        setLoading(true);
        const fetchedQuizzes = await getUserQuizzes(currentUser.uid);
        setQuizzes(fetchedQuizzes as Quiz[]);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError('Failed to load your quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuizzes();
  }, [currentUser]);

  const handleDeleteQuiz = (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
      // In a real app, you would call a delete function from your firebase service
      // deleteQuiz(quizId);
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your quizzes...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4 animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Quizzes</h1>
        <Link to="/create-quiz" className="btn btn-primary">
          Create New Quiz
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {quizzes.length === 0 ? (
        <Alert variant="info">
          <div className="text-center py-4">
            <h3>You haven't created any quizzes yet</h3>
            <p className="mb-4">Get started by creating your first quiz!</p>
            <Link to="/create-quiz" className="btn btn-primary">
              Create Quiz
            </Link>
          </div>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {quizzes.map(quiz => (
            <Col key={quiz.id}>
              <QuizCard 
                quiz={quiz} 
                isOwner={true} 
                onDelete={handleDeleteQuiz} 
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyQuizzes; 