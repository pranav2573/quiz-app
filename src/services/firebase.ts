import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Quiz, QuizResult } from '../types';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDxVxGXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
  authDomain: "quiz-app-test.firebaseapp.com",
  projectId: "quiz-app-test",
  storageBucket: "quiz-app-test.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Sample data for development
const sampleQuizzes: Quiz[] = [
  {
    id: "quiz1",
    title: "General Knowledge Quiz",
    description: "Test your knowledge with these general trivia questions!",
    createdBy: "system",
    createdAt: new Date(),
    questions: [
      {
        id: "q1",
        text: "What is the capital of France?",
        answers: [
          { id: "a1", text: "London", isCorrect: false },
          { id: "a2", text: "Berlin", isCorrect: false },
          { id: "a3", text: "Paris", isCorrect: true },
          { id: "a4", text: "Madrid", isCorrect: false }
        ]
      },
      {
        id: "q2",
        text: "Which planet is known as the Red Planet?",
        answers: [
          { id: "a1", text: "Venus", isCorrect: false },
          { id: "a2", text: "Mars", isCorrect: true },
          { id: "a3", text: "Jupiter", isCorrect: false },
          { id: "a4", text: "Saturn", isCorrect: false }
        ]
      },
      {
        id: "q3",
        text: "What is the largest ocean on Earth?",
        answers: [
          { id: "a1", text: "Atlantic Ocean", isCorrect: false },
          { id: "a2", text: "Indian Ocean", isCorrect: false },
          { id: "a3", text: "Arctic Ocean", isCorrect: false },
          { id: "a4", text: "Pacific Ocean", isCorrect: true }
        ]
      }
    ]
  },
  {
    id: "quiz2",
    title: "Math Quiz",
    description: "Challenge yourself with these math problems!",
    createdBy: "system",
    createdAt: new Date(),
    questions: [
      {
        id: "q1",
        text: "What is 5 + 7?",
        answers: [
          { id: "a1", text: "10", isCorrect: false },
          { id: "a2", text: "12", isCorrect: true },
          { id: "a3", text: "14", isCorrect: false },
          { id: "a4", text: "15", isCorrect: false }
        ]
      },
      {
        id: "q2",
        text: "What is 8 × 9?",
        answers: [
          { id: "a1", text: "63", isCorrect: false },
          { id: "a2", text: "72", isCorrect: true },
          { id: "a3", text: "81", isCorrect: false },
          { id: "a4", text: "64", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "dsa-quiz",
    title: "Data Structures & Algorithms",
    description: "Test your knowledge of DSA concepts",
    createdBy: "system",
    createdAt: new Date(),
    questions: [
      {
        id: "q1",
        text: "What is the time complexity of binary search?",
        answers: [
          { id: "a1", text: "O(n)", isCorrect: false },
          { id: "a2", text: "O(log n)", isCorrect: true },
          { id: "a3", text: "O(n log n)", isCorrect: false },
          { id: "a4", text: "O(n²)", isCorrect: false }
        ]
      },
      {
        id: "q2",
        text: "Which data structure uses LIFO (Last In First Out)?",
        answers: [
          { id: "a1", text: "Queue", isCorrect: false },
          { id: "a2", text: "Stack", isCorrect: true },
          { id: "a3", text: "Linked List", isCorrect: false },
          { id: "a4", text: "Binary Tree", isCorrect: false }
        ]
      },
      {
        id: "q3",
        text: "What is the worst-case time complexity of quicksort?",
        answers: [
          { id: "a1", text: "O(n)", isCorrect: false },
          { id: "a2", text: "O(log n)", isCorrect: false },
          { id: "a3", text: "O(n log n)", isCorrect: false },
          { id: "a4", text: "O(n²)", isCorrect: true }
        ]
      }
    ]
  },
  {
    id: "os-quiz",
    title: "Operating Systems",
    description: "Test your knowledge of OS concepts",
    createdBy: "system",
    createdAt: new Date(),
    questions: [
      {
        id: "q1",
        text: "Which of the following is not an operating system?",
        answers: [
          { id: "a1", text: "Windows", isCorrect: false },
          { id: "a2", text: "Linux", isCorrect: false },
          { id: "a3", text: "Oracle", isCorrect: true },
          { id: "a4", text: "macOS", isCorrect: false }
        ]
      },
      {
        id: "q2",
        text: "What is a deadlock in operating systems?",
        answers: [
          { id: "a1", text: "When a process is killed", isCorrect: false },
          { id: "a2", text: "When two or more processes are unable to proceed because each is waiting for resources held by the other", isCorrect: true },
          { id: "a3", text: "When the CPU usage is 100%", isCorrect: false },
          { id: "a4", text: "When a program crashes", isCorrect: false }
        ]
      },
      {
        id: "q3",
        text: "Which scheduling algorithm allocates the CPU first to the process with the smallest burst time?",
        answers: [
          { id: "a1", text: "First-Come-First-Served", isCorrect: false },
          { id: "a2", text: "Round Robin", isCorrect: false },
          { id: "a3", text: "Shortest Job First", isCorrect: true },
          { id: "a4", text: "Priority Scheduling", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "programming-quiz",
    title: "Programming Languages",
    description: "Test your knowledge of various programming languages",
    createdBy: "system",
    createdAt: new Date(),
    questions: [
      {
        id: "q1",
        text: "Which language is primarily used for iOS development?",
        answers: [
          { id: "a1", text: "Java", isCorrect: false },
          { id: "a2", text: "Swift", isCorrect: true },
          { id: "a3", text: "C#", isCorrect: false },
          { id: "a4", text: "Python", isCorrect: false }
        ]
      },
      {
        id: "q2",
        text: "Which of these is not a frontend JavaScript framework?",
        answers: [
          { id: "a1", text: "React", isCorrect: false },
          { id: "a2", text: "Angular", isCorrect: false },
          { id: "a3", text: "Vue", isCorrect: false },
          { id: "a4", text: "Django", isCorrect: true }
        ]
      },
      {
        id: "q3",
        text: "Python was created by:",
        answers: [
          { id: "a1", text: "Guido van Rossum", isCorrect: true },
          { id: "a2", text: "James Gosling", isCorrect: false },
          { id: "a3", text: "Brendan Eich", isCorrect: false },
          { id: "a4", text: "Bjarne Stroustrup", isCorrect: false }
        ]
      },
      {
        id: "q4",
        text: "Which language uses curly braces {} to define code blocks?",
        answers: [
          { id: "a1", text: "Python", isCorrect: false },
          { id: "a2", text: "Java", isCorrect: true },
          { id: "a3", text: "Ruby", isCorrect: false },
          { id: "a4", text: "All of the above", isCorrect: false }
        ]
      },
      {
        id: "q5",
        text: "Which language is known for its garbage collection?",
        answers: [
          { id: "a1", text: "C", isCorrect: false },
          { id: "a2", text: "Assembly", isCorrect: false },
          { id: "a3", text: "Java", isCorrect: true },
          { id: "a4", text: "Pascal", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "dcn-quiz",
    title: "Data Communication & Networks",
    description: "Test your knowledge of networking concepts",
    createdBy: "system",
    createdAt: new Date(),
    questions: [
      {
        id: "q1",
        text: "Which layer of the OSI model is responsible for routing?",
        answers: [
          { id: "a1", text: "Physical Layer", isCorrect: false },
          { id: "a2", text: "Data Link Layer", isCorrect: false },
          { id: "a3", text: "Network Layer", isCorrect: true },
          { id: "a4", text: "Transport Layer", isCorrect: false }
        ]
      },
      {
        id: "q2",
        text: "Which protocol is used for secure web browsing?",
        answers: [
          { id: "a1", text: "HTTP", isCorrect: false },
          { id: "a2", text: "HTTPS", isCorrect: true },
          { id: "a3", text: "FTP", isCorrect: false },
          { id: "a4", text: "SMTP", isCorrect: false }
        ]
      },
      {
        id: "q3",
        text: "What is the default subnet mask for a Class C IP address?",
        answers: [
          { id: "a1", text: "255.0.0.0", isCorrect: false },
          { id: "a2", text: "255.255.0.0", isCorrect: false },
          { id: "a3", text: "255.255.255.0", isCorrect: true },
          { id: "a4", text: "255.255.255.255", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "sql-quiz",
    title: "SQL",
    description: "Test your knowledge of SQL and database queries",
    createdBy: "system",
    createdAt: new Date(),
    questions: [
      {
        id: "q1",
        text: "Which SQL command is used to extract data from a database?",
        answers: [
          { id: "a1", text: "INSERT", isCorrect: false },
          { id: "a2", text: "SELECT", isCorrect: true },
          { id: "a3", text: "UPDATE", isCorrect: false },
          { id: "a4", text: "DELETE", isCorrect: false }
        ]
      },
      {
        id: "q2",
        text: "Which of the following is a valid join type in SQL?",
        answers: [
          { id: "a1", text: "RANDOM JOIN", isCorrect: false },
          { id: "a2", text: "SECURE JOIN", isCorrect: false },
          { id: "a3", text: "LEFT JOIN", isCorrect: true },
          { id: "a4", text: "CONNECT JOIN", isCorrect: false }
        ]
      },
      {
        id: "q3",
        text: "Which SQL function returns the number of rows that matches a specified criterion?",
        answers: [
          { id: "a1", text: "SUM()", isCorrect: false },
          { id: "a2", text: "AVG()", isCorrect: false },
          { id: "a3", text: "COUNT()", isCorrect: true },
          { id: "a4", text: "TOTAL()", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "dbms-quiz",
    title: "Database Management Systems",
    description: "Test your knowledge of DBMS concepts",
    createdBy: "system",
    createdAt: new Date(),
    questions: [
      {
        id: "q1",
        text: "Which normal form deals with removing transitive dependencies?",
        answers: [
          { id: "a1", text: "First Normal Form (1NF)", isCorrect: false },
          { id: "a2", text: "Second Normal Form (2NF)", isCorrect: false },
          { id: "a3", text: "Third Normal Form (3NF)", isCorrect: true },
          { id: "a4", text: "Boyce-Codd Normal Form (BCNF)", isCorrect: false }
        ]
      },
      {
        id: "q2",
        text: "What is a foreign key?",
        answers: [
          { id: "a1", text: "A key used to encrypt data in a database", isCorrect: false },
          { id: "a2", text: "A field that connects to the primary key of another table", isCorrect: true },
          { id: "a3", text: "A key that can only be accessed from outside the database", isCorrect: false },
          { id: "a4", text: "A key used only for backup purposes", isCorrect: false }
        ]
      },
      {
        id: "q3",
        text: "ACID properties in DBMS stand for:",
        answers: [
          { id: "a1", text: "Atomicity, Consistency, Isolation, Durability", isCorrect: true },
          { id: "a2", text: "Association, Completion, Integration, Data", isCorrect: false },
          { id: "a3", text: "Authentication, Confidentiality, Integrity, Durability", isCorrect: false },
          { id: "a4", text: "Accuracy, Clarity, Isolation, Determination", isCorrect: false }
        ]
      }
    ]
  }
];

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Mock user for development testing
let mockUser: FirebaseUser | null = null;
let mockResults: QuizResult[] = [];
let mockQuizzes = [...sampleQuizzes];

// Authentication functions
export const registerUser = async (email: string, password: string) => {
  // For development, create a mock user
  mockUser = {
    uid: uuidv4(),
    email,
    emailVerified: true,
    isAnonymous: false,
    displayName: email.split('@')[0],
    providerId: 'mock',
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => '',
    getIdTokenResult: async () => ({ token: '', claims: {}, authTime: '', issuedAtTime: '', expirationTime: '', signInProvider: null, signInSecondFactor: null }),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    photoURL: null
  } as unknown as FirebaseUser;
  
  return { user: mockUser };
};

export const loginUser = async (email: string, password: string) => {
  // For development, simulate login
  if (mockUser && mockUser.email === email) {
    return { user: mockUser };
  }
  
  // Create a new mock user if not exists
  mockUser = {
    uid: uuidv4(),
    email,
    emailVerified: true,
    isAnonymous: false,
    displayName: email.split('@')[0],
    providerId: 'mock',
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => '',
    getIdTokenResult: async () => ({ token: '', claims: {}, authTime: '', issuedAtTime: '', expirationTime: '', signInProvider: null, signInSecondFactor: null }),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    photoURL: null
  } as unknown as FirebaseUser;
  
  return { user: mockUser };
};

export const signOut = async () => {
  mockUser = null;
  return Promise.resolve();
};

export const getCurrentUser = (): FirebaseUser | null => {
  return mockUser;
};

export const onAuthChanged = (callback: (user: FirebaseUser | null) => void) => {
  // Return mock user immediately
  setTimeout(() => callback(mockUser), 100);
  
  // Return unsubscribe function
  return () => {};
};

// Firestore functions
export const createQuiz = async (quizData: any) => {
  const newQuiz = {
    ...quizData,
    id: quizData.id || uuidv4(),
    createdAt: new Date()
  };
  
  mockQuizzes.push(newQuiz);
  return newQuiz.id;
};

export const getUserQuizzes = async (userId: string) => {
  return mockQuizzes.filter(quiz => quiz.createdBy === userId);
};

export const getQuiz = async (quizId: string) => {
  const quiz = mockQuizzes.find(q => q.id === quizId);
  if (!quiz) {
    throw new Error('Quiz not found');
  }
  return quiz;
};

export const getAllQuizzes = async () => {
  return mockQuizzes;
};

export const saveQuizResult = async (resultData: any) => {
  const newResult = {
    ...resultData,
    id: resultData.id || uuidv4(),
    completedAt: new Date()
  };
  
  mockResults.push(newResult);
  return newResult.id;
};

export const getUserResults = async (userId: string) => {
  return mockResults.filter(result => result.userId === userId);
};

// Expanding the DSA quiz to have at least 10 questions
const quizzes = mockQuizzes.find(q => q.id === "dsa-quiz");
if (quizzes) {
  quizzes.questions.push(
    {
      id: "q4",
      text: "Which sorting algorithm has the best average case performance?",
      answers: [
        { id: "a1", text: "Bubble Sort", isCorrect: false },
        { id: "a2", text: "Quick Sort", isCorrect: true },
        { id: "a3", text: "Insertion Sort", isCorrect: false },
        { id: "a4", text: "Selection Sort", isCorrect: false }
      ]
    },
    {
      id: "q5",
      text: "Which data structure is used for implementing recursion?",
      answers: [
        { id: "a1", text: "Queue", isCorrect: false },
        { id: "a2", text: "Stack", isCorrect: true },
        { id: "a3", text: "Array", isCorrect: false },
        { id: "a4", text: "Linked List", isCorrect: false }
      ]
    },
    {
      id: "q6",
      text: "What is the time complexity of insertion in a hash table in the average case?",
      answers: [
        { id: "a1", text: "O(1)", isCorrect: true },
        { id: "a2", text: "O(n)", isCorrect: false },
        { id: "a3", text: "O(log n)", isCorrect: false },
        { id: "a4", text: "O(n²)", isCorrect: false }
      ]
    },
    {
      id: "q7",
      text: "What is a min heap?",
      answers: [
        { id: "a1", text: "A complete binary tree where each node is smaller than its children", isCorrect: true },
        { id: "a2", text: "A complete binary tree where each node is greater than its children", isCorrect: false },
        { id: "a3", text: "A binary search tree with minimum height", isCorrect: false },
        { id: "a4", text: "A linked list where elements are stored in ascending order", isCorrect: false }
      ]
    },
    {
      id: "q8",
      text: "Which of the following is not a graph traversal algorithm?",
      answers: [
        { id: "a1", text: "Depth-First Search", isCorrect: false },
        { id: "a2", text: "Breadth-First Search", isCorrect: false },
        { id: "a3", text: "Quick-First Search", isCorrect: true },
        { id: "a4", text: "Dijkstra's Algorithm", isCorrect: false }
      ]
    },
    {
      id: "q9",
      text: "What data structure would you use to check if a syntax has balanced parentheses?",
      answers: [
        { id: "a1", text: "Queue", isCorrect: false },
        { id: "a2", text: "Stack", isCorrect: true },
        { id: "a3", text: "Linked List", isCorrect: false },
        { id: "a4", text: "Binary Tree", isCorrect: false }
      ]
    },
    {
      id: "q10",
      text: "What is the space complexity of a recursive fibonacci function without memoization?",
      answers: [
        { id: "a1", text: "O(1)", isCorrect: false },
        { id: "a2", text: "O(log n)", isCorrect: false },
        { id: "a3", text: "O(n)", isCorrect: true },
        { id: "a4", text: "O(2^n)", isCorrect: false }
      ]
    }
  );
}

// Expanding the OS quiz to have at least 10 questions
const osQuiz = mockQuizzes.find(q => q.id === "os-quiz");
if (osQuiz) {
  osQuiz.questions.push(
    {
      id: "q4",
      text: "What is thrashing in an operating system?",
      answers: [
        { id: "a1", text: "When a process is continuously swapped in and out of memory", isCorrect: true },
        { id: "a2", text: "When CPU usage is very high", isCorrect: false },
        { id: "a3", text: "When a process crashes", isCorrect: false },
        { id: "a4", text: "When a system restarts unexpectedly", isCorrect: false }
      ]
    },
    {
      id: "q5",
      text: "What is the purpose of virtual memory?",
      answers: [
        { id: "a1", text: "To increase the actual RAM in a computer", isCorrect: false },
        { id: "a2", text: "To provide memory isolation between processes", isCorrect: false },
        { id: "a3", text: "To allow programs to use more memory than physically available", isCorrect: true },
        { id: "a4", text: "To make programs run faster", isCorrect: false }
      ]
    },
    {
      id: "q6",
      text: "Which of the following is not a process state?",
      answers: [
        { id: "a1", text: "Ready", isCorrect: false },
        { id: "a2", text: "Running", isCorrect: false },
        { id: "a3", text: "Blocked", isCorrect: false },
        { id: "a4", text: "Compiling", isCorrect: true }
      ]
    },
    {
      id: "q7",
      text: "What is a context switch?",
      answers: [
        { id: "a1", text: "Switching between user mode and kernel mode", isCorrect: false },
        { id: "a2", text: "Saving the state of one process and loading another", isCorrect: true },
        { id: "a3", text: "Changing the priority of a process", isCorrect: false },
        { id: "a4", text: "Switching between different terminals", isCorrect: false }
      ]
    },
    {
      id: "q8",
      text: "Which scheduling algorithm can lead to starvation?",
      answers: [
        { id: "a1", text: "Round Robin", isCorrect: false },
        { id: "a2", text: "First Come First Served", isCorrect: false },
        { id: "a3", text: "Priority Scheduling", isCorrect: true },
        { id: "a4", text: "Shortest Job First", isCorrect: false }
      ]
    },
    {
      id: "q9",
      text: "What is the purpose of a semaphore in operating systems?",
      answers: [
        { id: "a1", text: "To allocate CPU time to processes", isCorrect: false },
        { id: "a2", text: "To manage access to shared resources", isCorrect: true },
        { id: "a3", text: "To handle memory allocation", isCorrect: false },
        { id: "a4", text: "To manage file system operations", isCorrect: false }
      ]
    },
    {
      id: "q10",
      text: "What is the difference between a hard link and a symbolic link?",
      answers: [
        { id: "a1", text: "Hard links point to the inode, symbolic links point to the file name", isCorrect: true },
        { id: "a2", text: "Hard links are used in Windows, symbolic links in Linux", isCorrect: false },
        { id: "a3", text: "Hard links can cross file systems, symbolic links cannot", isCorrect: false },
        { id: "a4", text: "There is no difference", isCorrect: false }
      ]
    }
  );
}

// Expanding the Programming Languages quiz to have at least 10 questions
const progQuiz = mockQuizzes.find(q => q.id === "programming-quiz");
if (progQuiz) {
  progQuiz.questions.push(
    {
      id: "q6",
      text: "Which of these is a purely functional programming language?",
      answers: [
        { id: "a1", text: "Python", isCorrect: false },
        { id: "a2", text: "JavaScript", isCorrect: false },
        { id: "a3", text: "Haskell", isCorrect: true },
        { id: "a4", text: "C++", isCorrect: false }
      ]
    },
    {
      id: "q7",
      text: "What is TypeScript?",
      answers: [
        { id: "a1", text: "A superset of JavaScript that adds static typing", isCorrect: true },
        { id: "a2", text: "A faster version of JavaScript", isCorrect: false },
        { id: "a3", text: "A programming language for mobile development", isCorrect: false },
        { id: "a4", text: "A database query language", isCorrect: false }
      ]
    },
    {
      id: "q8",
      text: "Which language is primarily used for Android development?",
      answers: [
        { id: "a1", text: "Swift", isCorrect: false },
        { id: "a2", text: "Kotlin", isCorrect: true },
        { id: "a3", text: "C#", isCorrect: false },
        { id: "a4", text: "Ruby", isCorrect: false }
      ]
    },
    {
      id: "q9",
      text: "Which programming language was developed at Google?",
      answers: [
        { id: "a1", text: "Java", isCorrect: false },
        { id: "a2", text: "Python", isCorrect: false },
        { id: "a3", text: "Go", isCorrect: true },
        { id: "a4", text: "PHP", isCorrect: false }
      ]
    },
    {
      id: "q10",
      text: "What does JVM stand for?",
      answers: [
        { id: "a1", text: "Java Virtual Machine", isCorrect: true },
        { id: "a2", text: "JavaScript Virtual Machine", isCorrect: false },
        { id: "a3", text: "Java Visual Markup", isCorrect: false },
        { id: "a4", text: "Joint Venture Method", isCorrect: false }
      ]
    }
  );
}

// Expanding the DCN quiz to have at least 10 questions
const dcnQuiz = mockQuizzes.find(q => q.id === "dcn-quiz");
if (dcnQuiz) {
  dcnQuiz.questions.push(
    {
      id: "q4",
      text: "What is the purpose of DNS?",
      answers: [
        { id: "a1", text: "To encrypt data for secure transmission", isCorrect: false },
        { id: "a2", text: "To translate domain names to IP addresses", isCorrect: true },
        { id: "a3", text: "To route packets across networks", isCorrect: false },
        { id: "a4", text: "To establish secure connections", isCorrect: false }
      ]
    },
    {
      id: "q5",
      text: "Which protocol is used for sending emails?",
      answers: [
        { id: "a1", text: "HTTP", isCorrect: false },
        { id: "a2", text: "FTP", isCorrect: false },
        { id: "a3", text: "SMTP", isCorrect: true },
        { id: "a4", text: "SSH", isCorrect: false }
      ]
    },
    {
      id: "q6",
      text: "What is a MAC address?",
      answers: [
        { id: "a1", text: "A unique identifier assigned to network interfaces", isCorrect: true },
        { id: "a2", text: "A type of Apple computer", isCorrect: false },
        { id: "a3", text: "A network security protocol", isCorrect: false },
        { id: "a4", text: "An IP address for local networks", isCorrect: false }
      ]
    },
    {
      id: "q7",
      text: "Which of the following is not a transport layer protocol?",
      answers: [
        { id: "a1", text: "TCP", isCorrect: false },
        { id: "a2", text: "UDP", isCorrect: false },
        { id: "a3", text: "ICMP", isCorrect: true },
        { id: "a4", text: "SCTP", isCorrect: false }
      ]
    },
    {
      id: "q8",
      text: "What is the maximum data rate of standard 802.11n Wi-Fi?",
      answers: [
        { id: "a1", text: "54 Mbps", isCorrect: false },
        { id: "a2", text: "100 Mbps", isCorrect: false },
        { id: "a3", text: "600 Mbps", isCorrect: true },
        { id: "a4", text: "1 Gbps", isCorrect: false }
      ]
    },
    {
      id: "q9",
      text: "Which protocol provides reliable data transfer?",
      answers: [
        { id: "a1", text: "UDP", isCorrect: false },
        { id: "a2", text: "IP", isCorrect: false },
        { id: "a3", text: "TCP", isCorrect: true },
        { id: "a4", text: "ARP", isCorrect: false }
      ]
    },
    {
      id: "q10",
      text: "What is a firewall?",
      answers: [
        { id: "a1", text: "A device that prevents unauthorized access to a network", isCorrect: true },
        { id: "a2", text: "A device that boosts network signals", isCorrect: false },
        { id: "a3", text: "A protocol for secure file transfer", isCorrect: false },
        { id: "a4", text: "A hardware device that connects different networks", isCorrect: false }
      ]
    }
  );
}

// Expanding the SQL quiz to have at least 10 questions
const sqlQuiz = mockQuizzes.find(q => q.id === "sql-quiz");
if (sqlQuiz) {
  sqlQuiz.questions.push(
    {
      id: "q4",
      text: "Which SQL statement is used to update data in a database?",
      answers: [
        { id: "a1", text: "SAVE", isCorrect: false },
        { id: "a2", text: "MODIFY", isCorrect: false },
        { id: "a3", text: "UPDATE", isCorrect: true },
        { id: "a4", text: "ALTER", isCorrect: false }
      ]
    },
    {
      id: "q5",
      text: "Which SQL clause is used to filter the results of a query?",
      answers: [
        { id: "a1", text: "WHERE", isCorrect: true },
        { id: "a2", text: "HAVING", isCorrect: false },
        { id: "a3", text: "GROUP BY", isCorrect: false },
        { id: "a4", text: "FROM", isCorrect: false }
      ]
    },
    {
      id: "q6",
      text: "Which SQL statement is used to delete data from a database?",
      answers: [
        { id: "a1", text: "REMOVE", isCorrect: false },
        { id: "a2", text: "DELETE", isCorrect: true },
        { id: "a3", text: "DROP", isCorrect: false },
        { id: "a4", text: "CLEAR", isCorrect: false }
      ]
    },
    {
      id: "q7",
      text: "Which SQL function is used to find the highest value in a column?",
      answers: [
        { id: "a1", text: "MAX()", isCorrect: true },
        { id: "a2", text: "TOP()", isCorrect: false },
        { id: "a3", text: "HIGHEST()", isCorrect: false },
        { id: "a4", text: "UPPER()", isCorrect: false }
      ]
    },
    {
      id: "q8",
      text: "What is the purpose of the GROUP BY clause?",
      answers: [
        { id: "a1", text: "To sort the result set", isCorrect: false },
        { id: "a2", text: "To group rows that have the same values", isCorrect: true },
        { id: "a3", text: "To filter rows before grouping", isCorrect: false },
        { id: "a4", text: "To limit the number of rows returned", isCorrect: false }
      ]
    },
    {
      id: "q9",
      text: "Which SQL constraint is used to ensure that all values in a column are different?",
      answers: [
        { id: "a1", text: "UNIQUE", isCorrect: true },
        { id: "a2", text: "DISTINCT", isCorrect: false },
        { id: "a3", text: "DIFFERENT", isCorrect: false },
        { id: "a4", text: "NOT NULL", isCorrect: false }
      ]
    },
    {
      id: "q10",
      text: "What is a SQL view?",
      answers: [
        { id: "a1", text: "A virtual table based on the result-set of an SQL statement", isCorrect: true },
        { id: "a2", text: "A graphical representation of database tables", isCorrect: false },
        { id: "a3", text: "A physical copy of a table", isCorrect: false },
        { id: "a4", text: "A stored procedure that returns data", isCorrect: false }
      ]
    }
  );
}

// Expanding the DBMS quiz to have at least 10 questions
const dbmsQuiz = mockQuizzes.find(q => q.id === "dbms-quiz");
if (dbmsQuiz) {
  dbmsQuiz.questions.push(
    {
      id: "q4",
      text: "What is data redundancy?",
      answers: [
        { id: "a1", text: "When data is stored only once in a database", isCorrect: false },
        { id: "a2", text: "When the same data is stored multiple times", isCorrect: true },
        { id: "a3", text: "When data is lost during transmission", isCorrect: false },
        { id: "a4", text: "When data is compressed for storage", isCorrect: false }
      ]
    },
    {
      id: "q5",
      text: "What is a primary key?",
      answers: [
        { id: "a1", text: "A key used to encrypt database records", isCorrect: false },
        { id: "a2", text: "A unique identifier for a record in a table", isCorrect: true },
        { id: "a3", text: "The first column in every database table", isCorrect: false },
        { id: "a4", text: "A key that can be changed at any time", isCorrect: false }
      ]
    },
    {
      id: "q6",
      text: "What is normalization in DBMS?",
      answers: [
        { id: "a1", text: "The process of compressing data", isCorrect: false },
        { id: "a2", text: "The process of organizing data to reduce redundancy", isCorrect: true },
        { id: "a3", text: "The process of converting data to text format", isCorrect: false },
        { id: "a4", text: "The process of adding security to databases", isCorrect: false }
      ]
    },
    {
      id: "q7",
      text: "Which of the following is not a type of database model?",
      answers: [
        { id: "a1", text: "Relational", isCorrect: false },
        { id: "a2", text: "Hierarchical", isCorrect: false },
        { id: "a3", text: "Network", isCorrect: false },
        { id: "a4", text: "Transitional", isCorrect: true }
      ]
    },
    {
      id: "q8",
      text: "What is a transaction in DBMS?",
      answers: [
        { id: "a1", text: "A unit of work performed against a database", isCorrect: true },
        { id: "a2", text: "A payment made to use the database", isCorrect: false },
        { id: "a3", text: "The process of creating a new table", isCorrect: false },
        { id: "a4", text: "The process of backing up a database", isCorrect: false }
      ]
    },
    {
      id: "q9",
      text: "What is database sharding?",
      answers: [
        { id: "a1", text: "Breaking a database into smaller, more manageable pieces", isCorrect: true },
        { id: "a2", text: "Deleting unnecessary data from a database", isCorrect: false },
        { id: "a3", text: "Combining multiple databases into one", isCorrect: false },
        { id: "a4", text: "Encrypting sensitive data in a database", isCorrect: false }
      ]
    },
    {
      id: "q10",
      text: "What is an index in a database?",
      answers: [
        { id: "a1", text: "A list of all tables in the database", isCorrect: false },
        { id: "a2", text: "A data structure that improves the speed of data retrieval", isCorrect: true },
        { id: "a3", text: "The first column of any table", isCorrect: false },
        { id: "a4", text: "A constraint that enforces data integrity", isCorrect: false }
      ]
    }
  );
}

// Expanding the Math Quiz to have at least 10 questions
const mathQuiz = mockQuizzes.find(q => q.id === "quiz2");
if (mathQuiz) {
  mathQuiz.questions.push(
    {
      id: "q3",
      text: "What is 12 ÷ 4?",
      answers: [
        { id: "a1", text: "2", isCorrect: false },
        { id: "a2", text: "3", isCorrect: true },
        { id: "a3", text: "4", isCorrect: false },
        { id: "a4", text: "6", isCorrect: false }
      ]
    },
    {
      id: "q4",
      text: "What is the square root of 144?",
      answers: [
        { id: "a1", text: "10", isCorrect: false },
        { id: "a2", text: "12", isCorrect: true },
        { id: "a3", text: "14", isCorrect: false },
        { id: "a4", text: "16", isCorrect: false }
      ]
    },
    {
      id: "q5",
      text: "What is 3² + 4²?",
      answers: [
        { id: "a1", text: "7", isCorrect: false },
        { id: "a2", text: "25", isCorrect: true },
        { id: "a3", text: "49", isCorrect: false },
        { id: "a4", text: "16", isCorrect: false }
      ]
    },
    {
      id: "q6",
      text: "If x + 5 = 12, what is the value of x?",
      answers: [
        { id: "a1", text: "5", isCorrect: false },
        { id: "a2", text: "7", isCorrect: true },
        { id: "a3", text: "17", isCorrect: false },
        { id: "a4", text: "8", isCorrect: false }
      ]
    },
    {
      id: "q7",
      text: "What is the area of a rectangle with length 8 and width 5?",
      answers: [
        { id: "a1", text: "13", isCorrect: false },
        { id: "a2", text: "26", isCorrect: false },
        { id: "a3", text: "40", isCorrect: true },
        { id: "a4", text: "30", isCorrect: false }
      ]
    },
    {
      id: "q8",
      text: "What is 25% of 80?",
      answers: [
        { id: "a1", text: "15", isCorrect: false },
        { id: "a2", text: "20", isCorrect: true },
        { id: "a3", text: "25", isCorrect: false },
        { id: "a4", text: "40", isCorrect: false }
      ]
    },
    {
      id: "q9",
      text: "If a triangle has angles of 30° and 60°, what is the third angle?",
      answers: [
        { id: "a1", text: "60°", isCorrect: false },
        { id: "a2", text: "90°", isCorrect: true },
        { id: "a3", text: "120°", isCorrect: false },
        { id: "a4", text: "180°", isCorrect: false }
      ]
    },
    {
      id: "q10",
      text: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
      answers: [
        { id: "a1", text: "24", isCorrect: false },
        { id: "a2", text: "32", isCorrect: true },
        { id: "a3", text: "20", isCorrect: false },
        { id: "a4", text: "64", isCorrect: false }
      ]
    }
  );
}

// Expanding the General Knowledge Quiz to have at least 10 questions
const gkQuiz = mockQuizzes.find(q => q.id === "quiz1");
if (gkQuiz) {
  gkQuiz.questions.push(
    {
      id: "q4",
      text: "Which planet is known as the 'Morning Star'?",
      answers: [
        { id: "a1", text: "Mars", isCorrect: false },
        { id: "a2", text: "Jupiter", isCorrect: false },
        { id: "a3", text: "Venus", isCorrect: true },
        { id: "a4", text: "Mercury", isCorrect: false }
      ]
    },
    {
      id: "q5",
      text: "Who painted the Mona Lisa?",
      answers: [
        { id: "a1", text: "Vincent Van Gogh", isCorrect: false },
        { id: "a2", text: "Leonardo da Vinci", isCorrect: true },
        { id: "a3", text: "Pablo Picasso", isCorrect: false },
        { id: "a4", text: "Michelangelo", isCorrect: false }
      ]
    },
    {
      id: "q6",
      text: "Which country is known as the Land of the Rising Sun?",
      answers: [
        { id: "a1", text: "China", isCorrect: false },
        { id: "a2", text: "South Korea", isCorrect: false },
        { id: "a3", text: "Japan", isCorrect: true },
        { id: "a4", text: "Thailand", isCorrect: false }
      ]
    },
    {
      id: "q7",
      text: "What is the chemical symbol for gold?",
      answers: [
        { id: "a1", text: "Go", isCorrect: false },
        { id: "a2", text: "Gd", isCorrect: false },
        { id: "a3", text: "Au", isCorrect: true },
        { id: "a4", text: "Ag", isCorrect: false }
      ]
    },
    {
      id: "q8",
      text: "Which is the smallest continent by land area?",
      answers: [
        { id: "a1", text: "Europe", isCorrect: false },
        { id: "a2", text: "Australia", isCorrect: true },
        { id: "a3", text: "Antarctica", isCorrect: false },
        { id: "a4", text: "South America", isCorrect: false }
      ]
    },
    {
      id: "q9",
      text: "What is the national flower of Japan?",
      answers: [
        { id: "a1", text: "Rose", isCorrect: false },
        { id: "a2", text: "Lotus", isCorrect: false },
        { id: "a3", text: "Cherry Blossom", isCorrect: true },
        { id: "a4", text: "Tulip", isCorrect: false }
      ]
    },
    {
      id: "q10",
      text: "Who wrote 'Romeo and Juliet'?",
      answers: [
        { id: "a1", text: "Charles Dickens", isCorrect: false },
        { id: "a2", text: "William Shakespeare", isCorrect: true },
        { id: "a3", text: "Jane Austen", isCorrect: false },
        { id: "a4", text: "Mark Twain", isCorrect: false }
      ]
    }
  );
}

export { db, auth }; 