<template>
  <div class="wrapper">
    <form 
      class="form"
      @submit.prevent="$emit('submit')"
    >
      <slot name="description" />
      <div class="form__submit">
        <slot name="submit" />
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'CreatePost'
  }
</script>

<style scoped>
.wrapper {
  width: 500px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form__submit {
  align-self: flex-end;
  margin: 8px 0px;
}
</style>
