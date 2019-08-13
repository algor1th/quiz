import React from 'react'
import { Link } from 'react-router-dom'
import api from './api'
function Game({ match }) {
    const game = api.getGame(match.gId)
    let round = game.currentRound();
    return (
        <>
            <h1>Game {match.params.gId} <small><i>{game.category || 'NO CATEGORY'}</i></small></h1>
            {game.rounds.map((round) => {
                return (
                    <div key={round.id}>
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
                                answer1 = question.question.answers[0].isCorrect? '✅':'❌';
                            else
                                answer1 = '⌛';
                            let answer2;
                            if (question.question.answers[1])
                                answer2 = question.question.answers[1].isCorrect? '✅': '❌';
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
            {round &&
                <Link to={`/game/${game.id}/question/${round.id}`}><button>Play</button></Link>
            }
        </>
    );
}
export default Game;