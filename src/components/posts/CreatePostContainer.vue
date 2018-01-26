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
  import steem from 'steem'
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

    created () {
      steem.api.setOptions({ url: 'https://api.steemit.com' })
    },

    methods: {
      handleCreatePost () {
        const key = ''
        steem.broadcast.comment(
          key,
          '',
          'test',
          'xenetics',
          'instagram-clone-steem',
          'A test post for creating a Instagram clone',
          'This is a test post for a series about creating a Instgram like website on the Steem blockchain. More here: steemit.com/@xenetics',
          { tags: ['test', 'test-2', 'test-3'] },
          (err, result) => {
            if (!err) {
              console.log('Result', result)
            }
          }
        )
      }
    }
  }
</script>

<style scoped>
</style>
