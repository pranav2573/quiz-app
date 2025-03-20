import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import { getQuiz } from '../services/firebase';
import { Quiz } from '../types';
import QuizDetail from '../components/QuizDetail';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedQuiz = await getQuiz(id);
        setQuiz(fetchedQuiz as Quiz);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Failed to load quiz. It may have been deleted or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading quiz...</p>
      </Container>
    );
  }

  if (error || !quiz) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error || 'Quiz not found'}</p>
          <Button variant="outline-primary" onClick={() => navigate('/explore')}>
            Explore Other Quizzes
          </Button>
        </Alert>
      </Container>
    );
  }

  return <QuizDetail quiz={quiz} />;
};

export default QuizPage; 