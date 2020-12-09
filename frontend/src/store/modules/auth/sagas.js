import { all, takeLatest, call, put } from 'redux-saga/effects';
import decode from 'jwt-decode';

import history from '~/services/history';
import api from '~/services/api';

import { signInSuccess, signFailure, signOutSuccess } from './actions';

export function* signIn({ payload }) {
  const { email, password } = payload;

  try {
    const response = yield call(api.post, 'sessions', { email, password });

    const { token } = response.data;

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(signInSuccess(token));

    history.push('/');
  } catch (err) {
    yield put(signFailure());

    if (err.response.data) {
      alert(err.response.data.error);
    }
  }
}

export function* signOut() {
  if (window.confirm('Tem certeza que deseja sair?')) {
    yield put(signOutSuccess());
    history.push('/');
  }
}

export function* setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    const decoded = decode(token);

    if (decoded.exp < Date.now() / 1000) {
      yield put(signOutSuccess());
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_OUT_REQUEST', signOut),
]);
