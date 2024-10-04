<template>
    <div>
      <h2>Edit Local Poll for Episode {{ episodeId }}</h2>
      <!-- Formulář pro editaci local pollu -->
    </div>
  </template>
  
  <script>
  export default {
    computed: {
      episodeId() {
        return this.$route.params.id;
      }
    }
  };
  </script>
  