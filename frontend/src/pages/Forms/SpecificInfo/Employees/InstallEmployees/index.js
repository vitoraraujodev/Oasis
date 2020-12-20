import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import EmployeeForm from './InstallEmployeeForm';

import Accordion from '~/components/Accordion';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function InstallEmployees({
  employees,
  onChangeEmployees,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [kind, setKind] = useState('');
  const [amount, setAmount] = useState('');

  function handleUpdate(e) {
    const newEmployees = employees.map((employee) =>
      employee.id === e.id ? e : employee
    );

    onChangeEmployees(newEmployees);
  }

  function handleDelete(id) {
    onChangeEmployees(employees.filter((employee) => employee.id !== id));
  }

  async function handleSubmit() {
    setLoading(true);

    const data = {
      kind: Capitalize(kind),
      amount: amount ? parseInt(amount, 10) : '',
    };

    try {
      const response = await api.post('install-employee', data);
      onChangeEmployees([...employees, response.data]);
      setKind('');
      setAmount('');
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  function handleAmount(value) {
    setAmount(value ? parseInt(value, 10) : '');
  }

  useEffect(() => {
    if (kind || amount) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [kind, amount]); // eslint-disable-line

  return (
    <>
      <p className="block-subtitle">Funcionários na fase de instalação</p>

      {employees.length > 0 &&
        employees.map((employee, index) => (
          <Accordion
            key={employee.id}
            number={index + 1}
            title={employee.kind}
            editable={editable}
          >
            <EmployeeForm
              employee={employee}
              onChangeEmployee={handleUpdate}
              onDeleteEmployee={handleDelete}
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
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
                Salvar Funcionário
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
