import React from 'react';
import { FaTrash } from 'react-icons/fa';

import WeekDayInput from '~/components/WeekDayInput';

export default function Shifts({
  shift,
  onChangeShift,
  onDeleteShift,
  editable,
}) {
  function handleHour(hour) {
    if ((parseInt(hour, 10) >= 0 && parseInt(hour, 10) < 24) || hour === '') {
      return true;
    }
    return false;
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
            onChange={(e) =>
              handleHour(e.target.value)
                ? onChangeShift({
                    ...shift,
                    start_at: e.target.value,
                  })
                : null
            }
            placeholder="00h"
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
            onChange={(e) =>
              handleHour(e.target.value)
                ? onChangeShift({
                    ...shift,
                    end_at: e.target.value,
                  })
                : null
            }
            placeholder="23h"
          />
        </div>

        <div className="input-group" style={{ marginLeft: 32 }}>
          <p className="input-label">Dias da semana</p>
          <WeekDayInput
            week={shift.week}
            onChangeWeek={(week) => onChangeShift({ ...shift, week })}
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
