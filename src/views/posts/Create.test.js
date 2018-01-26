import { shallow } from 'vue-test-utils'
import Create from './Create'

describe('Create', () => {
  it('renders a Create Post title', () => {
    const wrapper = shallow(Create)
    expect(wrapper.find('.title').text()).toEqual('Create Post')
  })
})
