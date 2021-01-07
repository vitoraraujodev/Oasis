import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';

import CheckInput from '~/components/CheckInput';

import api from '~/services/api';

export default function EmissionInfoBlock({
  emissionInfo,
  onChangeEmissionInfo,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [promonAir, setPromonAir] = useState(emissionInfo.promonAir);
  const [fleet, setFleet] = useState(emissionInfo.fleet);
  const [procon, setProcon] = useState(emissionInfo.procon);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      promonAir,
      fleet,
      procon: fleet === true ? procon : false,
    };

    try {
      const response = await api.post('emission-info', data);
      setSaveButton(false);
      onChangeEmissionInfo(response.data);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (
      promonAir !== emissionInfo.promonAir ||
      fleet !== emissionInfo.fleet ||
      procon !== emissionInfo.procon
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [promonAir, fleet, procon]); // eslint-disable-line

  return (
    <div className="block-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">
            A empresa está cadastrada no PROMON-AR?
          </p>
          <CheckInput
            editable={editable}
            value={promonAir}
            onChange={setPromonAir}
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">
            A empresa possui frota própria veicular do ciclo diesel?
            <span className="hint" style={{ marginLeft: 4 }}>
              (Ex: caminhões)
            </span>
          </p>
          <CheckInput editable={editable} value={fleet} onChange={setFleet} />
        </div>
      </div>

      {fleet && (
        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">
              A referida frota se encontra cadastrada no PROCON Fumaça-Preta,
              conforme preconizado na NOP-14?
            </p>
            <CheckInput
              editable={editable}
              value={procon}
              onChange={setProcon}
            />
          </div>
        </div>
      )}

      {saveButton && (
        <button
          type="button"
          className="save-block-button bottom"
          onClick={!loading ? handleSubmit : null}
        >
          {loading ? (
            'Carregando...'
          ) : (
            <>
              <FaCheck size={21} color="#fff" style={{ marginRight: 8 }} />
              Salvar
            </>
          )}
        </button>
      )}
    </div>
  );
}
