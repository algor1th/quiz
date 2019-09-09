import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Round from './Round';
import ChooseCategory from './ChooseCategory';
import Startpage from './Startpage';
import Game from './Game'
import Scoreboard from './Scoreboard';

function App() {
  const token = prompt('token');
  const userid = token.split("_")[1];
  window.user = {
    token: token,
    id: userid
  };
  if (window.user) {
    return (
      <Router>
        <div className="App">
          <span>Player {window.user.id}</span>
          <Switch>
            <Route path='/' exact component={Startpage}></Route>
            <Route path='/category'><ChooseCategory></ChooseCategory></Route>
            {/* <Route path='/q/:qId' component={Round}></Route> */}
            <Route path='/game/:gId/play' component={Round}></Route>
            <Route path='/game/:gId' component={Game}></Route>
            <Route path='/scoreboard' component={Scoreboard}></Route>
          </Switch>
        </div>
      </Router>
    );
  } else {
    return <h1>Please login</h1>;
  }
}

export default App;
