import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Startpage() {
    const [games, setGames] = useState([]);
    const [opponents, setOpponents] = useState([]);
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
            });
    }
    useEffect(loadGames, [])
    console.log(opponents)
    const getName = (opponentID) => {
        let o = opponents.find((opponent) => opponent.id === opponentID);
        console.log(o)
        if (o && o.name) {
            return o.name;
        } else {
            fetch(`/api/users/${opponentID}`, {
                headers: new Headers({
                    'authentication': window.user.token
                })
            })
                .then((opponent) => opponent.json())
                .then(((opponent) => {
                    let tmp = opponents;
                    tmp.push(opponent);
                    setOpponents(tmp);
                }))

            return 'loading';
        }
    }
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
                        return (<Link to={`/game/${game.id}`} key={game.id}>
                            <button>
                                waiting for player
                            </button>
                        </Link>)
                    }
                    let opponent = game.userID_1 === window.user.id ? game.userID_2 : game.userID_1;
                    return (
                        <Link to={`/game/${game.id}`} key={game.id}>
                            <button>
                                Game against {getName(opponent)}
                            </button>
                        </Link>
                    )
                })}
            </div>
        </>
    );
}
export default Startpage;