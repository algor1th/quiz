import React from 'react';
import './App.css';
import api from './api';

function Question({ match }) {
  let question = api.getQuestion(match.params.qId)
  return (
    <div className="question">
      <span className="question-medium">
        What does XSS mean?
        </span>
      <div className="answer-buttons">
        <button className="answer-button" >asf</button>
      </div>
    </div>
  );

}

export default Question;
