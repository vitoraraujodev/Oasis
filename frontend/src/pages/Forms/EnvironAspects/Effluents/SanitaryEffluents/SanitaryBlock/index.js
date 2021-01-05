import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';

import CheckInput from '~/components/CheckInput';

import api from '~/services/api';

export default function SanitaryBlock({
  sanitary,
  onChangeSanitary,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [kitchen, setKitchen] = useState(sanitary.kitchen);
  const [declaration, setDeclaration] = useState(sanitary.declaration);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      kitchen,
      declaration,
    };

    console.tron.log(data);

    try {
      const response = await api.post('sanitary', data);
      setSaveButton(false);
      onChangeSanitary(response.data);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (kitchen !== sanitary.kitchen || declaration !== sanitary.declaration) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [kitchen, declaration ]); // eslint-disable-line


  return (
    <div className="block-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">A empresa possui cozinha industrial?</p>
          <CheckInput
            editable={editable}
            value={kitchen}
            onChange={setKitchen}
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">
            A empresa possui Declaração de Possibilidade de Esgotamento (DPE) ?
          </p>
          <CheckInput
            editable={editable}
            value={declaration}
            onChange={setDeclaration}
          />
        </div>
      </div>

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
