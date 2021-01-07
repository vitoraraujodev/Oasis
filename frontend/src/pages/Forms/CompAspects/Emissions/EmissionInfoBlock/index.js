import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';

import CheckInput from '~/components/CheckInput';

import api from '~/services/api';

export default function ResidueInfoBlock({
  residueInfo,
  onChangeResidueInfo,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [manifest, setManifest] = useState(residueInfo.manifest);
  const [inventory, setInventory] = useState(residueInfo.inventory);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      manifest,
      inventory,
    };

    try {
      const response = await api.post('residue-info', data);
      setSaveButton(false);
      onChangeResidueInfo(response.data);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (
      manifest !== residueInfo.manifest ||
      inventory !== residueInfo.inventory
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [manifest, inventory ]); // eslint-disable-line


  return (
    <div className="block-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">
            A empresa se encontra cadastrada no sistema online de Manifesto de
            Resíduos, conforme preconizado na NOP-35?
          </p>
          <CheckInput
            editable={editable}
            value={manifest}
            onChange={setManifest}
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">
            A empresa está reportando o Inventário de Resíduos?
          </p>
          <CheckInput
            editable={editable}
            value={inventory}
            onChange={setInventory}
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
