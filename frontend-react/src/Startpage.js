import React from 'react';
import { Link } from 'react-router-dom';

function Startpage() {
    let user = { "id": 42 }
    let games = [{
        "id": 24,
        "userID_1": 42,
        "userID_2": 43,
        "isFinished": 1
    },
    {
        "id": 25,
        "userID_1": 43,
        "userID_2": null,
        "isFinished": 0
    }];
    return (
        <>
            <h1>Quiz</h1>
            <div>
                <Link to='/category'><button>Start game</button></Link>
            </div>
            <div className='choose-category'>
                <h2>active games</h2>
                {games.map((game) => {
                    let opponent = game.userID_1 === user.id ? game.userID_2 : game.userID_1;
                    return (
                        <Link to={'/game/' + game.id} key={game.id}>
                            <button>
                                Game against {opponent} <b>{game.isFinished ? "DONE" : "ACTIVE"}</b>
                            </button>
                        </Link>
                    )
                })}
            </div>
        </>
    )
}
export default Startpage;