import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Quiz } from '../types';

interface QuizCardProps {
  quiz: Quiz;
  isOwner?: boolean;
  onDelete?: (quizId: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, isOwner, onDelete }) => {
  return (
    <Card className="h-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h5 mb-2">{quiz.title}</Card.Title>
        <Card.Text className="text-muted mb-3">{quiz.description}</Card.Text>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="badge bg-light text-dark">
            {quiz.questions.length} Questions
          </span>
          <div className="d-flex gap-2">
            {isOwner && onDelete && (
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => onDelete(quiz.id)}
              >
                Delete
              </Button>
            )}
            <Link to={`/quiz/${quiz.id}`}>
              <Button variant="primary" size="sm">
                Start Quiz
              </Button>
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuizCard; 