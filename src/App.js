import React, { useState } from 'react'
import './App.css'
import Final from './Final'

function App() {

    const question=[
      "What is the capital of India?",
      "Who is the PM of India?",
      "Who is president of India?",
      "What is the capital of Andhra Pradesh ?"
    ]

    const options=[
      {
        optionvalue:[
          "New Delhi",
          "Hyderabad",
          "Banglore",
          "Chennai"
        ]
      },
      {
        optionvalue:[
        "Revanth Reddy",
        "Narendra Modi",
        "Amit Shah",
        "Rahul Gandhi"
        ]
      },
      {
        optionvalue:[
        "Sonia Gandhi",
        "Narendra Modi",
        "Pawan kalyan",
        "Draupadi Murmu"
        ]
      },
      {
        optionvalue:[
        "Warangal",
        "Hyderabad",
        "Amrawati",
        "None of the Above"
        ]
      }
    ]

    

    const[counter, setCounter] = useState(0)
    const[score, setScore] = useState(0)
   
    let temp;
    function CheckAnswer(index){
      
      if(options[counter].optionvalue[index]=="Narendra Modi"){
        temp = score+1
        setScore(temp)
        console.log(temp)
        console.log("second if")
      }
      
      if(options[counter].optionvalue[index]=="New Delhi"){
      temp = score+1
        setScore(temp)
        console.log(temp)
        console.log("first if")
      }

      if(options[counter].optionvalue[index]=="Draupadi Murmu"){
         temp = score+1
        setScore(temp)
        console.log(temp)
        console.log("third if")
      }

      if(options[counter].optionvalue[index]=="Amrawati"){
       temp = score+1
        setScore(temp)
        console.log(temp)
        console.log("fourth if")
      }
    }

   
    const Change=(index)=>{
      CheckAnswer(index);
      setCounter(counter+1)
      
    }

   
    if(counter<=3){
      return (
        <div className="container">
          <h1>My Quiz Application</h1>
            <div className="card">
                <h2>Question No: {counter+1} /4</h2>
    
                <h2>{question[counter]}</h2>
                
                <div id="option">
                  {options[counter].optionvalue.map((x,index)=> <li key={index} onClick={()=>{Change(index)}} id={index}>{x}</li>)}
    
                </div>
                
                <br />
            </div>
        </div>
      )
    }
    else{
      return(
        <>
          <Final />
          <h1 id="answer">Your score is : {score} / 4</h1>
        </>
      );
    }

  
}

export default App