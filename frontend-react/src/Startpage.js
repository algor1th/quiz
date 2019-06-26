import React from 'react';
import { Link } from 'react-router-dom';

function Startpage() {
    return(
        <>
        <h1>Quiz</h1>
        <div>
            <Link to='/category'><button>Start game</button></Link>
        </div>
        </>
    )
}
export default Startpage;