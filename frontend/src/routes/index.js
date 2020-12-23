import React from 'react';
import { Router, Switch, Redirect } from 'react-router-dom';

import Route from './Route';

import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';

import Menu from '~/pages/Menu';

import GeneralInfo from '~/pages/Forms/GeneralInfo';
import FollowUp from '~/pages/Forms/FollowUp';
import SpecificInfo from '~/pages/Forms/SpecificInfo';
import ProductiveProcess from '~/pages/Forms/ProductiveProcess';

import history from '~/services/history';

export default function Routes() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={SignIn} isPublic />
        <Route path="/cadastro" component={SignUp} isPublic />

        <Route path="/form" exact component={Menu} />
        <Route path="/form/informacoes-gerais" component={GeneralInfo} />
        <Route path="/form/acompanhamento" component={FollowUp} />
        <Route path="/form/informacoes-especificas" component={SpecificInfo} />
        <Route
          path="/form/processos-produtivos"
          component={ProductiveProcess}
        />

        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
}
