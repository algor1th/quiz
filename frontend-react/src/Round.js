import React from 'react';
import './App.css';
import { useState, useEffect } from 'react'
import Question from './Question'
import { Redirect, Link } from 'react-router-dom';

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
      .then((round) => round.ok? round.json(): null)
      .then((round) => setRound(round));
  }, [match.params.gId, currentround]);
  useEffect(() => {
    if (round && round.questions && round.questions[currentround] && round.questions[currentround][`answerID_${round.thisPlayer}`] != null) {
      setcurrentround(currentround + 1);
    }
  }, [currentround, round]);
  console.log(round)
  ;
  function roundDone() {
    setcurrentround(currentround + 1)
  }
  function chooseCategory(categoryID) {
    fetch(
      `/api/rounds/${match.params.gId}`,
      {
          headers: new Headers({
              'Content-Type': 'application/json',
              'authentication': window.user.token
          }),
          method: 'PUT',
          body: JSON.stringify({categoryID: categoryID})
      }        
  ).then(console.log);
    console.log(categoryID)
  }
  if (round) {
    if(Array.isArray(round.category)) {
      return (
      <div>
        <h1>Choose category</h1>
       { round.category.map(element => {
         console.log(element);
          return (<button key={element.id} onClick={()=> chooseCategory(element.id)}>{element.name}</button>)
       }
       )}
      </div>)
    } else if (currentround < round.questions.length) {
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
