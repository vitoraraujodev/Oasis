import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { ReactComponent as SignOut } from '~/assets/icons/logout-icon.svg';

import { signOutRequest } from '~/store/modules/auth/actions';

import './styles.css';

export default function Header() {
  const dispatch = useDispatch();

  const company = useSelector((state) => state.company.company);

  function handleSignOut() {
    dispatch(signOutRequest());
  }

  return (
    <div id="page-header">
      <div className="header-content">
        <div className="header-group">
          <div className="header-logo">OASIS</div>
          <div className="navlinks-container">
            <NavLink
              className="navlink"
              activeStyle={{ color: '#444' }}
              to="/forms"
            >
              <strong>Formulário</strong>
            </NavLink>

            <NavLink
              className="navlink"
              activeStyle={{ color: '#444' }}
              to="/consultoria"
            >
              <strong>Consultoria</strong>
            </NavLink>

            <NavLink
              className="navlink"
              activeStyle={{ color: '#444' }}
              to="/sobre"
            >
              <strong>Sobre</strong>
            </NavLink>
          </div>
        </div>

        <div className="header-group">
          <button type="button" className="header-profile" onClick={() => {}}>
            <p className="header-welcome">Bem-vindo(a),</p>
            <p className="header-company">{company.name}</p>
          </button>
          <button
            type="button"
            className="logout-button"
            onClick={handleSignOut}
          >
            <SignOut fill="#DD3C3C" />
          </button>
        </div>
      </div>
    </div>
  );
}
