import React, { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');

  // Load history from localStorage on initial render (lazy initialization)
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('nameHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nameHistory', JSON.stringify(history));
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setGreeting(`Hello, ${name}!`);
      setHistory([...history, { name: name.trim(), timestamp: new Date().toLocaleString() }]);
      setName('');
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setGreeting('');
    localStorage.removeItem('nameHistory');
  };

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
            {history.map((entry, index) => (
              <li key={index}>
                <span className="name">{entry.name}</span>
                <span className="timestamp">{entry.timestamp}</span>
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
