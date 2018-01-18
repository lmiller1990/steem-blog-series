<template>
  <div>
    <img :src="profileImage">
    <div>
      Name: {{ profileData.name }}
    </div>
    <div>
      Location: {{ profileData.location }}
    </div>
    <div>
      About: {{ profileData.about }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Profile',

    props: {
      profileImage: {
        type: String,
        required: true
      },

      profileData: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped>
</style>
