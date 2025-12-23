import React, { useState, useEffect } from 'react';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

function App() {
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Greeting state
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch history when logged in
  useEffect(() => {
    if (token) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Auth headers helper
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  // Handle login/register
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch(`${API_URL}/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error);
        return;
      }

      // Save token
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setEmail('');
      setPassword('');
    } catch (err) {
      setAuthError('Something went wrong');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setHistory([]);
    setGreeting('');
  };

  // Fetch greeting history
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/greetings`, {
        headers: authHeaders()
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle greeting submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        const res = await fetch(`${API_URL}/greetings`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ name: name.trim() })
        });
        const newGreeting = await res.json();
        setGreeting(`Hello, ${name}!`);
        setHistory([...history, newGreeting]);
        setName('');
      } catch (err) {
        console.error('Failed to save greeting:', err);
      }
    }
  };

  // Clear history
  const clearHistory = async () => {
    try {
      await fetch(`${API_URL}/greetings`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      setHistory([]);
      setGreeting('');
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return <div className="app"><p>Loading...</p></div>;
  }

  // Show login/register form if not authenticated
  if (!token) {
    return (
      <div className="app">
        <h1>Greeting App</h1>

        <div className="auth-container">
          <div className="auth-tabs">
            <button
              className={authMode === 'login' ? 'active' : ''}
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
            >
              Login
            </button>
            <button
              className={authMode === 'register' ? 'active' : ''}
              onClick={() => { setAuthMode('register'); setAuthError(''); }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuth} className="auth-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              minLength={6}
              required
            />
            {authError && <p className="error">{authError}</p>}
            <button type="submit">
              {authMode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main app (authenticated)
  return (
    <div className="app">
      <div className="header">
        <h1>Greeting App</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button type="submit">Greet Me</button>
      </form>

      {greeting && <div className="greeting">{greeting}</div>}

      {history.length > 0 && (
        <div className="history">
          <h2>History</h2>
          <ul>
            {history.map((entry) => (
              <li key={entry._id}>
                <span className="name">{entry.name}</span>
                <span className="timestamp">{formatDate(entry.timestamp)}</span>
              </li>
            ))}
          </ul>
          <button onClick={clearHistory} className="clear-btn">Clear History</button>
        </div>
      )}
    </div>
  );
}

export default App;
