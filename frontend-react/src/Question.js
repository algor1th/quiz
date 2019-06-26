import React from 'react';
import './App.css';

function Question({match}) {
  return (
    <div className="question">
        <span className="question-medium">
          {match.params.qId}
            What does XSS mean?
        </span>
        <div className="answer-buttons">
            <button className="answer-button" >asf</button>
        </div>
    </div>
  );

}

export default Question;
