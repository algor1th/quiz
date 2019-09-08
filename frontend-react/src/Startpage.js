import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Startpage() {
    const [games, setGames] = useState([]);
    useEffect(() => {
        fetch('/api/games/current', {
            headers: new Headers({
                'authentication': window.user.token
            }),
            crossDomain: true,
        })
            .then((game) => game.json())
            .then((game) => setGames(game));
    },[])

    console.log(games);
    function newGame(e) {
        e.preventDefault();
        fetch(
            '/api/games/current',
            {
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'authentication': window.user.token
                }),
                method: 'POST',
            }        
        ).then(console.log);
    }
    return (
        <>
            <h1>Quiz</h1>
            <div>
                <Link to='/scoreboard'><button>Scoreboard</button></Link>
                <button onClick={newGame}>Start game</button>
            </div>
            <div className='choose-category'>
                <h2>active games</h2>
                {games.map((game) => {
                    let opponent = game.userID_1 == window.user.id ? game.userID_2 : game.userID_1;
                    return (
                        <Link to={`/game/${game.id}/play`} key={game.id}>
                            <button>
                                Game against {opponent} <b>{game.isFinished ? "DONE" : "ACTIVE"}</b>
                            </button>
                        </Link>
                    )
                })}
            </div>
        </>
    );
}
export default Startpage;