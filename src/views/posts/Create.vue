<template>
  <div>
    <div class="title">Create Post</div>
    <CreatePostContainer />
  </div>
</template>

<script>
  import CreatePostContainer from '@/components/posts/CreatePostContainer'
  
  export default {
    name: 'Create',

    components: {
      CreatePostContainer
    }
  }
</script>

<style scoped>
</style>
