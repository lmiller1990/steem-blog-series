import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ProfileView from '@/views/profile/Index'
import CreatePost from '@/views/posts/Create'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileView
    },
    {
      path: '/posts/create',
      name: 'CreatePost',
      component: CreatePost
    }
  ]
})
