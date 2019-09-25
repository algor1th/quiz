import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Question(props) {
  const id = props.question.questionID;
  const [question, setQuestion] = useState();
  console.log(props.qId)
  const loadQuestion = () => {
    fetch(`/api/questions/${id}?containAnswers=true`, {
      headers: new Headers({
        'authentication': window.user.token
      })
    })
      .then((question) => question.json())
      .then((question) => setQuestion(question));
  }
  useEffect(loadQuestion, [id])
  console.log(question);
  if (question) {
    return (
      <div className="question">
        <span className="question-medium">
          {question[0].text}
        </span>
        <div className="answer-buttons">
          {question[1].map((answer) => <button className="answer-button" key={answer.id} onClick={() => {
            const bdy = JSON.stringify({ "answerID": answer.id })
            fetch(`/api/rounds/${props.roundId}`, {
              headers: new Headers({
                'Content-Type': 'application/json',
                'authentication': window.user.token
              }),
              method: 'PUT',
              body: bdy
            }).then((body) => body.json())
              .then((body) => {
                console.log(body);
                props.roundDone();
              });
          }}>{answer.text}</button>)}
        </div>

      </div>
    );
  } else return (
    <>
      <h1>waiting for turn</h1>
      <button onClick={loadQuestion}>refresh</button>
      <Link to='/'>Start screen</Link>
    </>);

}

export default Question;
