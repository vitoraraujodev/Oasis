import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

import './styles.css';

export default function Accordion({
  number = 0,
  title = '',
  loading = false,
  children,
}) {
  const [active, setActive] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current.style.maxHeight = active
      ? `${contentRef.current.scrollHeight}px`
      : '0px';
  }, [contentRef, active]);

  function toogleActive() {
    if (!loading) {
      setActive(!active);
    }
  }

  useEffect(() => {}, [number]);

  return (
    <div id="accordion">
      <button type="button" className="accordion-tab" onClick={toogleActive}>
        <div className="accordion-number">{number}</div>
        <span className="accordion-title">{title}</span>

        <div className="chevron">
          <div className={active ? 'accordion-icon rotate' : 'accordion-icon'}>
            <FaChevronDown size={24} fill="#ccc" />
          </div>
        </div>
      </button>

      <div ref={contentRef} className="accordion-content">
        {children}
      </div>
    </div>
  );
}
