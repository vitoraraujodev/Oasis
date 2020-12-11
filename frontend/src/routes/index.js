import React from 'react';
import { Router, Switch, Redirect } from 'react-router-dom';

import Route from './Route';

import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';

import Menu from '~/pages/Menu';

import history from '~/services/history';

export default function Routes() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={SignIn} isPublic />
        <Route path="/cadastro" component={SignUp} isPublic />

        <Route path="/forms" component={Menu} />

        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
}
