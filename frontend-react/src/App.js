import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Question from './Question';
import ChooseCategory from './ChooseCategory';
import Startpage from './Startpage';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/' exact component={ Startpage }></Route>
          <Route path='/category'><ChooseCategory></ChooseCategory></Route>
          <Route path='/q/:qId' component={ Question }></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
