import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';
import useInterval from './use-interval'

function Scoreboard(props) {
  const [board, setBoard] = useState([]);
  const loadUsers = () => {
    fetch(`/api/users?sortBy=score`, {
      headers: new Headers({
        'authentication': window.user.token
      })
    })
      .then((question) => question.json())
      .then((question) => setBoard(question));
  };
  useEffect(loadUsers, [])
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
  const s = {
    backgroundColor: "#ff7a00",
    color: "white"
  };
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
        <td>
          {(user.id !== window.user.id) ?
            <button style={s} onClick={() => challengePlayer(user.id)}>challenge</button> : <button style={s}>you</button>
          }
        </td>
      </tr>)}
    </table>
  )

}

export default Scoreboard;
