<template>
  <button 
    type="submit"
    :disabled="submitted"
    :class="[ submitted ? 'button button--submitted' : 'button' ]"
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
.button {
  border-radius: 3px;
  border: 1px solid cornflowerblue;
  color: cornflowerblue;
  cursor: pointer;
  width: 100px;
  height: 30px;
  font-size: 12pt;
}

.button:hover {
  opacity: 0.8;
}

.button--submitted {
  opacity: 0.4 !important;
}
</style>
