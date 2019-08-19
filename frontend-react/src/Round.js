import React from 'react';
import './App.css';
import { useState, useEffect } from 'react'
import Question from './Question'
import { Redirect } from 'react-router-dom';

function Round({ match }) {
  // let question = api.getQuestion(match.params.qId)
  const [round, setRound] = useState();
  const [currentround, setcurrentround] = useState(0);
  useEffect(() => {
    fetch(`/api/rounds?forGame=${match.params.gId}`, {
      headers: new Headers({
        'authentication': window.user.token
      })
    })
      .then((round) => round.json())
      .then((round) => setRound(round));
  }, [match.params.gId]);
  useEffect(() => {
    if (round.questions[currentround].an) {

    }
  }, [currentround])
  console.log(round);
  function roundDone() {
    setcurrentround(currentround + 1)
  }
  if (round) {
    if (currentround < round.questions.length) {
      return (
        <>
          <Question question={round.questions[currentround]} roundId={round.id} roundDone={roundDone}></Question>
          <span>Question {currentround}</span>
        </>
      );
    } else {
      return <Redirect to="/"></Redirect>
    }
  } else return (
    <>
      <h1>loading...</h1>
      <Link to='/'>Start screen</Link>
    </>);

}

export default Round;
