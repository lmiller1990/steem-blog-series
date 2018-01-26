<template>
  <div>
    Create Post Component
    <form @submit.prevent="$emit('submit')">
      <slot name="description" />
      <slot name="submit" />
    </form>
  </div>
</template>

<script>
  export default {
    name: 'CreatePost'
  }
</script>

<style scoped>
</style>
