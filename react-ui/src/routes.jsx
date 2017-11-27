import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './home';
import Album from './album';

const HomePage = () => {
  return (
    <Home
      url='https://bd-vote.herokuapp.com/api/albums/'
    />
  );
};

const Routes = () => (
  <Switch>
    <Route exact path='/' render={HomePage} />
    <Route path='/album/:id' component={Album} />
    <Route path='*' render={() => <Redirect to='/' />} />
  </Switch>
);

export default Routes;