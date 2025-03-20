import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Component that silently tracks visitor information
 * This component doesn't render anything visible
 */
const VisitorTracker: React.FC = () => {
  const { currentUser } = useAuth();
  const [visitorId, setVisitorId] = useState<string>('');
  
  useEffect(() => {
    // Generate a simple visitor ID if not already stored
    const getVisitorId = () => {
      let id = localStorage.getItem('visitorId');
      if (!id) {
        id = 'visitor_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('visitorId', id);
      }
      return id;
    };
    
    const id = getVisitorId();
    setVisitorId(id);
    
    // Log visitor information
    console.log('Visitor ID:', id);
    console.log('Visitor type:', currentUser ? 'Logged in user' : 'Guest');
    console.log('Visit time:', new Date().toISOString());
    
    // Track this visit
    const trackVisit = async () => {
      try {
        // In a real app, you'd send this data to your server
        // For now, we just log it to console and localStorage
        const visitData = {
          id,
          isLoggedIn: !!currentUser,
          userId: currentUser?.uid || null,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          path: window.location.pathname
        };
        
        // Store visit in localStorage for demo purposes
        const visits = JSON.parse(localStorage.getItem('siteVisits') || '[]');
        visits.push(visitData);
        localStorage.setItem('siteVisits', JSON.stringify(visits));
        
        console.log('Visit tracked:', visitData);
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };
    
    trackVisit();
    
    // Track page navigation
    const handleRouteChange = () => {
      console.log('Page changed to:', window.location.pathname);
      // In a real app, you'd track this navigation event
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [currentUser]);
  
  // This component doesn't render anything visible
  return null;
};

export default VisitorTracker; 