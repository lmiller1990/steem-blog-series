import Vue from 'vue'
import { storiesOf } from '@storybook/vue'

import CreateDescription from '@/components/posts/CreateDescription'
import SubmitButton from '@/components/shared/SubmitButton'
import CreatePostLayout from '@/components/posts/CreatePostLayout'

storiesOf('Create Post', module)
  .add('CreateDescription', () => ({
    components: { CreateDescription },
    data () {
      return {
        post: 'This is a test post.'
      }
    },
    template: `
      <CreateDescription v-model="post" />
    `
  }))
  .add('CreatePostLayout', () => ({
    components: { CreateDescription, SubmitButton, CreatePostLayout },
    data () {
      return {
        post: 'This is a test post.'
      }
    },
    template: `
      <div style="width: 500px; margin; none; paddding: none;">
        <CreatePostLayout>
          <CreateDescription slot="description" v-model="post" />
          <SubmitButton slot="submit" :submitted="false" />
        </CreatePostLayout>
      </div>
    `
  }))






