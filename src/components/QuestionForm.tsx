import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Question, Answer } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface QuestionFormProps {
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ 
  question, 
  onSave, 
  onCancel 
}) => {
  const [text, setText] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([
    { id: uuidv4(), text: '', isCorrect: false },
    { id: uuidv4(), text: '', isCorrect: false },
    { id: uuidv4(), text: '', isCorrect: false },
    { id: uuidv4(), text: '', isCorrect: false }
  ]);

  useEffect(() => {
    if (question) {
      setText(question.text);
      setAnswers(question.answers);
    }
  }, [question]);

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(answers.map(answer => 
      answer.id === id ? { ...answer, text: value } : answer
    ));
  };

  const handleCorrectAnswerChange = (id: string) => {
    setAnswers(answers.map(answer => 
      ({ ...answer, isCorrect: answer.id === id })
    ));
  };

  const handleAddAnswer = () => {
    if (answers.length < 8) {
      setAnswers([...answers, { id: uuidv4(), text: '', isCorrect: false }]);
    }
  };

  const handleRemoveAnswer = (id: string) => {
    if (answers.length > 2) {
      const newAnswers = answers.filter(answer => answer.id !== id);
      
      // If we removed the correct answer, set the first one as correct
      const hasCorrectAnswer = newAnswers.some(answer => answer.isCorrect);
      if (!hasCorrectAnswer && newAnswers.length > 0) {
        newAnswers[0].isCorrect = true;
      }
      
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!text.trim()) {
      alert('Please enter a question');
      return;
    }
    
    const filledAnswers = answers.filter(a => a.text.trim());
    if (filledAnswers.length < 2) {
      alert('Please provide at least two answers');
      return;
    }
    
    const hasCorrectAnswer = filledAnswers.some(a => a.isCorrect);
    if (!hasCorrectAnswer) {
      alert('Please select a correct answer');
      return;
    }
    
    const newQuestion: Question = {
      id: question?.id || uuidv4(),
      text: text.trim(),
      answers: filledAnswers
    };
    
    onSave(newQuestion);
    
    // Reset form if not editing
    if (!question) {
      setText('');
      setAnswers([
        { id: uuidv4(), text: '', isCorrect: true },
        { id: uuidv4(), text: '', isCorrect: false },
        { id: uuidv4(), text: '', isCorrect: false },
        { id: uuidv4(), text: '', isCorrect: false }
      ]);
    }
  };

  return (
    <Card className="shadow-sm mb-4 border-primary-subtle animate__animated animate__fadeIn">
      <Card.Header className="bg-primary-subtle">
        <h5 className="mb-0">{question ? 'Edit Question' : 'Add New Question'}</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Question</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your question"
              required
              className="shadow-sm"
            />
          </Form.Group>

          <p className="fw-bold mb-2">Answers</p>
          <div className="mb-3">
            {answers.map((answer, index) => (
              <div 
                key={answer.id} 
                className="d-flex mb-2 align-items-center gap-2 animate__animated animate__fadeIn"
              >
                <Form.Check
                  type="radio"
                  id={`correct-${answer.id}`}
                  name="correctAnswer"
                  checked={answer.isCorrect}
                  onChange={() => handleCorrectAnswerChange(answer.id)}
                  label=""
                  className="me-2"
                />
                <Form.Control
                  value={answer.text}
                  onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                  placeholder={`Answer ${index + 1}`}
                  className={`flex-grow-1 ${answer.isCorrect ? 'border-success' : ''}`}
                />
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => handleRemoveAnswer(answer.id)}
                  disabled={answers.length <= 2}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between mb-4">
            <Button 
              variant="outline-primary" 
              type="button" 
              onClick={handleAddAnswer}
              disabled={answers.length >= 8}
              size="sm"
            >
              + Add Answer
            </Button>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Question
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default QuestionForm; 