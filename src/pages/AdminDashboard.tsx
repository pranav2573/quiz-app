import React, { useEffect, useState } from 'react';
import { Container, Table, Card, Row, Col, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface VisitData {
  id: string;
  isLoggedIn: boolean;
  userId: string | null;
  timestamp: string;
  userAgent: string;
  path: string;
}

const AdminDashboard: React.FC = () => {
  const [visits, setVisits] = useState<VisitData[]>([]);
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    loggedInVisits: 0,
    guestVisits: 0
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only admins should access this page
    // For demo purposes, we're just checking if a user is logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Get visit data from localStorage
    try {
      const visitData = JSON.parse(localStorage.getItem('siteVisits') || '[]') as VisitData[];
      setVisits(visitData);

      // Calculate stats
      const uniqueIds = new Set(visitData.map(visit => visit.id));
      const loggedInVisits = visitData.filter(visit => visit.isLoggedIn).length;

      setStats({
        totalVisits: visitData.length,
        uniqueVisitors: uniqueIds.size,
        loggedInVisits,
        guestVisits: visitData.length - loggedInVisits
      });
    } catch (error) {
      console.error('Error loading visit data:', error);
    }
  }, [currentUser, navigate]);

  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{stats.totalVisits}</h3>
              <Card.Text>Total Visits</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{stats.uniqueVisitors}</h3>
              <Card.Text>Unique Visitors</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{stats.loggedInVisits}</h3>
              <Card.Text>Logged In Visits</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <h3>{stats.guestVisits}</h3>
              <Card.Text>Guest Visits</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h2 className="h5 mb-0">Recent Visits</h2>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Visitor ID</th>
                  <th>Type</th>
                  <th>Timestamp</th>
                  <th>Path</th>
                </tr>
              </thead>
              <tbody>
                {visits.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">No visitor data available yet</td>
                  </tr>
                ) : (
                  visits.map((visit, index) => (
                    <tr key={index}>
                      <td>
                        <small className="text-muted">{visit.id}</small>
                      </td>
                      <td>
                        {visit.isLoggedIn ? (
                          <Badge bg="success">Logged In</Badge>
                        ) : (
                          <Badge bg="secondary">Guest</Badge>
                        )}
                      </td>
                      <td>
                        {new Date(visit.timestamp).toLocaleString()}
                      </td>
                      <td>{visit.path}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard; 