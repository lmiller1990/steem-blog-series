import { shallow } from 'vue-test-utils'
import CreatePostContainer from './CreatePostContainer'

describe('CreatePostContainer', () => {
  const stub = tag => `<div id=${tag} />`
  const factory = (methods = {}) => {
    return shallow(CreatePostContainer, {
      methods,
      stubs: {
        CreatePostLayout: stub('layout')
      }
    })
  }

  it('renders a CreatePostLayout component', () => {
    const wrapper = factory()
    expect(wrapper.find('#layout').exists()).toBe(true)
    console.log(wrapper.html())
  })

  it('calls the Steem api with corrent args when handleCreatePost is called', () => {
    const handleCreatePost = jest.fn()
    const wrapper = factory({ handleCreatePost })
  })
})
