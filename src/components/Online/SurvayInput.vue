<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { API_BASE_URL } from '@/config';

const route = useRoute();
const router = useRouter();

const pollQuestion = ref(null);
const errorMessage = ref('');
const selectedOption = ref(null);
const email = ref('');
const agree = ref(false); // Souhlas se zpracováním údajů
const erorrMessage = ref('');
const isLoading = ref(false); // Proměnná pro sledování načítání

// Funkce pro načtení otázky a možností
const fetchPollQuestion = async (episodeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}/poll-question`);
        if (!response.ok) {
            throw new Error('Poll question not found');
        }
        const data = await response.json();
        data.pollQuestion.options = data.pollQuestion.options.sort((a, b) => a.id - b.id);
        pollQuestion.value = data.pollQuestion;
    } catch (error) {
        errorMessage.value = error.message;
        console.error('Error fetching poll question:', error);
    }
};

// Funkce pro odeslání hlasu
const submitVote = async () => {
    if (!selectedOption.value || !email.value) {
        erorrMessage.value = 'Prosím vyberte jednu z možností!';
        return;
    }

    isLoading.value = true; // Zobrazení načítací ikony

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


        router.push('/odeslan'); // Změňte na vaši cílovou stránku
    } catch (error) {
        erorrMessage.value = error.message;
    } finally {
        isLoading.value = false; // Skrytí načítací ikony
    }
};

onMounted(() => {
    const episodeId = route.params.id;

    fetchPollQuestion(episodeId);
});
</script>

<template>
    <hr>
    <main>
        <p class="vote-slogan">Hlasujte i Vy<span>!</span></p>
        <h2 v-if="pollQuestion">{{ pollQuestion.question }}</h2>

        <form @submit.prevent="submitVote">
            <div class="row">
                <template v-if="pollQuestion && pollQuestion.options.length > 0">
                    <label v-for="(option, index) in pollQuestion.options" :key="index" :for="'host' + option.id"
                        class="option-label">
                        {{ option.text }}
                        <input type="radio" :id="'host' + option.id" name="vote" :value="option.id"
                            v-model="selectedOption">
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

            <!-- Načítací ikona -->
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

    @media(max-width:750px) {
        border: white 2px solid;
        margin-top: 40px;
    }
}

main {
    text-align: center;
    margin-top: 100px;
    background-color: #000000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media(max-width:750px) {
        margin-top: 40px;
    }

}

h1 {
    font-size: 30px;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 25px;
    text-align: center;
}

h2 {
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

form {
    margin-top: 30px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
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
    gap: 150px;
    display: flex;
    flex-wrap: wrap;

    @media(max-width:750px) {

        flex-direction: row;
    justify-content: center;
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

    @media(max-width:750px) {
        margin-top: 0px;
        margin-bottom: 0px;
        font-size: 30px;
    }

    input[type="radio"] {
        width: 60px;
        height: 30px;
        accent-color: $accent-color;

        @media(max-width:750px) {
            width: 50px;
            height: 20px;
        }
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
        margin-top: 20px;
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



input[type=text] {
    padding: 10px;
    border-radius: 10px;
    margin-top: 10px;
    text-align: center;
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


    input[type="radio"] {
        width: 30px;
    }

}
</style>