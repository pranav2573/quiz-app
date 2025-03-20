import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllQuizzes } from '../services/firebase';
import { Quiz } from '../types';
import QuizCard from '../components/QuizCard';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const fetchedQuizzes = await getAllQuizzes();
        setQuizzes(fetchedQuizzes);
      } catch (err) {
        setError('Failed to load quizzes. Please try again later.');
        console.error('Error fetching quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Available Quizzes</h1>
        {currentUser && (
          <Link
            to="/create-quiz"
            className="btn btn-primary"
          >
            Create Quiz
          </Link>
        )}
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-5">
          <p className="lead text-muted">No quizzes available at the moment.</p>
          {currentUser && (
            <Link
              to="/create-quiz"
              className="btn btn-outline-primary mt-3"
            >
              Create your first quiz!
            </Link>
          )}
        </div>
      ) : (
        <Row className="g-4">
          {quizzes.map((quiz) => (
            <Col key={quiz.id} xs={12} md={6} lg={4}>
              <QuizCard quiz={quiz} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home; 