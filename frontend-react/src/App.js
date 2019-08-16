import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Round from './Round';
import ChooseCategory from './ChooseCategory';
import Startpage from './Startpage';
import Game from './Game'

function App() {
  window.user = prompt('token');
  if (window.user) {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path='/' exact component={Startpage}></Route>
            <Route path='/category'><ChooseCategory></ChooseCategory></Route>
            {/* <Route path='/q/:qId' component={Round}></Route> */}
            <Route path='/game/:gId/play' component={Round}></Route>
            <Route path='/game/:gId' component={Game}></Route>
          </Switch>
        </div>
      </Router>
    );
  } else {
    return <h1>Please login</h1>;
  }
}

export default App;
