<script setup>
import { ref, onMounted } from 'vue';
import { API_BASE_URL } from '@/config';
import { useRoute } from 'vue-router';

const route = useRoute();
let hosts = ref([]);
const errorMessage = ref('');
const props = defineProps(['episode']);
const selectedHost = ref(null);
const hash = ref('');
const showOverlay = ref(false); // Proměnná pro zobrazení overlay
const overlayMessage = ref(''); // Zpráva, která se zobrazí v overlay

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

// Metoda pro odeslání formuláře
const submitHandler = async () => {
    if (!selectedHost.value || !hash.value) {
        overlayMessage.value = 'Prosím vyberte hosta a zadejte váš kód.';
        showOverlay.value = true;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/localDuelVote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                episodeId: route.params.id,
                hostId: selectedHost.value,
                hash: hash.value,
            }),
        });

        if (!response.ok) {
            throw new Error('Hlasování se nezdařilo');
        }

        const result = await response.json();
        console.log('Úspěch:', result);
        overlayMessage.value = 'Hlasování proběhlo úspěšně!';
        showOverlay.value = true;
    } catch (error) {
        overlayMessage.value = error.message;
        showOverlay.value = true;
        console.error('Error submitting vote:', error);
    }
};

onMounted(() => {
    const episodeId = route.params.id;
    fetchDuelData(episodeId);
    const urlHash = route.params.code;

    if (urlHash) {
        hash.value = urlHash;
    }
});
</script>

<template>
    <main>
        <h1>Debata</h1>
        <h2>{{ props.episode.title }}</h2>
        <p>Vyberte, s kým více sympatizujete:</p>
        <form @submit.prevent="submitHandler">
            <div class="row">
                <template v-for="(host, index) in hosts" :key="index">
                    <label :for="'host' + index">
                        <img :src="`${API_BASE_URL}/uploads/${host.imageUrl}`" class="hostimg" alt="" />
                        {{ host.name }}
                        <input type="radio" :id="'host' + index" name="vote" :value="host.id" v-model="selectedHost">
                    </label>
                </template>
            </div>

            <label for="hash" class="hash">
                Váš kód:
                <input type="text" id="hash" name="hash" v-model="hash">
            </label>
            <input type="submit" value="Hlasovat">
        </form>

        <!-- Overlay, který se zobrazí po odeslání hlasování nebo při chybě -->
        <div v-if="showOverlay" class="overlay">
            <div class="overlay-content">
                <p>{{ overlayMessage }}</p>
                <button @click="showOverlay = false">Zavřít</button>
            </div>
        </div>
    </main>
</template>


<style lang="scss" scoped>
main {
    height: 100vh;
    font-family: Arial, sans-serif;
    text-align: center;
    background-color: #000000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0px;
}

h1 {
    font-family: Roboto;
    font-size: 55px;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 5px;
}

h2 {
    font-family: Roboto;
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
}

.row {
    gap: 150px;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.hostimg {

    width: 200px;
    height: 200px;
    border-radius: 45px;
    border: 10px solid var(--left-host);

}

.rightimg {
    border: 10px solid var(--right-host);
}

hr {
    border: 2px black solid;
}

label {
    width: 300px;
    margin-top: 25px;
    margin-bottom: 25px;
    font-size: 32px;
    display: flex;
    gap: 15px;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
}

input[type="radio"] {
    width: 100px;
    height: 50px;
    accent-color: var(--left-host);
}

#host2 {

    accent-color: var(--right-host);
}

input[type="submit"] {
    color: rgb(255, 255, 255);
    font-size: 50px;
    border-radius: 50px;
    padding: 20px;
    border: none;
    background: #FF6927;
    transition: ease 1s;
    margin-top: 25px;

}

input[type="submit"]:hover {
    transform: scale(112%);
    transition: ease 1s;
}

.hash {
    width: auto;
    height: auto;
    color: white;
    margin-top: 5px;
    margin-bottom: 5px;
}

input[type=text] {
    padding: 10px;
    border-radius: 10px;
    text-align: center;



}

@media (min-width: 950px) {
    hr {
        display: none;
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

    input[type="submit"] {
        margin-bottom: 50px;
        font-size: 40px;
        padding: 15px;
    }

    .hostimg {
        width: 150px;
        height: 150px;
        border: 5px solid var(--left-host);
    }

    .rightimg {
        border: 5px solid var(--right-host)
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

    .hostimg {

        width: 100px;
        height: 100px;


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

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.overlay-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.overlay-content p {
    font-size: 1.5rem;
    color: #000000;
    margin-bottom: 20px;
}

.overlay-content button {
    padding: 10px 20px;
    font-size: 1.2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.overlay-content button:hover {
    background-color: #0056b3;
}
</style>