<template>
  <div>
    <textarea
      :value="value"
      @input="handleInput"
    />
  </div>
</template>

<script>
  export default {
    name: 'CreateDescription',

    props: {
      value: {
        type: String
      }
    },

    methods: {
      handleInput (e) {
        this.$emit('input', e.target.value)
      }
    }
  }
</script>

<style scoped>
</style>
