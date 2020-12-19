import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaLock, FaLockOpen } from 'react-icons/fa';

import ContactInfo from './ContactInfo';
import ContactManager from './ContactManager';
import TechnicalManager from './TechnicalManager';

import TitleBlock from '~/components/TitleBlock';
import Header from '~/components/Header';

import api from '~/services/api';
import history from '~/services/history';

import '../styles.css';

export default function FollowUp() {
  const ENV = process.env.NODE_ENV;

  const [editable, setEditable] = useState(ENV !== 'production');
  const [loading, setLoading] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    phone_number: '',
    start_at: '',
    end_at: '',
  });

  const [contactManager, setContactManager] = useState({
    name: '',
    email: '',
    cpf: '',
    phone_number: '',
  });

  const [technicalManager, setTechnicalManager] = useState({
    name: '',
    email: '',
    cpf: '',
    phone_number: '',
    qualification: '',
    lincensureCode: '',
  });

  async function loadFollowUp() {
    setLoading(true);

    try {
      const response = await api.get('follow-up');
      if (response.data.contactInfo) setContactInfo(response.data.contactInfo);
      if (response.data.contactManager)
        setContactManager(response.data.contactManager);
      if (response.data.technicalManager)
        setTechnicalManager(response.data.technicalManager);
    } catch (err) {
      if (err.respose) alert(err.respose.data.error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadFollowUp();
  }, []);

  return (
    <div id="form-page">
      <Header />

      <div className="container">
        <div className="form-buttons">
          <button
            type="button"
            className="page-button"
            onClick={() => history.push('/form')}
          >
            <FaArrowLeft size={21} color="#fff" />
            <strong style={{ marginLeft: 12 }}>Voltar</strong>
          </button>

          <button
            type="button"
            className="edit-button"
            onClick={() => setEditable(!editable)}
          >
            {editable ? (
              <FaLockOpen size={21} color="#fff" />
            ) : (
              <FaLock size={21} color="#fff" />
            )}
            <strong style={{ marginLeft: 12 }}>Editar</strong>
          </button>
        </div>

        <TitleBlock
          title="Acompanhamento"
          description="Descrição de informações administrativas complementares às Informações Gerais."
        />

        {loading ? (
          <div className="loader-container">
            <div className="loader" />
            Carregando...
          </div>
        ) : (
          <>
            <ContactInfo
              contactInfo={contactInfo}
              onChangeContactInfo={setContactInfo}
              editable={editable}
            />

            <ContactManager
              contactManager={contactManager}
              onChangeContactManager={setContactManager}
              editable={editable}
            />

            <TechnicalManager
              technicalManager={technicalManager}
              onChangeTechnicalManager={setTechnicalManager}
              editable={editable}
            />
          </>
        )}
        {!loading && (
          <div className="form-buttons">
            <button
              type="button"
              className="page-button"
              onClick={() => history.push('/form')}
            >
              <FaArrowLeft size={21} color="#fff" />
              <strong style={{ marginLeft: 12 }}>Voltar</strong>
            </button>

            <button
              type="button"
              className="page-button"
              onClick={() => setEditable(!editable)}
            >
              <strong style={{ marginRight: 12 }}>Avançar</strong>
              <FaArrowRight size={21} color="#fff" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
