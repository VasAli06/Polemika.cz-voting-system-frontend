<script setup>
import { ref, onMounted, computed } from 'vue';
import { API_BASE_URL } from '@/config';
import { useRoute } from 'vue-router';

const route = useRoute();

let hosts = ref([]);
const errorMessage = ref(''); // Přidání proměnné pro zobrazení chyb

// Metoda pro načtení dat o hostech
const fetchDuelData = async (episodeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}/duel`);
        if (!response.ok) {
            throw new Error('Duel data not found');
        }
        const data = await response.json();

        // Uložení hostů do state managementu
        hosts.value = data.guests;
    } catch (error) {
        errorMessage.value = error.message;
        console.error('Error fetching duel data:', error);
    }
};

// Celkový počet hlasů
const totalVotes = computed(() => {
    return hosts.value.reduce((acc, host) => acc + host.votesOnline, 0); // Součet všech hlasů
});

// Vypočítat procenta pro každého hosta
const getPercentage = (votes) => {
    if (totalVotes.value === 0) {
        return 0;
    }
    return Math.round((votes / totalVotes.value) * 100); // Procentuální výpočet
};
let intervalId = null;

onMounted(() => {

    const episodeId = route.params.id; // Získání ID epizody z URL
    const urlParams = new URLSearchParams(window.location.search);
    const episodeId2 = urlParams.get('episodeId');
    fetchDuelData(episodeId ||episodeId2) ;

    // Nastavení intervalu pro obnovení dat každých 0.5 sekundy
    intervalId = setInterval(() => {
        fetchDuelData(episodeId);
    }, 3000); // Obnovení každých 500 ms
});
</script>


<template>
    <hr>

    <article class="main-container">

        <p class="question"> S kým více sympatizujete<span>?</span></p>
        <p>Průběžné výsledky</p>
        <article class="hosts_grid">
            <section v-for="(host, index) in hosts" :key="index">
                <img :src="`${API_BASE_URL}` + `/uploads/` + host.imageUrl" alt="" class="host-img" />
                <h2>{{ host.name }}</h2> <!-- Opravený název hosta -->
                <p class="host_prcantage" :style="{ backgroundColor: host.host_color }">
                    {{ getPercentage(host.votesOnline) }} % <!-- Procentuální hlasování -->
                </p>

            </section>
        </article>

        <p class="vote-count" v-if="totalVotes !== 0">Počet hlasů: {{ totalVotes }}</p>
        <p class="vote-count" v-if="totalVotes == 0">Zatím žádné hlasy.</p>
    </article>
</template>






<style lang="scss" scoped>
@use "@/assets/colors.scss" as *;

hr {
    width: 80%;
    margin-top: 100px;
    border: white 3px solid;

    @media(max-width:750px) {
        border: white 2px solid;
        margin-top: 40px;
    }

}

.main-container {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media(max-width:750px) {
        margin-top: 40px;
    }

    .question {
        font-size: 80px;
        margin-bottom: 20px;
        text-align: center;

        @media(max-width:750px) {
            font-size: 30px;
        }
        span{
            color: $accent-color;
        }
    }

    p {
        font-size: 25px;
        @media(max-width:500px) {
            font-size: 15px;
        }

    }
}

.hosts_grid {
    width: 100%;
    display: flex;
    margin-top: 100px;

    flex-direction: row;
    justify-content: space-evenly;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 50px;

    @media(max-width:750px) {
        margin-top: 40px;
    }
    @media (max-width: 800px) {
        flex-direction: column;
    }

    section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        width: 100%;
        @media(max-width:750px) {
            gap: 10px;
        }

    }

    h2 {
        color: #FFF;
        font-size: 40px;
        font-style: normal;
        line-height: normal;
        text-align: center;
        @media(max-width:750px) {
        font-size: 25px;
        }
    }

    .host-img {

        object-fit: cover;
        aspect-ratio: 1/1;
        border: 3px solid white;
        width: 200px;
        height: 200px;
        border-radius: 20px;
        border: 3px solid white;
        @media(max-width:750px) {
            width: 150px;
            height: 150px;
        }

    }

    .host_prcantage {
        text-align: center;
        font-size: 40px;
        font-style: normal;
        line-height: normal;
        padding: 5px;
        color: rgb(255, 255, 255);
        border-radius: 1000px;
        padding-left: 20px;
        padding-right: 20px;
        color: black;
        background-color: #ffffff;
        @media(max-width:750px) {
            font-size: 25px;
        }

    }
}
</style>