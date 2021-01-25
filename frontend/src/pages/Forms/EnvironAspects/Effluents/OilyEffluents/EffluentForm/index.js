import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';

import CheckInput from '~/components/CheckInput';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function EffluentForm({
  effluent,
  onChangeEffluent,
  onDeleteEffluent,
  onRefreshAccordionSize,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(true);

  const [source, setSource] = useState(effluent.source);
  const [flow, setFlow] = useState(effluent.flow);
  const [treatment, setTreatment] = useState(effluent.treatment);
  const [quantity, setQuantity] = useState(effluent.quantity);
  const [waterBody, setWaterBody] = useState(effluent.water_body);
  const [license, setLicense] = useState(effluent.license);
  const [hasWaterBody, setHasWaterBody] = useState(!!effluent.license);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      id: effluent.id,
      kind: 'oily',
      source: Capitalize(source),
      flow,
      treatment: Capitalize(treatment),
      quantity,
      water_body: waterBody,
      license: hasWaterBody ? license : '',
    };

    try {
      const response = await api.post('effluent', data);
      setSaveButton(false);
      onChangeEffluent(response.data);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (window.confirm('Deseja excluir permanentemente esse item?')) {
      setLoading(true);

      try {
        const response = await api.delete(`effluent/${effluent.id}`);
        if (response.data.okay) onDeleteEffluent(effluent.id);
      } catch (err) {
        if (err.response) alert(err.response.data.error);
      }

      setLoading(false);
    }
  }

  function handleQuantity(value) {
    setQuantity(value ? parseInt(value, 10) : '');
  }

  function handleFlow(value) {
    setFlow(value ? parseFloat(value) : '');
  }

  useEffect(() => {
    if (
      source !== effluent.source ||
      flow !== effluent.flow ||
      treatment !== effluent.treatment ||
      quantity !== effluent.quantity ||
      waterBody !== effluent.water_body ||
      license !== effluent.license
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [source, flow, treatment, quantity, waterBody, license]); // eslint-disable-line

  return (
    <div className="accordion-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Fonte do efluente</p>
          <input
            value={source}
            className="input"
            disabled={!editable}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Processos, lavagem..."
          />
        </div>

        <div className="input-group">
          <p className="input-label b">Vazão total em m³/dia</p>
          <input
            value={flow}
            type="number"
            className="input medium"
            disabled={!editable}
            onChange={(e) => handleFlow(e.target.value)}
            placeholder="01"
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Tratamento do efluente</p>
          <div className="input-line">
            <div className="input-group">
              <p className="input-label">Forma de tratamento</p>
              <input
                value={treatment}
                className="input"
                disabled={!editable}
                onChange={(e) => setTreatment(e.target.value)}
                placeholder="Caixa Separadora de Água e Óleo (CSAO)..."
              />
            </div>

            <div className="input-group">
              <p className="input-label">
                Quantidade
                <span className="hint" style={{ marginLeft: 4 }}>
                  (Opcional)
                </span>
              </p>
              <input
                value={quantity}
                type="number"
                className="input small"
                disabled={!editable}
                onChange={(e) => handleQuantity(e.target.value)}
                placeholder="01"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">
            O efluente tratado em questão é enviado para algum corpo receptor?
          </p>
          <CheckInput
            editable={editable}
            value={hasWaterBody}
            onChange={(value) => {
              setSaveButton(true);
              onRefreshAccordionSize();
              setHasWaterBody(value);
            }}
          />
        </div>
      </div>

      {hasWaterBody === true && (
        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">Nome do corpo receptor</p>
            <input
              value={waterBody}
              className="input"
              disabled={!editable}
              onChange={(e) => setWaterBody(e.target.value)}
              placeholder="Rio, lago, corrego..."
            />
          </div>

          <div className="input-group">
            <p className="input-label b">Requerimento/N° de Outorga</p>
            <input
              value={license}
              className="input"
              disabled={!editable}
              onKeyDown={(e) => {
                if (e.key === ' ') e.preventDefault();
              }}
              onChange={(e) => setLicense(e.target.value)}
              placeholder="OUT N°/PD"
            />
          </div>
        </div>
      )}

      {hasWaterBody === false && (
        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">
              Onde está sendo lançado o efluente industrial tratado?
            </p>
            <input
              value={waterBody}
              className="input"
              disabled={!editable}
              onChange={(e) => setWaterBody(e.target.value)}
              placeholder="Rio, Lago, Corrego..."
            />
          </div>
        </div>
      )}

      <div className="accordion-buttons">
        {editable && (
          <button
            type="button"
            className="delete-form-button"
            onClick={!loading ? handleDelete : null}
          >
            {loading ? (
              'Carregando...'
            ) : (
              <>
                <span className="delete-icon">
                  <FaTrash size={16} color="#fff" style={{ marginRight: 8 }} />
                </span>
                Excluir
              </>
            )}
          </button>
        )}

        {saveButton && (
          <button
            type="button"
            className="save-form-button"
            onClick={!loading ? handleSubmit : null}
          >
            {loading ? (
              'Carregando...'
            ) : (
              <>
                <FaCheck size={16} color="#fff" style={{ marginRight: 8 }} />
                Salvar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
