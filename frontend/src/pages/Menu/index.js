import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

import Header from '~/components/Header';
import Topic from './Topic';

import api from '~/services/api';

import './styles.css';

export default function Menu() {
  const [documentType, setDocumentType] = useState('');
  const [saveButton, setSaveButton] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    try {
      const config = {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      };

      const response = await api.get('document', config);

      if (response.data) {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: 'application/pdf' })
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Cadastro-Ambiental.pdf');
        document.body.appendChild(link);
        link.click();
      }
    } catch (err) {
      if (err.response) {
        window.alert(err.response.data.error);
      } else {
        window.alert(
          'Houve um erro ao gerar o arquivo. Por favor, tente novamente.'
        );
      }
    }

    setLoading(false);
  }

  function onChangeDocumentType(value) {
    setSaveButton(true);
    setDocumentType(value);
  }

  async function handleDocumentType() {
    const data = { document_type: documentType };
    try {
      const response = await api.post('document-type', data);
      setDocumentType(response.data.document_type);
      setSaveButton(false);
    } catch (err) {
      if (err.response.data) {
        window.alert(err.response.data.error);
      }
    }
  }

  async function loadDocumentType() {
    try {
      const response = await api.get('document-type');
      if (response.data.document_type) {
        setDocumentType(response.data.document_type);
      }
    } catch (err) {
      if (err.respose) alert(err.respose.data.error);
    }
  }

  useEffect(() => {
    loadDocumentType();
  }, []);

  return (
    <div id="menu-page">
      <Header />

      <div className="background" />

      <div className="container">
        <article>
          <section>
            <strong className="page-title">
              Construindo o perfil ambiental da sua empresa
            </strong>
          </section>

          <section>
            <p className="page-description">
              O processo de licenciamento do INEA possui várias exigências,
              então não se esqueça de preencher todos os tópicos com atenção e o
              máximo de detalhes.
            </p>
          </section>
        </article>

        <div className="document-input">
          <p className="document-label">Instrumento requerido</p>
          <p className="document-sublabel">
            Documento a ser solicitado ao orgão
          </p>
          <input
            value={documentType}
            className="input"
            placeholder="Instrumento"
            onChange={(e) => onChangeDocumentType(e.target.value)}
          />

          {saveButton && (
            <button
              type="button"
              className="save-button"
              onClick={!loading ? handleDocumentType : null}
            >
              <FaCheck size={21} color="#fff" style={{ marginRight: 8 }} />
              Salvar
            </button>
          )}
        </div>

        <Link to="/form/informacoes-gerais">
          <Topic
            topicNumber="1"
            topicTitle="Informações gerais"
            topicDescription="Endereço, representante legal, informações de funcionamento"
          />
        </Link>

        <Link to="/form/acompanhamento">
          <Topic
            topicNumber="2"
            topicTitle="Acompanhamento"
            topicDescription="Informações para contato, pessoa de contato, resposável técnico"
          />
        </Link>

        <Link to="/form/informacoes-especificas">
          <Topic
            topicNumber="3"
            topicTitle="Informações específicas"
            topicDescription="Instrumento requerido, funcionários, áreas do empreendimento"
          />
        </Link>

        <Link to="/form/processos-produtivos">
          <Topic
            topicNumber="4"
            topicTitle="Processo produtivo"
            topicDescription="Insumos, equipamentos, produtos"
          />
        </Link>

        <Link to="/form/aspectos-ambientais">
          <Topic
            topicNumber="5"
            topicTitle="Aspectos ambientais"
            topicDescription="Abastecimento hídrico, efluentes, resíduos"
          />
        </Link>

        <Link to="/form/aspectos-ambientais-complementares">
          <Topic
            topicNumber="6"
            topicTitle="Aspectos ambientais complementares"
            topicDescription="Emissões atmosféricas, risco ambiental, ruídos"
          />
        </Link>

        <div className="submit-block">
          <div className="submit-container">
            <p className="submit-label">Pronto para entregar seu formulário?</p>
            <p className="submit-sublabel">
              Com todos os campos preenchidos, está na hora de submeter seu
              relatório para receber seu cadastro ambiental!
            </p>

            <button
              type="button"
              className="submit-button"
              onClick={handleSubmit}
            >
              {loading ? 'Carregando...' : 'Baixar Cadastro Ambiental'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
