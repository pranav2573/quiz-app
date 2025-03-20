import React from 'react';
import { Container } from 'react-bootstrap';
import QuizForm from '../components/QuizForm';

const CreateQuiz: React.FC = () => {
  return (
    <Container className="animate__animated animate__fadeIn">
      <h1 className="mb-4">Create a New Quiz</h1>
      <QuizForm />
    </Container>
  );
};

export default CreateQuiz; 