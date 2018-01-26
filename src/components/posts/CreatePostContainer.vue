<template>
  <div>
    <CreatePostLayout @submit="handleCreatePost">
      <CreateDescription 
        slot="description"
        v-model="content" 
      />
      <SubmitButton 
        slot="submit"
        :submitted="submitted"
      />
    </CreatePostLayout>
  </div>
</template>

<script>
  import steem as 'steem'
  import CreatePostLayout from './CreatePostLayout'
  import CreateDescription from './CreateDescription'
  import SubmitButton from '@/components/shared/SubmitButton'

  export default {
    name: 'CreateContainer',

    components: {
      CreatePostLayout,
      CreateDescription,
      SubmitButton
    },

    data () {
      return {
        content: '',
        submitted: false
      }
    },

    methods: {
      handleCreatePost () {
        console.log('submitted')
        steem.broadcast.comment(

        )
      }
    }
  }
</script>

<style scoped>
</style>
