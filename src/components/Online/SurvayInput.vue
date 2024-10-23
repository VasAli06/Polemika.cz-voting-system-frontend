<script setup>
import { ref, onMounted } from 'vue';
import { API_BASE_URL } from '@/config';
import { useRoute } from 'vue-router';

const route = useRoute();
const pollQuestion = ref(null); // Zde se budou ukládat data z API
const errorMessage = ref('');
const selectedOption = ref(null); // Uložení vybrané možnosti
const email = ref(''); // Uložení emailu
const showOverlay = ref(false); // Proměnná pro zobrazení overlay
const overlayMessage = ref(''); // Zpráva, která se zobrazí v overlay

// Funkce pro načtení otázky a možností
const fetchPollQuestion = async (episodeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}/poll-question`);
        if (!response.ok) {
            throw new Error('Poll question not found');
        }
        const data = await response.json();
        pollQuestion.value = data.pollQuestion; // Uložení načtených dat
    } catch (error) {
        errorMessage.value = error.message;
        console.error('Error fetching poll question:', error);
    }
};

// Funkce pro odeslání hlasu
const submitVote = async () => {
    if (!selectedOption.value || !email.value) {
        overlayMessage.value = 'Prosím vyberte hosta a zadejte váš email.';
        showOverlay.value = true;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/episodes/${route.params.id}/question/vote-online`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                optionId: selectedOption.value,
                email: email.value,
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Email je neplatný nebo již byl použit.');
        }

        overlayMessage.value = 'Hlasování proběhlo úspěšně! Zkontrolujte svůj email pro potvrzení.';
        showOverlay.value = true;
    } catch (error) {
        overlayMessage.value = error.message;
        showOverlay.value = true;
    }
};

onMounted(() => {
    const episodeId = route.params.id; // Získání ID epizody z URL
    fetchPollQuestion(episodeId);
});
</script>

<template>
    <main>
        <h1>Debata</h1>

        <h2 v-if="pollQuestion">{{ pollQuestion.question }}</h2> <!-- Dynamické zobrazení otázky -->

        <form @submit.prevent="submitVote"> <!-- Změněno na prevent, aby se formulář neodeslal standardně -->
            <div class="row">
                <template v-if="pollQuestion && pollQuestion.options.length > 0"> <!-- Zobrazení možností -->
                    <label v-for="(option, index) in pollQuestion.options" :key="index" :for="'host' + option.id"
                        class="option-label">
                        {{ option.text }} <!-- Text možnosti -->
                        <input type="radio" :id="'host' + option.id" name="vote" :value="option.id"
                            v-model="selectedOption">
                    </label>
                </template>

                <hr>
            </div>

            <label for="email" class="email">
                Váš email:
                <input type="email" id="email" name="email" v-model="email" required>
            </label>
            <input type="submit" value="Hlasovat">
        </form>

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
    font-size: 60px;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 25px;
    text-align: center;
}

h2 {
    font-family: Roboto;
    font-size: 60px;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 15px;
    text-align: center;

}

p {
    font-size: 35px;
    margin-bottom: 10px;
}

.option-label:first-child {

    background-color: rgb(255, 255, 255);
    color: black;
    border-radius: 50px;
}

.option-label:nth-child(2) {
    background-color: rgb(255, 255, 255);
    color: black;
    border-radius: 50px;

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
    flex-direction: row;
}

.hostimg {

    width: 200px;
    height: 200px;
    border-radius: 45px;
    border: 10px solid #FF5F60;

}

.rightimg {
    border: 10px solid #008C72;
}

hr {
    border: 2px black solid;
}



label {
    margin-top: 25px;
    margin-bottom: 25px;

    padding: 10px;
    padding-top: 30px;
    padding-bottom: 30px;
    font-size: 42px;

    color: white;
    display: flex;
    gap: 15px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

input[type="radio"] {
    width: 100px;
    height: 50px;
    accent-color: #000000;
}



input[type="submit"] {
    color: white;
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
}

input[type=text] {
    padding: 10px;
    border-radius: 10px;
    margin-top: 10px;
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
        min-height: 100vh;
        height: auto;
    }

    h1 {
        margin-top: 80px;
        font-size: 80px;
    }

    h2 {
        font-size: 60px;

    }

    p {
        font-size: 20px;

    }

    input[type="submit"] {
        margin-bottom: 50px;
    }

    label {}
}

@media (max-width: 600px) {


    h1 {
        margin-top: 60px;
        font-size: 70px;
    }

    h2 {
        font-size: 50px;

    }

    p {
        font-size: 20px;

    }

    input[type="submit"] {
        margin-bottom: 50px;
        font-size: 40px;
        padding: 15px;
    }

    label {

        gap: 0px;
    }

    .no {
        font-size: 35px;
    }

    input[type="radio"] {
        width: 40px;
    }

    .yes {
        font-size: 35px;

    }
}


@media (max-width: 420px) {
    .row {
        gap: 15px;
    }

    h1 {
        margin-top: 60px;
        font-size: 55px;
    }

    h2 {
        font-size: 30px;

    }

    label {
        font-size: 20px;
    }

    label {}

    input[type="radio"] {
        width: 30px;
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