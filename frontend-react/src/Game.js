import React from 'react'
import { Link } from 'react-router-dom'
import api from './api'
function Game({ match }) {
    const game = api.getGame(match.gId)
    return (
        <>
            <h1>Game {match.params.gId} <small><i>{game.category || 'NO CATEGORY'}</i></small></h1>
            <h2>question 1</h2>
            <p>
                Question: {game.question_1.questionID}
            </p>
            <p>
                Player 1 answered {game.question_1.answerID_1 || 'NOT YET'}
            </p>
            <p>
                Player 2 answered {game.question_1.answerID_2 || 'NOT YET'}
            </p>
            <h2>question 2</h2>
            <p>
                Question: {game.question_2.questionID}
            </p>
            <p>
                Player 1 answered {game.question_2.answerID_1 || 'NOT YET'}
            </p>
            <p>
                Player 2 answered {game.question_2.answerID_2 || 'NOT YET'}
            </p>
            <h2>question 3</h2>
            <p>
                Question: {game.question_3.questionID}
            </p>
            <p>
                Player 1 answered {game.question_3.answerID_1 || 'NOT YET'}
            </p>
            <p>
                Player 2 answered {game.question_3.answerID_2 || 'NOT YET'}
            </p>
            <Link to={'/game/' + game.id + '/question/'}><button>Play</button></Link>
        </>
    );
}
export default Game;