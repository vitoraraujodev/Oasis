import React from 'react';

import FormBlock from '~/components/FormBlock';

import SanitaryEffluents from './SanitaryEffluents';

export default function Effluents({
  sanitary,
  onChangeSanitary,
  sanitaryEffluents,
  onChangeSanitaryEffluents,
  editable,
}) {
  return (
    <FormBlock>
      <p className="block-title">Efluentes</p>
      <p className="block-description">
        Descrição detalhada de todos os efluentes gerados pelas atividades da
        empresa, especificamente, o sanitário, industrial e oleoso, assim como,
        as respectivas características.
      </p>

      <SanitaryEffluents
        sanitary={sanitary}
        onChangeSanitary={onChangeSanitary}
        sanitaryEffluents={sanitaryEffluents}
        onChangeSanitaryEffluents={onChangeSanitaryEffluents}
        editable={editable}
      />
    </FormBlock>
  );
}
