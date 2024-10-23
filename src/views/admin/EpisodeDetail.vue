<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col>
                    <v-card class="pa-5" color="secondary">
                        <v-card-title class="d-flex justify-space-between align-center">
                            <span class="text-h2">{{ episode.title }}</span>
                            <v-btn icon @click="openDeleteDialog" class="ml-2 mt-0" color="red">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>

            <v-row class="mt-5" dense>
                <v-col cols="12" md="6">
                    <v-card outlined class="pa-4">
                        <v-card-title>Edit Local Poll</v-card-title>
                        <v-card-actions>
                            <v-btn color="primary" :to="{ name: 'EditLocalPoll', params: { id: episode.id } }" text>
                                Go to Local Poll
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>

                <v-col cols="12" md="6">
                    <v-card outlined class="pa-4">
                        <v-card-title>Edit Online Poll</v-card-title>
                        <v-card-actions>
                            <v-btn color="primary" :to="{ name: 'EditOnlinePoll', params: { id: episode.id } }" text>
                                Go to Online Poll
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>

                <v-col cols="12" md="6">
                    <v-card outlined class="pa-4">
                        <v-card-title>Edit Duel</v-card-title>
                        <v-card-actions>
                            <v-btn color="primary" :to="{ name: 'EditDuel', params: { id: episode.id } }" text>
                                Go to Duel
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>

                <v-col cols="12" md="6">
                    <v-card outlined class="pa-4">
                        <v-card-title>Edit Poll Question</v-card-title>
                        <v-card-actions>
                            <v-btn color="primary" :to="{ name: 'EditPollQuestion', params: { id: episode.id } }" text>
                                Go to Poll Question
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>

            <v-dialog v-model="deleteDialog" max-width="290">
                <v-card>
                    <v-card-title class="headline">Delete Episode</v-card-title>
                    <v-card-text>Are you sure you want to delete this episode?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="grey" @click="closeDeleteDialog">Cancel</v-btn>
                        <v-btn color="red" @click="deleteEpisode">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </v-app>
</template>

<script>
import { API_BASE_URL } from '@/config';

export default {
    data() {
        return {
            episode: {},
            deleteDialog: false, // Dialog state
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
        openDeleteDialog() {
            this.deleteDialog = true; // Open the delete dialog
        },
        closeDeleteDialog() {
            this.deleteDialog = false; // Close the delete dialog
        },
        async deleteEpisode() {
            const episodeId = this.episode.id;
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    this.$router.push('/admin'); // Přesměrování na /admin

                    setTimeout(() => {
                        window.location.reload(); // Obnovení stránky po přesměrování
                    }, 100); // Krátká prodleva 100ms, aby přesměrování proběhlo dříve

                } else {
                    alert('Failed to delete episode.');
                }
            } catch (error) {
                console.error('Error deleting episode:', error);
            } finally {
                this.closeDeleteDialog(); // Close the dialog after deletion
            }
        },
    },
};
</script>

<style scoped>
.v-card {
    border-radius: 20px;
    background-color: white;
}

.v-btn {
    margin-top: 20px;
}
</style>