import { shallow } from 'vue-test-utils'
import CreateDescription from './CreateDescription'

describe('CreateDescription', () => {
  it('emits a input event with the entered value', () => {
    const wrapper = shallow(CreateDescription, {
      propsData: {
        value: ''
      }
    })
    wrapper.find('textarea').element.value = 'Post'
    wrapper.find('textarea').trigger('input')
    expect(wrapper.emitted().input[0][0]).toEqual('Post')
  })
})
