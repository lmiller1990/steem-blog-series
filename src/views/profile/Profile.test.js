import { shallow } from 'vue-test-utils'
import Profile from './Profile'

describe('Profile', () => {
  it('renders', () => {
    const wrapper = shallow(Profile, {
      propsData: {
        profileImage: 'image',
        profileData: {}
      }
    })
  })
})
