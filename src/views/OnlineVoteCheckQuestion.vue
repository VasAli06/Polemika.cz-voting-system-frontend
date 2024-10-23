<template>
    <div>
      <h1>Ověření Hlasu</h1>
      <div v-if="loading">Ověřování...</div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="message" class="success">{{ message }}</div>
    </div>
  </template>
  
  <script>
  import { API_BASE_URL } from '@/config';
  
  export default {
    data() {
      return {
        loading: false,
        message: '',
        error: ''
      };
    },
    mounted() {
      this.verifyVote();
    },
    methods: {
      async verifyVote() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const episodeId = urlParams.get('episodeId');
  
        this.loading = true;
  
        try {
          const response = await fetch(`${API_BASE_URL}/verify-vote-question?token=${token}&episodeId=${episodeId}`);
          const data = await response.json();
  
          if (!response.ok) {
            throw new Error(data.error || 'Něco se pokazilo.');
          }
  
          this.message = data.message;
        } catch (err) {
          this.error = err.message;
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  .success {
    color: green;
  }
  </style>
  