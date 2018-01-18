<template>
  <div>
    <Profile 
      v-if="loaded"
      :profile-image="result.profile.profile_image"
      :profile-data="result.profile"
    />
  </div>
</template>

<script>
  import Profile from './Profile'
  import steem from 'steem'

  export default {
    name: 'ProfileContainer',

    components: {
      Profile
    },

    data () {
      return {
        result: {},
        loaded: false
      }
    },

    mounted () {
      steem.api.setOptions({ url: 'https://api.steemit.com' })
      steem.api.getAccounts(['xenetics'], (err, result) => {
        this.result = {...JSON.parse(result[0].json_metadata)}
        this.loaded = true
      })
    }
  }
</script>

<style scoped>
</style>
