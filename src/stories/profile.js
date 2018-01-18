import Vue from 'vue'
import { storiesOf } from '@storybook/vue'

import Profile from '@/views/profile/Profile'

storiesOf('Profile', module)
  .add('with a profile image', () => ({
    components: { Profile },
    data () {
      return {
        image: 'https://vuejs.org/images/logo.png',
        profileData: {
          name: 'Lachlan',
          location: 'Tokyo',
          about: 'Software dev, steem and AI/ML'
        }
      }
    },
    template: `
      <profile 
        :profile-image="image" 
        :profile-data="profileData"
      />
    `
  }))

