import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useInterval from './use-interval'

function Startpage() {
    const [games, setGames] = useState([]);
    const loadGames = () => {
        fetch('/api/games/current', {
            headers: new Headers({
                'authentication': window.user.token
            }),
            crossDomain: true,
        })
            .then((game) => game.ok ? game.json() : [])
            .then((game) => {
                setGames(game)
                console.log(game)
            });
    }
    useEffect(loadGames, [])
    useInterval(loadGames, 1000)
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
        ).then(loadGames);
    }
    return (
        <>
            <h1>Quiz</h1>
            <div>
                {/* <Link to='/scoreboard'><button>Scoreboard</button></Link> */}
                <button onClick={newGame}>Start game</button>
            </div>
            <div>
                <h2>active games</h2>
                {games.map((game) => {
                    if (!game.userID_2) {
                        return (<Link key={game.id}>
                            <button>
                                waiting for player
                            </button>
                        </Link>)
                    }
                    let opponent = game.userID_1 === window.user.id ? game.userName_2 : game.userName_1;
                    return (
                        <Link to={`/game/${game.id}`} key={game.id}>
                            <button>
                                Game against {opponent}
                            </button>
                        </Link>
                    )
                })}
            </div>
        </>
    );
}
export default Startpage;