import React from 'react';
import './App.css';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import shuffle from 'shuffle-array'

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Question(props) {
  const id = props.question.questionID;
  const [question, setQuestion] = useState();
  const [answered, setAnswered] = useState(false);
  const [time, setTime] = useState();
  const loadQuestion = () => {
    fetch(`/api/questions/${id}?containAnswers=true&forRound=${props.roundId}`, {
      headers: new Headers({
        'authentication': window.user.token
      })
    })
      .then((question) => question.json())
      .then((question) => {
        question[1] = shuffle(question[1])
        setQuestion(question)
      });
  }
  useEffect(() => {
    if (answered) {
      setTimeout(() => {
        setAnswered(false);
        setTime(10);
        props.roundDone()
      }, 2000);
    }
  }, [answered, props])
  useInterval(() => {
    if (time === 0) {
      fetch(`/api/rounds/${props.roundId}`, {
        headers: new Headers({
          'Content-Type': 'application/json',
          'authentication': window.user.token
        }),
        method: 'PUT',
        body: JSON.stringify({ 'answerID': -1 })
      })
        .then((body) => {
          setAnswered(true);
        });
    } else if (!time) {
      setTime(10);
    } else if (!answered) {
      setTime(time - 1);
    }
  }, 1000)
  console.log(question)
  useEffect(loadQuestion, [id])
  if (question) {
    return (
      <div className="question">
        <span className="question-medium">
          {question[0].text}
        </span>
        <p>you have {time} seconds left to answer</p>
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
