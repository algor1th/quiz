import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
function Game({ match }) {
    const [game, setGame] = useState();
    useEffect(() => {
        fetch(`/api/games/${match.params.gId}?containsFullHistory=true`, {
            headers: new Headers({
                'authentication': window.user.token
            })
        })
            .then((game) => game.json())
            .then((game) => setGame(game));
    })
    console.log(game);
    if (!game) {
        return <h1>Game not ready</h1>
    } else
        return (
            <>
                <h1>Game {game.id} <small><i>{game.category || 'NO CATEGORY'}</i></small></h1>
                {game.rounds.map((round) => {
                    return (
                        <div key={round.id}>
                            <h2>Round {round.id} </h2>
                            <table style={
                                {
                                    margin: '20px auto',
                                    border: '1px solid black',
                                    borderRadius: '5px'
                                }
                            } key={round.id} >
                                <tr>
                                    <td>
                                        Question
                                        </td>
                                    <td>
                                        Player 1
                                        </td>
                                    <td>
                                        Player 2
                                        </td>
                                </tr>
                                {round.questions.map((question) => {
                                    let answer1;
                                    if (question.question.answers[0])
                                        answer1 = question.question.answers[0].isCorrect ? '✅' : '❌';
                                    else
                                        answer1 = '⌛';
                                    let answer2;
                                    if (question.question.answers[1])
                                        answer2 = question.question.answers[1].isCorrect ? '✅' : '❌';
                                    else
                                        answer2 = '⌛'
                                    return (

                                        <tr style={{
                                            margin: '100px'
                                        }}>
                                            {/* <td><h2>question 1</h2></td> */}
                                            <td>
                                                {question.question.text}
                                            </td>
                                            <td>
                                                {answer1}
                                            </td>
                                            <td>
                                                {answer2}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </table>
                        </div>
                    )
                })}
                {
                    <Link to={`/game/${game.id}/play`}><button>Play</button></Link>
                }
            </>
        );
}
export default Game;