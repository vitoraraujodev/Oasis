import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { FaPlus } from 'react-icons/fa';

import EquipmentForm from './EquipmentForm';

import Accordion from '~/components/Accordion';

import api from '~/services/api';

import { Capitalize, formatDate } from '~/util/format';

export default function ProductiveEquipments({
  productiveEquipments,
  onChangeProductiveEquipments,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [identification, setIdentification] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [fuel, setFuel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [capacityUnit, setCapacityUnit] = useState('');
  const [consumption, setConsumption] = useState('');
  const [consumptionUnit, setConsumptionUnit] = useState('');

  function handleUpdate(e) {
    const equipments = productiveEquipments.map((equipment) =>
      equipment.id === e.id ? e : equipment
    );

    onChangeProductiveEquipments(equipments);
  }

  function handleDelete(id) {
    onChangeProductiveEquipments(
      productiveEquipments.filter(
        (productiveEquipment) => productiveEquipment.id !== id
      )
    );
  }

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      kind: 'productive',
      identification: Capitalize(identification),
      amount,
      date: formatDate(date),
      fuel: Capitalize(fuel),
      capacity,
      capacity_unit: capacityUnit,
      consumption,
      consumption_unit: consumptionUnit,
    };

    console.tron.log(data);
    try {
      const response = await api.post('equipment', data);
      onChangeProductiveEquipments([...productiveEquipments, response.data]);
      setIdentification('');
      setAmount('');
      setDate('');
      setFuel('');
      setCapacity('');
      setCapacityUnit('');
      setConsumption('');
      setConsumptionUnit('');
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  function handleAmount(value) {
    setAmount(value ? parseInt(value, 10) : '');
  }

  function handleCapacity(value) {
    setCapacity(value ? parseFloat(value) : '');
  }

  function handleConsumption(value) {
    setConsumption(value ? parseFloat(value) : '');
  }

  useEffect(() => {
    if (
      identification ||
      amount ||
      date ||
      fuel ||
      capacity ||
      capacityUnit ||
      consumption ||
      consumptionUnit
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [identification, amount, date, fuel, capacity, capacityUnit, consumption, consumptionUnit ]); // eslint-disable-line

  return (
    <>
      <p className="block-subtitle">Equipamentos Produtivos</p>
      <p className="block-subdescription">
        Identifique cada um dos equipamentos produtivos, assim como, as
        respectivas especificidades.
      </p>

      {productiveEquipments.length > 0 &&
        productiveEquipments.map((equipment, index) => (
          <Accordion
            key={equipment.id}
            number={index + 1}
            title={equipment.identification}
            editable={editable}
          >
            <EquipmentForm
              equipment={equipment}
              onChangeEquipment={handleUpdate}
              onDeleteEquipment={handleDelete}
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">Identificação do equipamento</p>
            <input
              value={identification}
              className="input"
              disabled={!editable}
              onChange={(e) => setIdentification(e.target.value)}
              placeholder="Equipamento"
            />
          </div>

          <div className="input-group">
            <p className="input-label b">Quantidade</p>
            <input
              value={amount}
              type="number"
              className="input small"
              disabled={!editable}
              onChange={(e) => handleAmount(e.target.value)}
              placeholder="01"
            />
          </div>
        </div>

        <div className="input-line">
          <div className="input-group ">
            <p className="input-label b">Capacidade</p>
            <input
              value={capacity}
              type="number"
              className="input "
              disabled={!editable}
              onChange={(e) => handleCapacity(e.target.value)}
              placeholder="01"
            />
          </div>

          <div className="input-group ">
            <p className="input-label b">Unidade de medida</p>
            <input
              value={capacityUnit}
              className="input "
              disabled={!editable}
              onChange={(e) => setCapacityUnit(e.target.value)}
              placeholder="Kg, L, m³..."
            />
          </div>

          <div className="input-group">
            <p className="input-label b">Data de instalação</p>
            <InputMask
              value={date}
              type="tel"
              mask="99/99/9999"
              className="input"
              disabled={!editable}
              onKeyDown={(e) => {
                if (e.key === ' ') e.preventDefault();
              }}
              onChange={(e) => setDate(e.target.value)}
              placeholder="25/12/2020"
            />
          </div>
        </div>

        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">Combustível</p>
            <div className="input-line">
              <div className="input-group">
                <p className="input-label">Tipo de Combustível</p>
                <input
                  value={fuel}
                  className="input"
                  disabled={!editable}
                  onChange={(e) => setFuel(e.target.value)}
                  placeholder="Diesel, gasolina... "
                />
              </div>

              <div className="input-group">
                <p className="input-label">Consumo anual</p>
                <input
                  value={consumption}
                  type="number"
                  className="input"
                  disabled={!editable}
                  onChange={(e) => handleConsumption(e.target.value)}
                  placeholder="01"
                />
              </div>

              <div className="input-group">
                <p className="input-label">Unidade de medida</p>
                <input
                  value={consumptionUnit}
                  className="input"
                  disabled={!editable}
                  onChange={(e) => setConsumptionUnit(e.target.value)}
                  placeholder="Kg, L, m³..."
                />
              </div>
            </div>
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
                Salvar equipamento
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
