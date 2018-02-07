import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './home';
import Album from './album';
import RankedAlbum from './RankedAlbum';

const HomePage = () => {
  return (
    <Home
      url={`${process.env.REACT_APP_BASE_URL}albums`}
    />
  );
};

const Routes = () => (
  <Switch>
    <Route exact path='/' render={HomePage} />
    <Route path='/album/:id/ranked' component={RankedAlbum} />
    <Route path='/album/:id' component={Album} />
    <Route path='*' render={() => <Redirect to='/' />} />
  </Switch>
);

export default Routes;