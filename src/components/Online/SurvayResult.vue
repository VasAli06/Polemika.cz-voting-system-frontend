<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { API_BASE_URL } from '@/config';

const route = useRoute();
const pollQuestion = ref(null);
const errorMessage = ref('');

// Metoda pro načtení otázky ankety
const fetchPollQuestion = async (episodeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}/poll-question`);
        if (!response.ok) {
            throw new Error('Poll question not found');
        }
        const data = await response.json();
        console.log(data)

        data.pollQuestion.options = data.pollQuestion.options.sort((a, b) => a.id - b.id);
        // Přiřadí celý objekt pollQuestion do pollQuestion.value
        pollQuestion.value = data.pollQuestion;

    } catch (error) {
        errorMessage.value = error.message;
        console.error('Error fetching poll question:', error);
    }
};

const totalVotes = computed(() => {
    if (!pollQuestion.value || !pollQuestion.value.options) return 0;
    return pollQuestion.value.options.reduce((sum, option) => {
        return sum + (option.votesOnline || 0);
    }, 0);
});

let intervalId = null;

onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const episodeId = route.params.id;
    const episodeId2 = urlParams.get('episodeId');
    fetchPollQuestion(episodeId||episodeId2);

    intervalId = setInterval(() => {
        fetchPollQuestion(episodeId);
    }, 30000);
});

onBeforeUnmount(() => {
    clearInterval(intervalId);
});
</script>


<template>
    <hr>
    <article v-if="pollQuestion" class="main-container">

        <p class="question"> {{ pollQuestion.question }}</p>
        <p>Průběžné výsledky</p>
        <article class="options-wrapper">
            <article v-for="(Question, index) in pollQuestion.options" :key="index" class="option">


                <p class="prcantage" v-if="totalVotes !== 0">
                    {{ (Question.votesOnline / totalVotes * 100).toFixed(0) }} %
                </p>
                <p class="prcantage" v-if="totalVotes == 0">
                    0 %
                </p>
                <div class="bar" :style="{ height: (Question.votesOnline / totalVotes) * 100 + '%' }">
                </div>

                <p class="option">{{ Question.text }}</p>

            </article>
        </article>
        <p class="vote-count" v-if="totalVotes == 0">Zatím žádné hlasy.</p>
        <p class="vote-count" v-if="totalVotes !== 0">Počet hlasů: {{ totalVotes }} </p>


    </article>


</template>

<style scoped lang="scss">
@use "@/assets/colors.scss" as *;

.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 60px;

    @media(max-width:750px) {
        margin-top: 40px;
    }

    .question {
        font-size: 80px;
        margin-bottom: 20px;
        width: 80%;
        text-align: center;

        @media(max-width:750px) {
            font-size: 30px;
            width: 90%;

        }
    }

    p {
        font-size: 25px;

        @media(max-width:500px) {
            font-size: 15px;
        }
    }


    .options-wrapper {
        margin-top: 100px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;

        gap: 100px;
        margin-bottom: 50px;

        @media(max-width:750px) {
            margin-top: 40px;
            margin-bottom: 40px;
            flex-direction: row;
            gap: 50px;
            justify-content: center;
    

        }

        p {
            font-size: 35px;

            @media(max-width:750px) {
                font-size: 30px;
            }
        }

        article {
            display: flex;
            flex-direction: column;
            height: 300px;
            gap: 5px;
            align-items: center;
            justify-content: flex-end;

            @media(max-width:750px) {
                height: 200px;
            }

            .bar {
                background-color: $primary-color;
                border-radius: 10px;
                width: 100%;
                max-width: 80px;

            }
        }

    }
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
</style>
