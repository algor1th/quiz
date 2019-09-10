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
  function challengePlayer(playerID){
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
  return(
      <ol>
        { board.map((user) => <li>{user.name} ({user.score})<button style={
            {
                width: 'auto',
                padding: '5px'
            }
        } onClick={()=> challengePlayer(user.id)}>challenge</button></li>) }
      </ol>
  )

}

export default Scoreboard;
