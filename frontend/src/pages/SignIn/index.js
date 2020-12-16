import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { signInRequest } from '~/store/modules/auth/actions';

import history from '~/services/history';

import './styles.css';

export default function SignIn() {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.auth.loading);

  // const [height, setHeight] = useState(window.innerHeight);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit() {
    dispatch(signInRequest(email, password));
  }

  return (
    <div id="sign-in-page">
      <div className="container">
        <h1 className="logo">Oasis</h1>

        <p className="sign-in-label">Acesse sua conta</p>

        <p className="input-label">E-mail</p>
        <input
          className="input"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemplo@email.com"
        />

        <p className="input-label">Senha</p>
        <input
          type="password"
          className="input"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />

        <button type="button" className="submit-button" onClick={handleSubmit}>
          {loading ? 'Carregando' : 'Acessar'}
        </button>

        <div
          className="registration-link"
          onClick={() => history.push('/cadastro')}
        >
          ou cadastre sua conta
        </div>
      </div>
    </div>
  );
}
