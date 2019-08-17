import React from 'react';
import './App.css';
import { useState, useEffect } from 'react'

function Question(props) {
  // let question = api.getQuestion(match.params.qId)
  const id = props.question.questionID;
  const [question, setQuestion] = useState();
  console.log(props.qId)
  useEffect(() => {
    fetch(`/api/questions/${id}?containAnswers=true`, {
      headers: new Headers({
        'authentication': window.user
      })
    })
      .then((question) => question.json())
      .then((question) => setQuestion(question));
  }, [id])
  console.log(question);
  if (question) {
    return (
      <div className="question">
        <span className="question-medium">
          {question[0].text}
        </span>
        <div className="answer-buttons">
            { question[1].map((answer)=> <button className="answer-button" key={answer.id} onClick={() => {
              const bdy = JSON.stringify({"answerID": answer.id})
              console.log(bdy)
              fetch(`/api/rounds/${props.roundId}`,{
                headers: new Headers({
                  'Content-Type': 'application/json',
                  'authentication': window.user
                }),
                method: 'PUT',
                body: bdy
              }).then(console.log);
            }}>{answer.text}</button>)}
        </div>
        
      </div>
    );
  } else return <h1>loading...</h1>

}

export default Question;
