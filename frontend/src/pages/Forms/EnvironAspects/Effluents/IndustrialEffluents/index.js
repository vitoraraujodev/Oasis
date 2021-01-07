import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import EffluentForm from './EffluentForm';

import Accordion from '~/components/Accordion';
import CheckInput from '~/components/CheckInput';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function IndustrialEffluents({
  industrialEffluents,
  onChangeIndustrialEffluents,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);
  const [refreshAccordion, setRefreshAccordion] = useState(false);

  const [source, setSource] = useState('');
  const [flow, setFlow] = useState('');
  const [treatment, setTreatment] = useState('');
  const [quantity, setQuantity] = useState('');
  const [waterBody, setWaterBody] = useState('');
  const [license, setLicense] = useState('');
  const [hasWaterBody, setHasWaterBody] = useState();

  function handleUpdate(e) {
    const effluents = industrialEffluents.map((effluent) =>
      effluent.id === e.id ? e : effluent
    );

    onChangeIndustrialEffluents(effluents);
  }

  function handleDelete(id) {
    onChangeIndustrialEffluents(
      industrialEffluents.filter(
        (industrialEffluent) => industrialEffluent.id !== id
      )
    );
  }

  async function handleSubmit() {
    if (loading) return;

    if (hasWaterBody && !license) {
      alert('Por favor, informe o requerimento/N° de Outorga.');
      return;
    }

    setLoading(true);

    const data = {
      kind: 'industrial',
      source: Capitalize(source),
      flow,
      treatment: Capitalize(treatment),
      quantity,
      water_body: waterBody,
      license: hasWaterBody ? license : '',
    };

    try {
      const response = await api.post('effluent', data);
      onChangeIndustrialEffluents([...industrialEffluents, response.data]);
      setSource('');
      setFlow('');
      setTreatment('');
      setQuantity('');
      setWaterBody('');
      setLicense('');
      setHasWaterBody();
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  function handleQuantity(value) {
    setQuantity(value ? parseInt(value, 10) : '');
  }

  function handleFlow(value) {
    setFlow(value ? parseFloat(value) : '');
  }

  useEffect(() => {
    if (source || flow || treatment || quantity || waterBody || license) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [source, flow, treatment, quantity, waterBody, license ]); // eslint-disable-line

  return (
    <>
      <p className="block-subtitle">Efluente industrial</p>
      <p className="block-subdescription">
        Identifique cada uma das fontes de efluente industrial, com suas
        respectivas vazões totais em m³/dia, os sistemas de tratamento
        empregados, e outras especificidades.
      </p>

      {industrialEffluents.length > 0 &&
        industrialEffluents.map((effluent, index) => (
          <Accordion
            key={effluent.id}
            number={index + 1}
            title={effluent.source}
            refreshAccordion={refreshAccordion}
            editable={editable}
          >
            <EffluentForm
              effluent={effluent}
              onChangeEffluent={handleUpdate}
              onDeleteEffluent={handleDelete}
              onRefreshAccordionSize={() =>
                setRefreshAccordion(!refreshAccordion)
              }
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">Fonte do efluente</p>
            <input
              value={source}
              className="input"
              disabled={!editable}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Produção, limpeza..."
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
                  placeholder="Estação de Tratamento de Efluente..."
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
              onChange={setHasWaterBody}
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
                placeholder="PD-00/000.000/0000"
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
                <FaPlus size={16} color="#fff" style={{ marginRight: 8 }} />
                Salvar efluente
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
