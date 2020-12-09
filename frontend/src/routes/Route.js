import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function RouteWrapper({
  component: Component,
  notPrivate,
  ...rest
}) {
  const signed = true;

  if (!signed && !notPrivate) {
    return <Redirect to="/" />;
  }

  if (signed && notPrivate) {
    return <Redirect to="/" />;
  }

  return <Route {...rest} component={Component} />;
}
