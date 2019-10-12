import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Round from './Round';
import ChooseCategory from './ChooseCategory';
import Startpage from './Startpage';
import Game from './Game'
import Scoreboard from './Scoreboard';
import History from './history';

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    const loginID = prompt('enter login id');
    fetch(
      `/api/authentication`,
      {
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        method: 'POST',
        body: JSON.stringify({ userID: loginID })
      }
    ).then((res) => res.json())
      .then(setUser);
  }, [])
  window.user = user;
  if (window.user) {
    return (
      <Router>
        <div className="nav">
          <span><Link to="/">Home</Link></span>
          <span><Link to="/scoreboard">scoreboard</Link></span>
          <span><Link to='/history'>game history</Link></span>
          <span>Player {window.user.name}</span>
        </div>
        <div className="App">

          <Switch>
            <Route path='/' exact component={Startpage}></Route>
            <Route path='/category'><ChooseCategory></ChooseCategory></Route>
            <Route path='/game/:gId/play' component={Round}></Route>
            <Route path='/game/:gId' component={Game}></Route>
            <Route path='/scoreboard' component={Scoreboard}></Route>
            <Route path='/history' component={History}></Route>
          </Switch>
        </div>
      </Router>
    );
  } else {
    return <h1>Please login</h1>;
  }
}

export default App;
