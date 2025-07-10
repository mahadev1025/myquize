import React, { useState, useEffect } from 'react';
import './App.css';
import html2canvas from 'html2canvas'; // Import html2canvas

function App() {
  const questions = [
    "What is the capital of India?",
    "Who is the PM of India?",
    "Who is the president of India?",
    "What is the capital of Andhra Pradesh?",
    "What is the capital of Maharastra?",
  ];

  const options = [
    ["New Delhi", "Hyderabad", "Bangalore", "Chennai"],
    ["Revanth Reddy", "Narendra Modi", "Amit Shah", "Rahul Gandhi"],
    ["Sonia Gandhi", "Narendra Modi", "Pawan Kalyan", "Draupadi Murmu"],
    ["Warangal", "Hyderabad", "Amaravati", "None of the Above"],
    ["Mumbai", "Nagpur", "Pune", "None of the Above"],
  ];

  const correctAnswers = ["New Delhi", "Narendra Modi", "Draupadi Murmu", "Amaravati", "Mumbai"];
  const marksPerQuestion = 5;
  const passingMarks = 10;

  const [counter, setCounter] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [clickedOption, setClickedOption] = useState(null);
  const [name, setName] = useState('');
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false); // Track if quiz has started
  const [startTime, setStartTime] = useState(null); // To store the start time
  const [endTime, setEndTime] = useState(null); // To store the end time
  const [usersList, setUsersList] = useState([]); // To store the list of users
  const [unansweredQuestions, setUnansweredQuestions] = useState([]); // To store unanswered questions

  useEffect(() => {
    // Retrieve and set the stored users list from localStorage on component mount
    const storedUsers = JSON.parse(localStorage.getItem('usersList')) || [];
    setUsersList(storedUsers);

    let interval = null;
    if (quizStarted && timer > 0 && !showResult) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      handleTimeUp(); // Handle time-up when timer reaches zero
    }
    return () => clearInterval(interval);
  }, [quizStarted, timer, showResult]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const startQuiz = () => {
    if (quizStarted) {
      alert("The quiz has already been started by someone else.");
      return;
    }

    if (name.trim() !== '') {
      setQuizStarted(true); // Set quiz as started
      setStartTime(new Date().toLocaleString()); // Capture the start time

      // Save the user info to localStorage and update the users list
      const newUser = { name, startTime: new Date().toLocaleString() };  // Initialize score
      const updatedUsers = [...usersList, newUser];
      setUsersList(updatedUsers);
      localStorage.setItem('usersList', JSON.stringify(updatedUsers)); // Store the updated list in localStorage
    }
  };

  const handleOptionClick = (selectedOption) => {
    if (clickedOption) return; // Prevent further clicks after an option is selected

    setClickedOption(selectedOption);
    const currentQuestion = questions[counter];
    const correctAnswer = correctAnswers[counter];
    const isCorrect = selectedOption === correctAnswer;

    setSelectedAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: currentQuestion,
        selected: selectedOption,
        correct: correctAnswer,
      },
    ]);

    if (isCorrect) {
      setScore((prevScore) => prevScore + marksPerQuestion);
    }

    // Move to next question after a short delay
    setTimeout(() => {
      if (counter < questions.length - 1) {
        setCounter(counter + 1);
        setClickedOption(null); // Reset clicked option for next question
      } else {
        setEndTime(new Date().toLocaleString());
        setShowResult(true);
      }
    }, 1000); // Delay before showing next question
  };

  const handleTimeUp = () => {
    // Handle when time is up
    setEndTime(new Date().toLocaleString());
    setShowResult(true);

    // Mark unanswered questions
    const unanswered = questions.map((question, index) => {
      if (!selectedAnswers.some(answer => answer.question === question)) {
        return {
          question,
          selected: 'Not Answered',
          correct: correctAnswers[index],
        };
      }
      return null;
    }).filter(Boolean);

    setUnansweredQuestions(unanswered);
  };

  const downloadResultAsImage = () => {
    const resultElement = document.getElementById('result-container');
    
    html2canvas(resultElement).then((canvas) => {
      const dataUrl = canvas.toDataURL('image/png'); // Convert canvas to image
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'quiz_result.png'; // Set download file name
      link.click();
    });
  };

  const clearUsersHistory = () => {
    const password = prompt("Please enter the password to clear user history:");
    if (password === "mahadev77") {
      setUsersList([]); // Clear the users list state
      localStorage.removeItem('usersList'); // Remove the users list from localStorage
      alert("User history cleared permanently.");
    } else {
      alert("Incorrect password. History not cleared.");
    }
  };

  return (
    <div className="container">
      {/* Left side: Displaying permanent users list */}
      <div className="side-info">
        <h3>Users List:</h3>
        <ul>
          {usersList.map((user, index) => (
            <li key={index}>
              <strong>{user.name}</strong> - Started at: {user.startTime} - Score: {user.score}
            </li>
          ))}
        </ul>
        <button onClick={clearUsersHistory}>Clear User History Permanently</button> {/* Button to clear history */}
      </div>

      <div className="quiz-container">
        <h1>My Quiz Application</h1>
        {!quizStarted ? (
          <div className="card">
            <h2>Please enter your full name:</h2>
            <input 
              type="text" 
              value={name} 
              onChange={handleNameChange} 
              placeholder="Enter your full name"
            />
            <button onClick={startQuiz} disabled={quizStarted}>Start Quiz</button> {/* Disable button if quiz is started */}
          </div>
        ) : (
          <div className="card">
            {!showResult ? (
              <>
                <h2>Question No: {counter + 1} / {questions.length} (Each: {marksPerQuestion} Marks)</h2>
                <h3>Time Remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}</h3>
                <h2>{questions[counter]}</h2>
                <ul id="option">
                  {options[counter].map((option, index) => (
                    <li
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className={`option ${clickedOption === option ? 'selected' : ''}`}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <h2>Quiz Completed!</h2>
            )}
          </div>
        )}
      </div>

      <div className="result-container" id="result-container">
        {showResult && (
          <>
            <h3>{name}'s Score: {score} / {questions.length * marksPerQuestion}</h3>
            <h3
              style={{ color: score >= passingMarks ? 'green' : 'red' }}
            >
              {score >= passingMarks ? "Congratulations! You Passed!" : "Better Luck Next Time! You Failed."}
            </h3>
            <h2>Result Summary:</h2>
            <ul>
              {[...selectedAnswers, ...unansweredQuestions].map((answer, index) => (
                <li key={index}>
                  <strong>Q{index + 1}: {answer.question}</strong>
                  <br />
                  Your Answer: {answer.selected}
                  <br />
                  Correct Answer: {answer.correct}
                  <br />
                  <span style={{ color: answer.selected === answer.correct ? 'green' : 'red' }}>
                    {answer.selected === answer.correct ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                  <br />
                </li>
              ))}
            </ul>
            <button onClick={downloadResultAsImage}>Download Result as Image</button>

            <h3>Quiz Started At: {startTime}</h3>
            <h3>Quiz Ended At: {endTime}</h3>
          </>
        )}
      </div>
    </div>
  );
}

export default App;