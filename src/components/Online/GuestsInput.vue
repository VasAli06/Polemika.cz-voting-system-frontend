<script setup>
import { ref, onMounted } from 'vue';
import { API_BASE_URL } from '@/config';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

let hosts = ref([]);
const errorMessage = ref('');
const selectedHost = ref(null);
const email = ref('');
const agree = ref(false); // Souhlas se zpracováním údajů
const erorrMessage = ref('');
const isLoading = ref(false); // Proměnná pro sledování načítání


// Metoda pro načtení dat o hostech
const fetchDuelData = async (episodeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}/duel`);
        if (!response.ok) {
            throw new Error('Duel data not found');
        }
        const data = await response.json();
        hosts.value = data.guests;
    } catch (error) {
        errorMessage.value = error.message;
        console.error('Error fetching duel data:', error);
    }
};

const submitHandler = async () => {
    const episodeId = route.params.id;

    if (!email.value || !selectedHost.value) {
        erorrMessage.value = 'Prosím vyberte jednoho z hostů!';

        return;
    }
    isLoading.value = true; // Zobrazení načítací ikony

    try {
        const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}/duel/vote-online`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
                guestId: selectedHost.value,
            }),
        });

        if (response.ok) {
            router.push('/odeslan'); // Změňte na vaši cílovou stránku

        } else {
            const errorData = await response.json();
            erorrMessage.value = `${errorData.error}`;
        }

    } catch (error) {
        erorrMessage.value = error;
    }
    finally {
        isLoading.value = false; // Skrytí načítací ikony
    }

};



onMounted(() => {
    const episodeId = route.params.id;
    fetchDuelData(episodeId);

});
</script>
<template>
    <hr>

    <main>
        <p class="vote-slogan">Hlasujte i Vy<span>!</span></p>
        <form @submit.prevent="submitHandler">
            <div class="row">
                <template v-for="(host, index) in hosts" :key="index">
                    <label :for="'host' + index" class="host-label">
                        <img :src="`${API_BASE_URL}/uploads/${host.imageUrl}`" class="hostimg" alt="" />
                        {{ host.name }}
                        <input type="radio" :id="'host' + index" name="vote" :value="host.id" v-model="selectedHost">
                    </label>
                </template>
            </div>
            <label for="email" class="email">
                Váš email:
                <input type="email" id="email" name="email" v-model="email" required
                    placeholder="vaclav.novak@seznam.cz">
            </label>

            <label for="osobni" class="agree">
                Souhlasím se zpravováním osobních údajů <input type="checkbox" id="osobni" name="osobni" v-model="agree"
                    required>
            </label>
            <p class="error" v-if="isLoading !== true"> {{ erorrMessage }}</p>

            <input type="submit" value="Hlasovat" :disabled="isLoading" v-if="isLoading !== true">

            <div v-if="isLoading" class="loading-spinner"></div>
        </form>


    </main>
</template>


<style lang="scss" scoped>
@use "@/assets/colors.scss" as *;

.loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: $primary-color;
    animation: spin 1s ease infinite;
    margin: 20px auto;
    display: block;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error {
    color: red;
    font-size: 20px;
}

hr {
    width: 80%;
    margin-top: 100px;
    border: white 3px solid;
}

main {
    text-align: center;
    background-color: #000000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 100px;

    @media(max-width:750px) {
        margin-top: 40px;
    }
}

h1 {
    font-size: 55px;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 5px;
}

h2 {
    font-size: 65px;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 5px;
}

p {
    font-size: 35px;
    margin-bottom: 10px;
}

form {
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    width: 50%;
    @media(max-width:750px) {
        width:100%;
        overflow: hidden;
    }

}


.vote-slogan {
    font-size: 100px;
    margin-bottom: 50px;

    span {
        color: $accent-color;
    }

    @media(max-width:750px) {
        font-size: 40px;
        margin-bottom: 25px;
    }
}

.row {
    width: 100%;
    display: flex;
    margin-top: 100px;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    @media (max-width: 800px) {
        flex-direction: column;
        margin-top: 0px;
    }

}

.host-label {
    margin-top: 25px;
    margin-bottom: 25px;

    padding: 10px;
    font-size: 40px;

    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;

    input[type="radio"] {
        width: 60px;
        height: 30px;
        accent-color: $accent-color;

        @media(max-width:750px) {
            width: 50px;
            height: 20px;
        }

    }

    @media(max-width:750px) {
        gap: 10px;
        font-size: 25px;
        margin-top: 0px;
        margin-bottom: -30px;
    }

}

.agree {
    font-size: 30px;

    @media(max-width:750px) {
        font-size: 20px;
        width: 80%;
        margin-top: 0px;
        margin-bottom: 0px;
    }


}

input[type="checkbox"] {
    width: 40px;
    height: 20px;

    @media(max-width:750px) {
        width: 25px;
        height: 15px;
    }
}

.email {

    font-size: 30px;

    @media(max-width:750px) {
        margin-top: 60px;
        font-size: 25px;
    }

}

input[type="email"] {
    padding: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 100px;
    width: 150%;
    font-size: 20px;
    text-align: center;

    @media(max-width:750px) {
        width: 300px;
        font-size: 15px;
    }

    @media(max-width:380px) {
        width: 250px;
    }

}

input[type="submit"] {
    color: white;
    font-size: 30px;
    border-radius: 50px;
    padding: 40px;
    padding-top: 10px;
    padding-bottom: 10px;
    background: black;
    border: 4px solid $primary-color;
    transition: ease 1s;
    margin-top: 25px;

    @media(max-width:750px) {
        font-size: 20px;

    }

}

input[type="submit"]:hover {
    transform: scale(112%);
    transition: ease 1s;
    cursor: pointer;
}

.hostimg {

    aspect-ratio: 1/1;
    width: 200px;
    height: 200px;
    border-radius: 20px;
    object-fit: cover;
    border: 3px solid white;

    @media(max-width:750px) {
        width: 150px;
        height: 150px;
    }
}


label {
    margin-top: 25px;
    margin-bottom: 25px;

    padding: 10px;
    font-size: 40px;

    color: white;
    display: flex;
    gap: 15px;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    input[type="radio"] {
        width: 60px;
        height: 30px;
        accent-color: $accent-color;
    }

}






@media (max-width: 950px) {
    .row {
        gap: 35px;
    }

    body {
        min-height: 60vh;
        height: auto;
    }

    h1 {
        margin-top: 80px;
        font-size: 80px;
    }

    h2 {
        font-size: 80px;

    }

    p {
        font-size: 20px;

    }

    input[type="submit"] {
        margin-bottom: 50px;
    }
}

@media (max-width: 600px) {


    h1 {
        margin-top: 60px;
        font-size: 70px;
    }

    h2 {
        font-size: 60px;

    }

    p {
        font-size: 20px;

    }



    label {
        width: 190px;
        font-size: 30px;
    }

    input[type="radio"] {
        width: 50px;
    }
}


@media (max-width: 420px) {
    input[type="radio"] {
        width: 35px;
    }

    .row {
        gap: 30px;
    }

    h1 {
        margin-top: 60px;
        font-size: 55px;
    }

    h2 {
        font-size: 40px;

    }

    label {
        font-size: 30px;
        width: 100%;
    }

}
</style>