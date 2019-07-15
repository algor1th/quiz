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
                        {round.questions.map((question) => {
                            let answer1;
                            if (question.question.answers[0])
                                answer1 = question.question.answers[0].text;
                            else
                                answer1 = 'NOT YET';
                            let answer2;
                            if (question.question.answers[1])
                                answer2 = question.question.answers[1].text;
                            else
                                answer2 = 'NOT YET'
                            return (
                                <div key={question.id} >
                                    <h2>question 1</h2>
                                    <p>
                                        Question: {question.question.text}
                                    </p>
                                    <p>
                                        Player 1 answered {answer1}
                                    </p>
                                    <p>
                                        Player 2 answered {answer2}
                                    </p>
                                </div>
                            )
                        })}
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