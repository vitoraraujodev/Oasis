import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import SupplyForm from './SupplyForm';
import Storage from './Storage';

import FormBlock from '~/components/FormBlock';
import Accordion from '~/components/Accordion';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function Supplies({ supplies, onChangeSupplies, editable }) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [identification, setIdentification] = useState('');
  const [physicalState, setPhysicalState] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [transport, setTransport] = useState('');
  const [packaging, setPackaging] = useState('');
  const [storages, setStorages] = useState([
    {
      id: Date.now(),
      location: '',
      identification: '',
      amount: '',
      capacity: '',
      unit: '',
    },
  ]);

  function handleUpdate(s) {
    const newSupplies = supplies.map((supply) =>
      supply.id === s.id ? s : supply
    );

    onChangeSupplies(newSupplies);
  }

  function handleDelete(id) {
    onChangeSupplies(supplies.filter((supply) => supply.id !== id));
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

    setSaveButton(true);
  }

  // When adding new element, "saves" it to change Accordeon height
  function handleSupplyFormStorages(s, id) {
    const newSupplies = supplies.map((supply) =>
      supply.id === id ? { ...supply, storages: s } : supply
    );
    onChangeSupplies(newSupplies);
  }

  async function handleSubmit() {
    setLoading(true);

    const data = {
      identification: Capitalize(identification),
      physical_state: Capitalize(physicalState),
      quantity,
      unit,
      transport: Capitalize(transport),
      packaging: Capitalize(packaging),
      storages,
    };

    try {
      const response = await api.post('supply', data);
      onChangeSupplies([...supplies, response.data]);
      setIdentification('');
      setPhysicalState('');
      setQuantity('');
      setUnit('');
      setTransport('');
      setPackaging('');
      setStorages([]);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  function handleQuantity(value) {
    setQuantity(value ? parseInt(value, 10) : '');
  }

  useEffect(() => {
    if (
      identification ||
      physicalState ||
      quantity ||
      unit ||
      transport ||
      packaging ||
      storages.length > 1
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [identification, physicalState, quantity, unit, transport, packaging, storages]); // eslint-disable-line

  return (
    <FormBlock>
      <p className="block-title">Insumos</p>
      <p className="block-description">
        Preencher os campos abaixo identificando cada um dos insumos e as
        respectivas especificidades, formas de recebimento e armazenamento.
      </p>

      {supplies.length > 0 &&
        supplies.map((supply, index) => (
          <Accordion
            key={supply.id}
            number={index + 1}
            title={supply.identification}
            length={supply.storages.length}
            editable={editable}
          >
            <SupplyForm
              supply={supply}
              onChangeSupply={(s) => handleUpdate(s)}
              onDeleteSupply={(id) => handleDelete(id)}
              onChangeStorages={(s) => handleSupplyFormStorages(s, supply.id)}
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
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
                Salvar insumo
              </>
            )}
          </button>
        )}
      </div>
    </FormBlock>
  );
}
