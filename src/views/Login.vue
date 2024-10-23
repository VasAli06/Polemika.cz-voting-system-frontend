<template>
    <v-app>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-card-title class="text-h2 text-center">Přihlášení</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field
                    v-model="username"
                    label="Uživatelské jméno"
                    required
                    prepend-icon="mdi-account"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Heslo"
                    required
                    prepend-icon="mdi-lock"
                    type="password"
                    outlined
                  ></v-text-field>
                  <v-btn color="primary" type="submit" block> Přihlásit se </v-btn>
                </v-form>
              </v-card-text>
         
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import { API_BASE_URL } from '../config';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      async login() {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: this.username, password: this.password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token); // Ulož token
          this.$router.push('/admin');
        } else {
          alert('Neplatné uživatelské jméno nebo heslo');
        }
      }
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    border-radius: 20px;
  }
  </style>
  