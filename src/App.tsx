import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import CreateQuiz from './pages/CreateQuiz';
import MyQuizzes from './pages/MyQuizzes';
import QuizPage from './pages/QuizPage';
import NotFound from './pages/NotFound';
import QuizDetail from './pages/QuizDetail';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import VisitorTracker from './components/VisitorTracker';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import animate.css for animations
import 'animate.css';
// Import custom CSS
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <VisitorTracker />
        <Navbar />
        <Container className="py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/quiz-detail/:id" element={<QuizDetail />} />
            <Route path="/create-quiz" element={<PrivateRoute><CreateQuiz /></PrivateRoute>} />
            <Route path="/my-quizzes" element={<PrivateRoute><MyQuizzes /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;
