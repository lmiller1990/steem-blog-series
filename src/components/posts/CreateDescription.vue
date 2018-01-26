<template>
  <textarea
    rows="5"
    class="content"
    :value="value"
    @input="handleInput"
  />
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
.content {
  font-size: 16pt; 
  border: 1px solid silver;
  border-radius: 3px;
  padding: 8px;
  resize: none;
}
</style>
