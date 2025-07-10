import React from 'react';
import './App.css';

function Final() {
  return (
    <div className="final">
      <h1>Your Quiz is Over</h1>
      <button onClick={() => window.location.reload()}>Restart Quiz</button>
      
    </div>
  );
}

export default Final;
