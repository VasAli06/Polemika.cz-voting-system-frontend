<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import GuestsInput from '@/components/Online/GuestsInput.vue';
import SurvayInput from '@/components/Online/SurvayInput.vue';
import GuestesResult from '@/components/Online/GuestesResult.vue';

import SurvayResult from '@/components/Online/SurvayResult.vue';

import { API_BASE_URL } from '@/config';

const episode = ref(null);
const duelHasGuests = ref(false);
const pollQuestionHasOptions = ref(false);
const activeTab = ref('null');
const route = useRoute();

onMounted(async () => {
  const episodeId = route.params.id;

  try {
    // Načteme základní informace o epizodě
    const episodeResponse = await fetch(`${API_BASE_URL}/episodes/${episodeId}`);
    if (episodeResponse.ok) {
      episode.value = await episodeResponse.json();
    } else {
      console.error('Episode not found');
    }

    // Načteme duel a zkontrolujeme hosty
    const duelResponse = await fetch(`${API_BASE_URL}/episodes/${episodeId}/duel`);
    if (duelResponse.ok) {
      const duelData = await duelResponse.json();
      duelHasGuests.value = duelData.guests && duelData.guests.length > 0;
    }

    // Načteme anketní otázku a zkontrolujeme možnosti
    const pollResponse = await fetch(`${API_BASE_URL}/episodes/${episodeId}/poll-question`);
    if (pollResponse.ok) {
      const pollData = await pollResponse.json();
      pollQuestionHasOptions.value = pollData.pollQuestion.options && pollData.pollQuestion.options.length > 0;
    }

    if (duelHasGuests.value && pollQuestionHasOptions.value) {
      activeTab.value = 'souboj';
    } else if (duelHasGuests.value) {
      activeTab.value = 'souboj';
    } else if (pollQuestionHasOptions.value) {
      activeTab.value = 'anketa';
    }
  } catch (error) {
    console.error('Error fetching episode details:', error);
  }
});

// Funkce pro přepínání mezi taby
const setActiveTab = (tab) => {
  activeTab.value = tab;
};
</script>

<template>
  <h1>{{ episode ? episode.title : 'Načítání...' }}</h1>
  
  <!-- Podmínka pro zobrazení přepínačů -->
  <section>
    <p :class="{ active: activeTab === 'anketa' }" @click="setActiveTab('anketa')" v-if="pollQuestionHasOptions">Anketa</p>
    <p :class="{ active: activeTab === 'souboj' }" @click="setActiveTab('souboj')" v-if="duelHasGuests">Souboj</p>
  </section>

  <GuestesResult v-if="activeTab === 'souboj'" ></GuestesResult>
  <GuestsInput  v-if="activeTab === 'souboj'" />
  <SurvayResult v-if="activeTab === 'anketa'"></SurvayResult>
  <SurvayInput v-if="activeTab === 'anketa'"/>

</template>

<style lang="scss" scoped>
@use "@/assets/colors.scss" as *;

h1 {
  font-size: 80px;
  padding-top: 60px;
  text-align: center;
  @media(max-width:750px) {
      font-size: 50px;
      padding-top: 30px;
    }
    @media(max-width:400px) {
        font-size: 35px;
    }

}

section {
  display: flex;
  flex-direction: row;
  gap: 40px;
  justify-content: center;
  margin-top: 30px;
  @media(max-width:750px) {
    margin-top: 15px;
  }

  p {
    border: 4px solid $primary-color;
    padding: 10px 20px;
    border-radius: 110px;
    font-size: 20px;
    transition: 0.3s ease;

    &:hover {
      transform: scale(1.05);
      cursor: pointer;
    }
    @media(max-width:750px) {
        font-size: 15px;
        padding: 5px 10px;
    }

  }

  .active {
    background-color: $primary-color;
    color: white;
  }
}
</style>
