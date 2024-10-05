<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>

@font-face {
  font-family: Dashboard;
  src: url(/Dashboard-Regular.ttf);
}
body {
  min-height: 100vh;
  line-height: 1;
  font-family: Dashboard;
  transition: 1s ease;
  background-color: #000000;
  color: white;
}

#app {
  height: 100%;
}
</style>
