import { shallow } from 'vue-test-utils'
import SubmitButton from './SubmitButton'

describe('SubmitButton', () => {
  const factory = (values = {}) => {
    return shallow(SubmitButton, {
      propsData: values
    })
  }

  it('renders the default state and receives props', () => {
    const wrapper = factory({ submitted: false })
    expect(wrapper.classes('button')).toEqual(['button'])
    expect(wrapper.find('button').vnode.data.attrs.disabled).toBe(false)
  })

  it('has a button--submitted class when submitted is true', () => {
    const wrapper = factory({ submitted: true })
    expect(wrapper.classes('button')).toEqual(['button--submitted'])
    expect(wrapper.find('button').vnode.data.attrs.disabled).toBe(true)
  })
})
