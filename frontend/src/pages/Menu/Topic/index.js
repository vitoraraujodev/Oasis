import React from 'react';

import './styles.css';

function Topic({ topicNumber = '0', topicTitle = '', topicDescription = '' }) {
  return (
    <div id="form-topic">
      <div className="topic-number">{topicNumber}</div>

      <div className="topic-info">
        <div>
          <strong className="topic-title">{topicTitle}</strong>
          <p className="topic-description">{topicDescription}</p>
        </div>
      </div>

      <div className="arrow-container">
        <div className="arrow" />
      </div>
    </div>
  );
}

export default Topic;
