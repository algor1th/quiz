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
  function challengePlayer(playerID) {
    fetch(
      `/api/games/current?matchWith=${playerID}`,
      {
        headers: new Headers({
          'Content-Type': 'application/json',
          'authentication': window.user.token
        }),
        method: 'POST',
      }
    ).then((res) => {
      console.log(res);
      props.history.push('/')
    });
  }
  return (
    <table style={{
      width: '100%',
      backgroundColor: 'white',
      color: '#211973',
      textAlign: 'left'
    }}>
      <thead style={{ fontWeight: 'bold' }}>
        <td>Place</td>
        <td>Name</td>
        <td>Score</td>
      </thead>
      {board.map((user, index) => <tr>
        <td>{index + 1}</td>
        <td>{user.name}</td>
        <td>{user.score}</td>
        <td><button style={
          {
            width: 'auto',
            padding: '20px',
            backgroundColor: '#211973',
            color: 'white'
          }
        } onClick={() => challengePlayer(user.id)}>challenge</button></td>
      </tr>)}
    </table>
  )

}

export default Scoreboard;
