import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Question(props) {
  const id = props.question.questionID;
  const [question, setQuestion] = useState();
  const [answered, setAnswered] = useState(false);
  const loadQuestion = () => {
    fetch(`/api/questions/${id}?containAnswers=true&forRound=${props.roundId}`, {
      headers: new Headers({
        'authentication': window.user.token
      })
    })
      .then((question) => question.json())
      .then((question) => setQuestion(question));
  }
  console.log(question)
  useEffect(loadQuestion, [id])
  if (question) {
    return (
      <div className="question">
        <span className="question-medium">
          {question[0].text}
        </span>
        <div className="answer-buttons">
          {question[1].map((answer) => <button className={"answer-button " + (answered === true ? (answer.isCorrect == 1 ? 'correct' : 'incorrect') : '')} key={answer.id} onClick={() => {
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
                setAnswered(true);
                setTimeout(() => { props.roundDone(); setAnswered(false) }, 2000);
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
