import Vue from 'vue'
import { storiesOf } from '@storybook/vue'

import SubmitButton from '@/components/shared/SubmitButton'

storiesOf('SubmitButton', module)
  .add('States', () => ({
    components: { SubmitButton },
    template: `
      <div>
        <div>Not Submitted</div>
        <SubmitButton :submitted="false" />
        <div>Submitted</div>
        <SubmitButton :submitted="true" />
      </div>
    `
  }))
