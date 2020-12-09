import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { signInRequest } from '~/store/modules/auth/actions';

import api from '~/services/api';

import './styles.css';

export default function SignUp() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [typology, setTypology] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleSubmit() {
    setLoading(true);
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
    setLoading(false);
  }

  return (
    <div id="sign-up-page">
      <div className="container">
        <h1 className="logo">Oasis</h1>

        <p className="sign-up-label">Cadastre sua conta</p>

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
        <button type="button" className="submit-button" onClick={handleSubmit}>
          {loading ? 'Carregando' : 'Cadastrar'}
        </button>

        <Link to="/">
          <div className="registration-link">ou acesse sua conta</div>
        </Link>
      </div>
    </div>
  );
}
