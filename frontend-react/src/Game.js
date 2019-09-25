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
    }, [match.params.gId])
    console.log(game);
    if (!game) {
        return <h1>Game not ready</h1>
    } else
        return (
            <>
                <h1>Game Overwiev</h1>
                {game.rounds.map((round) => {
                    return (
                        <div key={round.id}>
                            <h2>Round {round.id} </h2>
                            <table style={
                                {
                                    margin: '20px auto',
                                    border: '1px solid black',
                                    borderRadius: '5px',
                                    width: '100%',
                                }
                            } key={round.id} >
                                <thead>
                                    <tr>
                                        <td>
                                            Player 1
                                        </td>
                                        <td>
                                            Player 2
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {round.questions.map((question) => {
                                        let answer1;
                                        const ans1 = question.answerID_1;
                                        if (ans1)
                                            answer1 = question.question.answers.find((ans) => ans.id === ans1).isCorrect ? '✅' : '❌';
                                        else
                                            answer1 = '⌛';
                                        let answer2;
                                        let ans2 = question.answerID_2;
                                        if (ans2)
                                            answer2 = question.question.answers.find((ans) => ans.id === ans2).isCorrect ? '✅' : '❌';
                                        else
                                            answer2 = '⌛'
                                        return (

                                            <tr style={{
                                                margin: '100px',
                                                fontSize: '5em'
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
                })}
                {
                    <Link to={`/game/${game.id}/play`}><button>Play</button></Link>
                }
            </>
        );
}
export default Game;