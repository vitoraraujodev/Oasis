import React from 'react';
import { FaTrash } from 'react-icons/fa';

import WeekDayInput from '~/components/WeekDayInput';

export default function Shifts({
  shift,
  onChangeShift,
  onDeleteShift,
  editable,
}) {
  function handleStartHour(value) {
    const hour = value ? parseInt(value, 10) : '';
    if ((hour >= 0 && hour < 24) || hour === '') {
      onChangeShift({
        ...shift,
        start_at: hour,
      });
    }
  }

  function handleEndHour(value) {
    const hour = value ? parseInt(value, 10) : '';
    if ((hour >= 0 && hour < 24) || hour === '') {
      onChangeShift({
        ...shift,
        end_at: hour,
      });
    }
  }

  return (
    <div className="subform">
      <div className="input-line">
        <div className="input-group small">
          <p className="input-label">Início</p>
          <input
            value={shift.start_at}
            inputMode="numeric"
            maxLength="2"
            className="input small"
            disabled={!editable}
            onKeyDown={(e) => {
              if ((e.key < 0 || e.key > 9) && e.key !== 'Backspace')
                e.preventDefault();
            }}
            onChange={(e) => handleStartHour(e.target.value)}
            placeholder="00"
          />
        </div>

        <div className="input-group small">
          <p className="input-label">Fim</p>
          <input
            value={shift.end_at}
            inputMode="numeric"
            maxLength="2"
            className="input small"
            disabled={!editable}
            onKeyDown={(e) => {
              if ((e.key < 0 || e.key > 9) && e.key !== 'Backspace')
                e.preventDefault();
            }}
            onChange={(e) => handleEndHour(e.target.value)}
            placeholder="23"
          />
        </div>

        <div className="input-group" style={{ marginLeft: 32 }}>
          <p className="input-label">Dias da semana</p>
          <WeekDayInput
            week={shift.week}
            onChangeWeek={(week) => onChangeShift({ ...shift, week })}
            editable={editable}
          />
        </div>

        {editable && (
          <button
            type="button"
            className="delete-subform-button"
            onClick={onDeleteShift}
          >
            <FaTrash size={18} color="#DD3C3C" />
          </button>
        )}
      </div>
    </div>
  );
}
