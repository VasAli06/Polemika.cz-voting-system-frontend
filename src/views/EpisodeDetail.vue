<template>
    <article>
        <h2>{{ episode.title }}</h2>
        <div class="wrapper">
            <div class="container"><router-link :to="{ name: 'EditLocalPoll', params: { id: episode.id } }">Edit Local Poll</router-link></div>
            <div class="container"><router-link :to="{ name: 'EditOnlinePoll', params: { id: episode.id } }">Edit Online Poll</router-link></div>
            <div class="container"><router-link :to="{ name: 'EditDuel', params: { id: episode.id } }">Edit Duel</router-link></div>
            <div class="container"><router-link :to="{ name: 'EditPollQuestion', params: { id: episode.id } }">Edit Poll Question</router-link></div>
        </div>
    </article>
</template>

<script>
import { API_BASE_URL } from '../config';

export default {
    data() {
        return {
            episode: {},
        };
    },
    async created() {
        await this.fetchEpisode();
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            handler() {
                this.fetchEpisode();
            },
        },
    },
    methods: {
        async fetchEpisode() {
            const episodeId = this.$route.params.id;
            try {
                const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}`);
                const data = await response.json();
                this.episode = data;
            } catch (error) {
                console.error('Error fetching episode details:', error);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
article {
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    width: 100%;

    align-items: center;
    justify-content: center;
}
h2{
    font-size: 100px;
    margin-bottom: 50px;
}
.wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background-color: black;
    gap: 50px;
}

.container {
    background-color: white;
    border-radius: 40px;
    padding: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    a {
        text-decoration: none;
        color: black;
    }
}
</style>