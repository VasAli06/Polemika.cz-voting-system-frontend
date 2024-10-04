<template>
    <div>
        <h2>Přihlášení</h2>
        <form @submit.prevent="login">
            <input type="text" v-model="username" placeholder="Uživatelské jméno" required />
            <input type="password" v-model="password" placeholder="Heslo" required />
            <button type="submit">Přihlásit se</button>
        </form>
    </div>
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
        },
    },
};
</script>
