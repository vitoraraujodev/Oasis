import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash, FaPlus } from 'react-icons/fa';

import Storage from '../Storage';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function SupplyForm({
  supply,
  onChangeSupply,
  onDeleteSupply,
  onChangeStorages,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [identification, setIdentification] = useState(supply.identification);
  const [physicalState, setPhysicalState] = useState(supply.physical_state);
  const [quantity, setQuantity] = useState(supply.quantity);
  const [unit, setUnit] = useState(supply.unit);
  const [transport, setTransport] = useState(supply.transport);
  const [packaging, setPackaging] = useState(supply.packaging);
  const [storages, setStorages] = useState(supply.storages);

  async function handleSubmit() {
    setLoading(true);

    const data = {
      id: supply.id,
      identification: Capitalize(identification),
      physical_state: Capitalize(physicalState),
      quantity,
      unit,
      transport: Capitalize(transport),
      packaging: Capitalize(packaging),
      storages: storages.map((storage) => ({
        location: storage.location,
        identification: storage.identification,
        amount: storage.amount,
        capacity: storage.capacity,
        unit: storage.unit,
      })),
    };

    try {
      const response = await api.post('supply', data);
      onChangeSupply(response.data);
      setSaveButton(false);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);

    try {
      const response = await api.delete(`supply/${supply.id}`);
      setLoading(false);
      if (response.data.okay) onDeleteSupply(supply.id);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
      setLoading(false);
    }
  }

  function handleAddStorage() {
    if (loading) return;

    const storage = {
      id: Date.now(),
      location: '',
      identification: '',
      amount: '',
      capacity: '',
      unit: '',
    };
    setStorages([...storages, storage]);
    onChangeStorages([...storages, storage]);
    setSaveButton(true);
  }

  function handleUpdateStorages(storage, index) {
    if (loading) return;

    const newStorages = storages.map((s, i) => (i === index ? storage : s));
    setStorages(newStorages);

    setSaveButton(true);
  }

  function handleDeleteStorage(index) {
    if (loading) return;

    const newStorages = [...storages];
    newStorages.splice(index, 1);
    setStorages(newStorages);
    onChangeStorages(newStorages);

    setSaveButton(true);
  }

  function handleQuantity(value) {
    setQuantity(value ? parseInt(value, 10) : '');
  }

  useEffect(() => {
    if (
      identification !== supply.identification ||
      physicalState !== supply.physical_state ||
      quantity !== supply.quantity ||
      unit !== supply.unit ||
      transport !== supply.transport ||
      packaging !== supply.packaging
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [identification, physicalState, quantity, unit, transport, packaging]); // eslint-disable-line

  return (
    <div className="accordion-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Identificação do insumo</p>
          <input
            value={identification}
            className="input"
            disabled={!editable}
            onChange={(e) => setIdentification(e.target.value)}
            placeholder="Insumo"
          />
        </div>

        <div className="input-group">
          <p className="input-label b">Forma física</p>
          <input
            value={physicalState}
            className="input medium"
            disabled={!editable}
            onChange={(e) => setPhysicalState(e.target.value)}
            placeholder="Sól., Líq. ou Gás."
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group medium">
          <p className="input-label b">Quantidade média/ano</p>
          <input
            value={quantity}
            type="number"
            className="input medium"
            disabled={!editable}
            onChange={(e) => handleQuantity(e.target.value)}
            placeholder="01"
          />
        </div>

        <div className="input-group medium">
          <p className="input-label b">Unidade de medida</p>
          <input
            value={unit}
            className="input medium"
            disabled={!editable}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Kg, L, g..."
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Recebimento</p>
          <p className="block-subdescription">
            Informações sobre o meio de transporte para o recebimento deste
            insumo, antes do armazenamento.
          </p>

          <div className="input-line">
            <div className="input-group">
              <p className="input-label">Meio de transporte</p>
              <input
                value={transport}
                className="input"
                disabled={!editable}
                onChange={(e) => setTransport(e.target.value)}
                placeholder="Caminhões, ferrovia..."
              />
            </div>

            <div className="input-group">
              <p className="input-label">Acondicionamento</p>
              <input
                value={packaging}
                className="input"
                disabled={!editable}
                onChange={(e) => setPackaging(e.target.value)}
                placeholder="Galões, sacas, barrís..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Armazenamento</p>
          <p className="block-subdescription">
            Informações sobre cada forma específica de armazenamento deste
            insumo.
          </p>

          {storages.map((storage, index) => (
            <Storage
              key={storage.id}
              storage={storage}
              onChangeStorage={(s) => {
                handleUpdateStorages(s, index);
              }}
              onDeleteStorage={() => handleDeleteStorage(index)}
              editable={editable}
            />
          ))}
          <button
            type="button"
            className="add-subform-button"
            onClick={handleAddStorage}
          >
            <FaPlus size={16} color="#3366BB" style={{ marginRight: 8 }} />
            Adicionar um armazenamento
          </button>
        </div>
      </div>

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
