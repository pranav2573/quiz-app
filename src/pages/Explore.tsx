import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Card, Button, Spinner } from 'react-bootstrap';
import { getAllQuizzes } from '../services/firebase';
import { Quiz } from '../types';
import QuizCard from '../components/QuizCard';

const Explore: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const fetchedQuizzes = await getAllQuizzes();
        setQuizzes(fetchedQuizzes as Quiz[]);
        setFilteredQuizzes(fetchedQuizzes as Quiz[]);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError('Failed to load quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(term) ||
        quiz.description.toLowerCase().includes(term)
      );
      setFilteredQuizzes(filtered);
    } else {
      setFilteredQuizzes(quizzes);
    }
  }, [searchTerm, quizzes]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading quizzes...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4 animate__animated animate__fadeIn">
      <h1 className="mb-4">Explore Quizzes</h1>
      
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form>
            <InputGroup>
              <Form.Control
                placeholder="Search quizzes by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {error && <p className="text-danger">{error}</p>}

      {!loading && filteredQuizzes.length === 0 && (
        <Card className="text-center p-5">
          <Card.Body>
            <h3>No quizzes found</h3>
            <p>Try adjusting your search or check back later for new quizzes.</p>
          </Card.Body>
        </Card>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredQuizzes.map(quiz => (
          <Col key={quiz.id}>
            <QuizCard quiz={quiz} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Explore; 