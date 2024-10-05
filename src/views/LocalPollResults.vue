<script setup>
import Survay from '@/components/Local/SurvayResult.vue';
import Guests from '@/components/Local/GuestsResult.vue';
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
    console.log(episode.value.activeLocalVote)
  } catch (error) {
    errorMessage.value = error.message;
    console.error('Error fetching episode details:', error);
  }
};

onMounted(() => {
  const episodeId = route.params.id;

  // Nastavení intervalového volání
  const intervalId = setInterval(() => {
    fetchEpisode(episodeId);
  }, 500);

  // Uložení ID intervalu pro pozdější vyčištění
  // Je dobré mít na paměti, abyste vyčistili interval, když komponenta není aktivní
  return () => clearInterval(intervalId);
});
</script>

<template>

    <!-- Zkontrolujeme, zda je episode definována, než se pokusíme přistoupit k jejím vlastnostem -->
    <Survay v-if="episode && episode.activeLocalVote === 'question'"></Survay>
    <Guests v-if="episode && episode.activeLocalVote === 'duel'"></Guests>
    <h1 v-if="episode && episode.activeLocalVote === 'none'">AKTUÁLNĚ NEHLASUJEME 😀</h1>

</template>

<style scoped>

h1{
  font-size: 80px;
}</style>
