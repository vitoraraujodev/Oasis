import React, { useState, useEffect } from 'react';
import Input from 'react-input-mask';
import { FaCheck } from 'react-icons/fa';

import FormBlock from '~/components/FormBlock';

import api from '~/services/api';

export default function Specific({ specific, onChangeSpecific, editable }) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [cnpj, setCnpj] = useState(specific.cnpj);

  useEffect(() => {
    if (cnpj !== specific.cnpj) {
      setSaveButton(true);
    } else if (saveButton) {
      setSaveButton(false);
    }
  }, [ cnpj]); // eslint-disable-line

  async function handleSubmit() {
    setLoading(true);

    const data = {
      cnpj,
    };

    try {
      const response = await api.post('specific', data);
      setSaveButton(false);
      onChangeSpecific(response.data);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }

    setLoading(false);
  }

  return (
    <FormBlock>
      <p className="block-title">CNPJ</p>
      <p className="block-subdescription">Informe o CNPJ da empresa</p>

      <div className="input-line">
        <div className="input-group medium">
          <Input
            value={cnpj}
            inputMode="numeric"
            mask="99.999.999/9999-99"
            className="input medium"
            disabled={!editable}
            onChange={(e) => setCnpj(e.target.value)}
            placeholder="00.000.000/0000-00"
          />
        </div>
      </div>

      {saveButton && (
        <button
          type="button"
          className="save-block-button"
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
    </FormBlock>
  );
}
