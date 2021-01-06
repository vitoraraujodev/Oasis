import React from 'react';

import FormBlock from '~/components/FormBlock';

import SanitaryEffluents from './SanitaryEffluents';
import IndustrialEffluents from './IndustrialEffluents';
import OilyEffluents from './OilyEffluents';

export default function Effluents({
  sanitary,
  onChangeSanitary,
  sanitaryEffluents,
  onChangeSanitaryEffluents,
  industrialEffluents,
  onChangeIndustrialEffluents,
  oilyEffluents,
  onChangeOilyEffluents,
  editable,
}) {
  return (
    <FormBlock>
      <p className="block-title">Efluentes</p>
      <p className="block-description">
        Descreva todos os efluentes gerados pelas atividades da empresa,
        informando o sanitário, industrial e oleoso, assim como, as suas
        respectivas características.
      </p>

      <SanitaryEffluents
        sanitary={sanitary}
        onChangeSanitary={onChangeSanitary}
        sanitaryEffluents={sanitaryEffluents}
        onChangeSanitaryEffluents={onChangeSanitaryEffluents}
        editable={editable}
      />

      <IndustrialEffluents
        industrialEffluents={industrialEffluents}
        onChangeIndustrialEffluents={onChangeIndustrialEffluents}
        editable={editable}
      />

      <OilyEffluents
        oilyEffluents={oilyEffluents}
        onChangeOilyEffluents={onChangeOilyEffluents}
        editable={editable}
      />
    </FormBlock>
  );
}
