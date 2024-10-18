<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { API_BASE_URL } from '@/config';

const route = useRoute();
const pollQuestion = ref(null);
const errorMessage = ref('');
const typedStrings = ref(['ka<span class="diacritics"n>.</span>', 'ka<span class="diacritics"n>?</span>', 'ka<span class="diacritics"n>!</span>']);

// Metoda pro načtení otázky ankety
const fetchPollQuestion = async (episodeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}/poll-question`);
        if (!response.ok) {
            throw new Error('Poll question not found');
        }
        const data = await response.json();
        pollQuestion.value = data.pollQuestion;
    } catch (error) {
        errorMessage.value = error.message;
        console.error('Error fetching poll question:', error);
    }
};

// Vypočítání celkového počtu hlasů
const totalVotes = computed(() => {
    if (!pollQuestion.value || !pollQuestion.value.options) return 0;
    return pollQuestion.value.options.reduce((sum, option) => {
        return sum + (option.votesLocal || 0);
    }, 0);
});

// Interval pro obnovu dat
let intervalId = null;

onMounted(() => {
    const episodeId = route.params.id; // Získání ID epizody z URL
    fetchPollQuestion(episodeId);

    // Nastavení intervalu pro obnovu dat každých 0,5 sekundy
    intervalId = setInterval(() => {
        fetchPollQuestion(episodeId);
    }, 500);
});

// Vyčištění intervalu při odpojení komponenty
onBeforeUnmount(() => {
    clearInterval(intervalId);
});
</script>

<template>
    <main class="container">
        <div class="logo_wraper">
                <img src="/headline.svg" alt="">
                <VueTyped :strings="typedStrings" :typeSpeed="500" :backSpeed="500" :loop="true"
                    class="animation-letters" />
            </div>
        <h1 v-if="pollQuestion">{{ pollQuestion.question }}</h1>
        <article v-if="pollQuestion" class="grid">
       
            <article class="middle">
                
                <img src="/VS.png" alt="" class="vs vs-an" id="vsid">
          
                <p class="vote-count" v-if="totalVotes == 0">Zatím žádné hlasy.</p>
                <p class="vote-count" v-if="totalVotes !== 0">Počet hlasů: {{ totalVotes }} </p>

            </article>


            <article v-for="(Question, index) in pollQuestion.options" :key="index" class="option"
                :style="{ order: index === pollQuestion.options.length - 1 ? 4 : undefined }">
                <h2>{{ Question.text }}</h2>
                <p class="prcantage" v-if="totalVotes !== 0">
                    {{ (Question.votesLocal / totalVotes * 100).toFixed(0) }} %
                </p>
            </article>

            <p v-if="errorMessage">{{ errorMessage }}</p>
        </article>
    </main>

</template>


<style lang="scss" scoped>
@use "@/assets/colors.scss" as *;
.logo_wraper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: white;
    }

    .logo_wraper .animation-letters {
        font-size: 111.61px;
    }

    .logo_wraper img {
        width: 450px;
    }

    .diacritics {
        color: #FF6927;

    }
.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

h1 {
    margin-top: 90px;

    text-align: center;
    font-size: 70px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
}



.middle {
    order: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;

    .vs {
        width: 260px;
    }

    .bitly {
        text-align: center;

        font-size: 30px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }

    .vote_count {
        font-size: 40px;
        font-style: normal;
        font-weight: 900;
        line-height: normal;
    }
}


.left {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: auto;
    z-index: -1;
}

.right {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: auto;
    z-index: -1;
}

h2 {
    color: #FFF;

    font-size: 60px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
}

.prcantage {
    text-align: center;
    font-size: 60px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    padding: 10px;
    border-radius: 20px;
    background-color: #FF6927;
    color: rgb(255, 255, 255);
}

.grid {
    display: grid;
    height: 100%;
    grid-template-columns: 1fr 3fr 1fr;
    transform: translateY(-50px);

}

article {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
}



.vote-count {
    font-size: 40px;
    margin-top: 150px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
}



.vs-an {
    animation: tilt-n-move-shaking 0.1s ease;
}

@keyframes tilt-n-move-shaking {
    0% {
        transform: translate(0, 0) rotate(0deg);
    }

    25% {
        transform: translate(5px, 5px) rotate(5deg);
    }

    50% {
        transform: translate(0, 0) rotate(0eg);
    }

    75% {
        transform: translate(-5px, 5px) rotate(-5deg);
    }

    100% {
        transform: translate(0, 0) rotate(0deg);
    }
}
</style>
