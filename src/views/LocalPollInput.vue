<script setup>
import Survay from '@/components/Local/SurvayInput.vue';
import Guests from '@/components/Local/GuestsInput.vue';

import { ref, onMounted } from 'vue';
import { API_BASE_URL } from '@/config';
import { useRoute } from 'vue-router';

const route = useRoute();
const episode = ref(null);
const errorMessage = ref('');

const fetchEpisode = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/episodes/${id}`);
        if (!response.ok) {
            throw new Error('Episode not found');
        }
        const data = await response.json();
        episode.value = data;
        console.log(episode.value.title)
        console.log(episode.value.activeLocalVote)
    } catch (error) {
        errorMessage.value = error.message;
        console.error('Error fetching episode details:', error);
    }
};

onMounted(() => {
    const episodeId = route.params.id;
    const intervalId = setInterval(() => {
        fetchEpisode(episodeId);

    }, 500);

    return () => clearInterval(intervalId);
});
</script>



<template>


    <Survay v-if="episode && episode.activeLocalVote === 'question'"></Survay>
    <Guests v-if="episode && episode.activeLocalVote === 'duel'" :episode=episode></Guests>

    <article v-if="episode && episode.activeLocalVote === 'none'">
        <h1>Neprobíhá právě žádné hlasování.</h1>
    </article>


</template>
<style lang="scss" scoped>
article {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;

    h1 {
        font-size: 60px;

        @media (max-width:500px) {
            font-size: 30px;
            text-align: center;
        }
    }
}
</style>
