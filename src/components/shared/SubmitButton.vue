<template>
  <button 
    type="submit"
    :disabled="submitted"
    :class="[ submitted ? 'button--submitted' : 'button' ]"
  >
    Submit
  </button>
</template>

<script>
  export default {
    name: 'SubmitButton',

    props: {
      submitted: {
        type: Boolean,
        required: true
      }
    }
  }
</script>

<style scoped>
</style>
