import React from 'react';
import './App.css';
import { useState, useEffect } from 'react'
import Question from './Question'

function Round({ match }) {
  // let question = api.getQuestion(match.params.qId)
  const [round, setRound] = useState();
  const [currentround, setcurrentround] = useState(0);
  useEffect(() => {
    fetch(`/api/rounds?forGame=${match.params.gId}`, {
      headers: new Headers({
        'authentication': window.user
      })
    })
      .then((round) => round.json())
      .then((round) => setRound(round));
  }, [match.params.gId])
  console.log(round);
  if (round) {
    return (
      <>
        <Question question={round.questions[currentround]} roundId={round.id}></Question>
        <input type="number" value={currentround} onChange={(e) => {
          e.preventDefault();
          const newVal = e.target.value;
          if (newVal < round.questions.length) {
            setcurrentround(newVal);
          }
          console.log(e.target.value)
        }
        }>
        </input>
      </>
    );
  } else return <h1>loading...</h1>

}

export default Round;
