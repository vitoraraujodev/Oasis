import React from 'react';

import './styles.css';

export default function WeekDayInput({ week = '0000000', onChangeWeek }) {
  function handleDay(index) {
    let value = week[index];
    if (parseInt(value, 10)) {
      value = 0;
    } else {
      value = 1;
    }

    onChangeWeek(week.substr(0, index) + value + week.substr(index + 1));
  }

  return (
    <div id="day-selector">
      <button
        type="button"
        className={week[0] === '1' ? 'selected-day' : 'day'}
        onClick={() => handleDay(0)}
      >
        D
      </button>
      <button
        type="button"
        className={week[1] === '1' ? 'selected-day' : 'day'}
        onClick={() => handleDay(1)}
      >
        S
      </button>
      <button
        type="button"
        className={week[2] === '1' ? 'selected-day' : 'day'}
        onClick={() => handleDay(2)}
      >
        T
      </button>
      <button
        type="button"
        className={week[3] === '1' ? 'selected-day' : 'day'}
        onClick={() => handleDay(3)}
      >
        Q
      </button>
      <button
        type="button"
        className={week[4] === '1' ? 'selected-day' : 'day'}
        onClick={() => handleDay(4)}
      >
        Q
      </button>
      <button
        type="button"
        className={week[5] === '1' ? 'selected-day' : 'day'}
        onClick={() => handleDay(5)}
      >
        S
      </button>
      <button
        type="button"
        className={week[6] === '1' ? 'selected-day' : 'day'}
        onClick={() => handleDay(6)}
      >
        S
      </button>
    </div>
  );
}
