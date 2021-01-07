import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaLock, FaLockOpen } from 'react-icons/fa';

import Address from './Address';
import Representative from './Representatives';
import History from './History';
import OperatingInfo from './OperatingInfo';

import TitleBlock from '~/components/TitleBlock';
import Header from '~/components/Header';

import api from '~/services/api';
import history from '~/services/history';

import '../styles.css';

export default function GeneralInfo() {
  const ENV = process.env.NODE_ENV;

  const [editable, setEditable] = useState(ENV !== 'production');
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    cep: '',
    city: '',
    neighborhood: '',
    municipality: '',
    street: '',
    number: '',
    complement: '',
  });

  const [representatives, setRepresentatives] = useState([]);

  const [concludedProcesses, setConcludedProcesses] = useState([]);
  const [pendingProcesses, setPendingProcesses] = useState([]);

  const [operatingInfo, setOperatingInfo] = useState({
    date: '',
    rural: null,
    registration: null,
    observation: '',
    shifts: [],
  });

  async function loadGeneralInfo() {
    setLoading(true);

    try {
      const response = await api.get('general-info');

      if (!response.data) {
        setEditable(true);
      } else {
        if (response.data.address) setAddress(response.data.address);
        if (response.data.representatives)
          setRepresentatives(response.data.representatives);
        if (response.data.history) setConcludedProcesses(response.data.history);
        if (response.data.pending) setPendingProcesses(response.data.pending);
        if (response.data.operatingInfo)
          setOperatingInfo(response.data.operatingInfo);
      }
    } catch (err) {
      if (err.respose) alert(err.respose.data.error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadGeneralInfo();
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
          title="Informações Gerais"
          description="Descrição de informações referentes à localização, representação legal, histórico ambiental e funcionamento, as quais são necessárias para auxiliar na análise do processo administrativo a ser requerido junto ao órgão ambiental."
        />

        {loading ? (
          <div className="loader-container">
            <div className="loader" />
            Carregando...
          </div>
        ) : (
          <>
            <Address
              address={address}
              onChangeAddress={setAddress}
              editable={editable}
            />

            <Representative
              representatives={representatives}
              onChangeRepresentatives={setRepresentatives}
              editable={editable}
            />

            <History
              concludedProcesses={concludedProcesses}
              pendingProcesses={pendingProcesses}
              onChangeConcludedProcesses={setConcludedProcesses}
              onChangePendingProcesses={setPendingProcesses}
              editable={editable}
            />

            <OperatingInfo
              operatingInfo={operatingInfo}
              onChangeOperatingInfo={setOperatingInfo}
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
              onClick={() => history.push('/form/acompanhamento')}
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
