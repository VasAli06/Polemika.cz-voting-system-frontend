<script setup>
import { useDuelData } from '@/stores/DuelData';
import { ref, onMounted, computed } from 'vue';
import { API_BASE_URL } from '../config'; // Ujistěte se, že máte správnou cestu k API_BASE_URL
import { useRoute } from 'vue-router';

const route = useRoute();
const typedStrings = ref(['ka<span class="diacritics"n>.</span>', 'ka<span class="diacritics"n>?</span>', 'ka<span class="diacritics"n>!</span>']);
const DuelData = useDuelData();
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
        DuelData.hosts = data.guests;
    } catch (error) {
        errorMessage.value = error.message;
        console.error('Error fetching duel data:', error);
    }
};

// Celkový počet hlasů
const totalVotes = computed(() => {
    return DuelData.hosts.reduce((acc, host) => acc + host.votesLocal, 0); // Součet všech hlasů
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

    fetchDuelData(episodeId);

    // Nastavení intervalu pro obnovení dat každých 0.5 sekundy
    intervalId = setInterval(() => {
        fetchDuelData(episodeId);
    }, 500); // Obnovení každých 500 ms
});
</script>


<template>
    <main>
        <article class="top">
            <div class="logo_wraper">
                <img src="/headline.svg" alt="">
                <VueTyped :strings="typedStrings" :typeSpeed="500" :backSpeed="500" :loop="true"
                    class="animation-letters" />
            </div>

            <h1 id="vsid">HLASUJTE<span>!</span></h1>
        </article>

        <article class="hosts_grid">
            <section v-for="(host, index) in DuelData.hosts" :key="index">
                <h2>{{ host.name }}</h2> <!-- Opravený název hosta -->
                <img :src="`${API_BASE_URL}` + `/uploads/` + host.imageUrl" alt="" class="host-img" />
                <!-- Dynamické načítání obrázku hosta -->
                <p class="host_prcantage" :style="{ backgroundColor: host.host_color }">
                    {{ getPercentage(host.votesLocal) }} % <!-- Procentuální hlasování -->
                </p>
                
            </section>
        </article>

        <article class="down">

            <p class="vote-count" v-if="totalVotes !== 0">Počet hlasů: {{ totalVotes }}</p>
            <p class="vote-count" v-if="totalVotes == 0">Zatím žádné hlasy.</p>
            <p v-if="errorMessage">{{ errorMessage }}</p> <!-- Zobrazení chybové zprávy -->
        </article>
    </main>
</template>






<style lang="scss" scoped>
main {
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 30px;
}

.top {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;

    h1 {
        color: #ffffff;

        text-align: center;
        font-size: 60px;
        font-style: normal;
        font-weight: 900;
        line-height: normal;
    }

    h1 span {
        color: #00689D;
    }

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
}

.hosts_grid {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 100px;

    @media (max-width: 800px) {
        flex-direction: column;
    }

    section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        width: 100%;
    }

    h2 {
        color: #FFF;
        font-size: 50px;
        font-style: normal;
        line-height: normal;
        text-align: center;
    }

    .host-img {
        width: 250px;
        height: 250px;
        border-radius: 40px;
        object-fit: cover;
        aspect-ratio: 1/1;
    }

    .host_prcantage {
        text-align: center;
        font-size: 60px;
        font-style: normal;
        line-height: normal;
        padding: 10px;
        color: rgb(255, 255, 255);
        border-radius: 20px;
        background-color: #FF6927;
    }
}


.down {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;

    .website {
        color: white;
        font-size: 60px;
    }

    .vote-count {
        color: #ffffff;
        font-size: 30px;
        font-style: normal;
        line-height: normal;
    }
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