import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
function Game({ match }) {
    const [game, setGame] = useState();
    const [players, setPlayers] = useState([]);
    useEffect(() => {
        fetch(`/api/games/${match.params.gId}?containsFullHistory=true`, {
            headers: new Headers({
                'authentication': window.user.token
            })
        })
            .then((game) => game.json())
            .then((game) => setGame(game));
    }, [match.params.gId])
    useEffect(() => {
        if (game && game.userID_1 && game.userID_2) {
            (async () => {
                let player1 = (await fetch(`/api/users/${game.userID_1}`, {
                    headers: new Headers({
                        'authentication': window.user.token
                    })
                })).json();
                let player2 = (await fetch(`/api/users/${game.userID_2}`,
                    {
                        headers: new Headers({
                            'authentication': window.user.token
                        })
                    })).json();
                setPlayers([await player1, await player2])
            })()
        }
    }, [game])
    if (!game) {
        return <h1>Game not ready</h1>
    } else if (players[0] && players[1]) {
        return (
            <>
                <h1>Game Overview</h1>
                {game.rounds.map((round) => {
                    return (
                        <div key={round.id}>
                            <h2>{round.category && round.category.name}</h2>
                            <table style={
                                {
                                    margin: '20px auto',
                                    border: 'none',
                                    backgroundColor: 'white',
                                    width: '100%',
                                    color: 'black'
                                }
                            } key={round.id} >
                                <thead>
                                    <tr>
                                        {players.map((player) => <td key={`pl${player.id}`}>{player.name}</td>)}
                                    </tr>
                                </thead>

                                <tbody>
                                    {round.questions.map((question) => {
                                        let answer1;
                                        const ans1 = question.answerID_1;
                                        if (ans1) {
                                            if (ans1 == "-1") {
                                                answer1 = '❌';
                                            } else {
                                                answer1 = question.question.answers.find((ans) => ans.id === ans1).isCorrect ? '✅' : '❌';
                                            }
                                        }
                                        else
                                            answer1 = '⌛';
                                        let answer2;
                                        let ans2 = question.answerID_2;
                                        if (ans2) {
                                            if (ans2 == "-1") {
                                                answer2 = '❌';
                                            } else {
                                                answer2 = question.question.answers.find((ans) => ans.id === ans2).isCorrect ? '✅' : '❌';
                                            }
                                        } else
                                            answer2 = '⌛'
                                        return (

                                            <tr style={{
                                                margin: '100px',
                                                fontSize: '5rem'
                                            }} key={question.question.id}>
                                                <td>
                                                    {answer1}
                                                </td>
                                                <td>
                                                    {answer2}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                })
                }
                {
                    <Link to={`/game/${game.id}/play`}><button>Play</button></Link>
                }
            </>
        );
    } else return null
}
export default Game;