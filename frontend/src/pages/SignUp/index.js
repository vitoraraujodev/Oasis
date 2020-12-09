import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { signInRequest } from '~/store/modules/auth/actions';

import api from '~/services/api';

import './styles.css';

export default function SignUp() {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [typology, setTypology] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleSubmit() {
    const data = {
      name,
      email,
      typology,
      password,
      confirmPassword,
    };
    try {
      await api.post('company', data);
      dispatch(signInRequest(email, password));
    } catch (err) {
      if (err.response) {
        alert(err.response.data.error);
      }
    }
  }

  return (
    <div id="signin-page">
      <div className="form">
        <p className="input-label">Nome da empresa</p>
        <input
          className="input"
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
        />

        <p className="input-label">E-mail</p>
        <input
          className="input"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemplo@email.com"
        />

        <p className="input-label">Tipologia industrial</p>
        <input
          className="input"
          onChange={(e) => setTypology(e.target.value)}
          placeholder=""
        />

        <p className="input-label">Senha</p>
        <input
          type="password"
          className="input"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />

        <p className="input-label">Confirmação de senha</p>
        <input
          type="password"
          className="input"
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="********"
        />

        <button type="button" onClick={handleSubmit}>
          Acessar
        </button>
      </div>
    </div>
  );
}
