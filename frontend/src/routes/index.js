import React from 'react';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';

import Route from './Route';

import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';

import history from '~/services/history';

export default function Routes() {
  return (
    <BrowserRouter history={history}>
      <Switch>
        <Route path="/" exact component={SignIn} />
        <Route path="/cadastro" component={SignUp} />

        <Redirect from="*" to="/" />
      </Switch>
    </BrowserRouter>
  );
}
