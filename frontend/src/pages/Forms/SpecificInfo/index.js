import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaLock, FaLockOpen } from 'react-icons/fa';

import Specific from './Specific';
import Employees from './Employees';
import GeneralArea from './GeneralArea';
import SpecificAreas from './SpecificAreas';

import TitleBlock from '~/components/TitleBlock';
import Header from '~/components/Header';

import api from '~/services/api';
import history from '~/services/history';

import '../styles.css';

export default function SpecificInfo() {
  const ENV = process.env.NODE_ENV;

  const [editable, setEditable] = useState(ENV !== 'production');
  const [loading, setLoading] = useState(false);

  const [documentType, setDocumentType] = useState();

  const [specific, setSpecific] = useState({ cnpj: '' });
  const [employees, setEmployees] = useState([]);
  const [installEmployees, setInstallEmployees] = useState([]);
  const [specificAreas, setSpecificAreas] = useState([]);
  const [generalArea, setGeneralArea] = useState({
    area: '',
    image: {
      url: null,
    },
  });

  async function loadSpecificInfo() {
    setLoading(true);

    try {
      const result = await api.get('document-type');
      setDocumentType(result.data.document_type);

      const response = await api.get('specific-info');
      if (response.data.specific) setSpecific(response.data.specific);
      if (response.data.employees) setEmployees(response.data.employees);
      if (response.data.installEmployees)
        setInstallEmployees(response.data.installEmployees);
      if (response.data.generalArea) setGeneralArea(response.data.generalArea);
      if (response.data.specificAreas)
        setSpecificAreas(response.data.specificAreas);
    } catch (err) {
      if (err.respose) alert(err.respose.data.error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSpecificInfo();
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
          title="Informações Específicas"
          description="Descrição de informações administrativas relacionadas às áreas de recursos humanos e projetos."
        />

        {loading ? (
          <div className="loader-container">
            <div className="loader" />
            Carregando...
          </div>
        ) : (
          <>
            <Specific
              specific={specific}
              onChangeSpecific={setSpecific}
              editable={editable}
            />

            <Employees
              documentType={documentType}
              employees={employees}
              installEmployees={installEmployees}
              onChangeEmployees={setEmployees}
              onChangeInstallEmployees={setInstallEmployees}
              editable={editable}
            />

            <GeneralArea
              generalArea={generalArea}
              onChangeGeneralArea={setGeneralArea}
              editable={editable}
            />

            <SpecificAreas
              specificAreas={specificAreas}
              onChangeAreas={setSpecificAreas}
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
