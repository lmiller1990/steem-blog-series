import { shallow } from 'vue-test-utils'
import CreatePostLayout from './CreatePostLayout'

describe('CreatePostLayout', () => {
  const stub = tag => `<div id=${tag} />`

  it('emits a submit event when submitted', () => {
    const wrapper = shallow(CreatePostLayout)
    wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted().submit).toHaveLength(1)
  })

  it('renders description and submit slots', () => {
    const wrapper = shallow(CreatePostLayout, {
      slots: {
        description: stub('description'),
        submit: stub('submit')
      }
    })
    expect(wrapper.find('#description').exists()).toBe(true)
    expect(wrapper.find('#submit').exists()).toBe(true)
  })
})
