import React from 'react';

import './styles.css';

export default function TitleBlock({ title, description }) {
  return (
    <div id="title-block">
      <strong className="title">{title}</strong>
      {description && <p className="description">{description}</p>}
    </div>
  );
}
