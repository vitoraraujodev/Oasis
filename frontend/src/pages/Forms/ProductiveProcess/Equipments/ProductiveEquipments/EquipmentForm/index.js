import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { FaCheck, FaTrash } from 'react-icons/fa';

import api from '~/services/api';

import { Capitalize, formatDate } from '~/util/format';

export default function EquipmentForm({
  equipment,
  onChangeEquipment,
  onDeleteEquipment,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(true);

  const [identification, setIdentification] = useState(
    equipment.identification
  );
  const [amount, setAmount] = useState(equipment.amount);
  const [date, setDate] = useState(formatDate(equipment.date));
  const [fuel, setFuel] = useState(equipment.fuel);
  const [capacity, setCapacity] = useState(equipment.capacity);
  const [capacityUnit, setCapacityUnit] = useState(equipment.capacity_unit);
  const [consumption, setConsumption] = useState(equipment.consumption);
  const [consumptionUnit, setConsumptionUnit] = useState(
    equipment.consumption_unit
  );

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      id: equipment.id,
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

    try {
      const response = await api.post('equipment', data);
      setSaveButton(false);
      onChangeEquipment(response.data);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);

    try {
      const response = await api.delete(`equipment/${equipment.id}`);
      if (response.data.okay) onDeleteEquipment(equipment.id);
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
      identification !== equipment.identification ||
      amount !== equipment.amount ||
      date !== formatDate(equipment.date) ||
      fuel !== equipment.fuel ||
      capacity !== equipment.capacity ||
      capacityUnit !== equipment.capacity_unit ||
      consumption !== equipment.consumption ||
      consumptionUnit !== equipment.consumption_unit
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [identification, amount, date, fuel, capacity, capacityUnit, consumption, consumptionUnit ]); // eslint-disable-line

  return (
    <div className="accordion-form">
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
