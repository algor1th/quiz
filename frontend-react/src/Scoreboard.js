import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';

function Scoreboard(props) {
  const [board, setBoard] = useState([]);
  useEffect(() => {
    fetch(`/api/users?sortBy=score`, {
      headers: new Headers({
        'authentication': window.user.token
      })
    })
      .then((question) => question.json())
      .then((question) => setBoard(question));
  })
  console.log(board);
  return(
      <ol>
        { board.map((user) => <li>{user.name} ({user.score})</li>) }
      </ol>
  )

}

export default Scoreboard;
