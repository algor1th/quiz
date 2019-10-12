import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function History() {
    const [games, setGames] = useState([]);
    const loadGames = () => {
        fetch('/api/games/history', {
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
    return (
        <>
            <h1>Quiz</h1>
            <div>
                <h2>Game history</h2>
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
export default History;