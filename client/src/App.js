import React, { useState, useEffect } from 'react';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

function App() {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch history from API on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/greetings`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        const res = await fetch(`${API_URL}/greetings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

  const clearHistory = async () => {
    try {
      await fetch(`${API_URL}/greetings`, { method: 'DELETE' });
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

  return (
    <div className="app">
      <h1>Greeting App</h1>

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
