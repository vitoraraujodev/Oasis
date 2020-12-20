import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function EmployeeForm({
  employee,
  onChangeEmployee,
  onDeleteEmployee,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(true);

  const [kind, setKind] = useState(employee.kind);
  const [amount, setAmount] = useState(employee.amount);

  async function handleSubmit() {
    setLoading(true);

    const data = {
      id: employee.id,
      kind: Capitalize(kind),
      amount: amount ? parseInt(amount, 10) : '',
    };

    try {
      const response = await api.post('employee', data);
      setSaveButton(false);
      onChangeEmployee(response.data);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);

    try {
      const response = await api.delete(`employee/${employee.id}`);
      if (response.data.okay) onDeleteEmployee(employee.id);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }

    setLoading(false);
  }

  function handleAmount(value) {
    setAmount(value ? parseInt(value, 10) : '');
  }

  useEffect(() => {
    if (kind !== employee.kind || amount !== employee.amount) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [kind, amount]); // eslint-disable-line

  return (
    <div className="accordion-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Tipo de funcionário</p>
          <input
            value={kind}
            className="input"
            disabled={!editable}
            onChange={(e) => setKind(Capitalize(e.target.value))}
            placeholder="Tipo"
          />
        </div>

        <div className="input-group">
          <p className="input-label">Quantidade</p>
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
