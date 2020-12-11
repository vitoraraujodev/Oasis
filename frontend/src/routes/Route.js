import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { store } from '~/store';

export default function RouteWrapper({
  component: Component,
  isPublic = false,
  ...rest
}) {
  const { token } = store.getState().auth;

  if (!token && !isPublic) {
    return <Redirect to="/" />;
  }

  if (token && isPublic) {
    return <Redirect to="/forms" />;
  }

  return <Route {...rest} component={Component} />;
}
