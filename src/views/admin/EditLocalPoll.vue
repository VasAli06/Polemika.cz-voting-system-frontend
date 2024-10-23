<template>
  <v-container>
    <h2 class="text-h2 mb-8">Edit Local Poll for Episode {{ episodeTitle }}</h2>

    <div class="button-container">
      <v-btn color="primary" @click="openGenerateCodesDialog">
        <v-icon left>mdi-generate</v-icon>
        Generate Codes
      </v-btn>
      <v-btn color="secondary" @click="openResetDuelDialog">
        <v-icon left>mdi-refresh</v-icon>
        Reset Duel Flags
      </v-btn>
      <v-btn color="tertiary" @click="openResetQuestionDialog">
        <v-icon left>mdi-refresh</v-icon>
        Reset Question Flags
      </v-btn>
      <v-row>

        <router-link :to="{ name: 'results', params: { id: episodeId } }" class="ml-3 mt-5 mr-5">

          <v-btn color="yellow" @click="openResetQuestionDialog">
            <v-icon left>mdi-trophy-award</v-icon>
            Open results
          </v-btn>
        </router-link>
        <router-link :to="{ name: 'PrintCodes', params: { id: episodeId } }"  class="mr-5 mt-5 mb-5">
          <v-btn color="accent">
            <v-icon left>mdi-printer</v-icon>
            Print Codes
          </v-btn>
        </router-link>

      </v-row>

    </div>

    <div class="select-container">
      <label for="activeVote">Select Active Vote:</label>
      <select v-model="activeVote" @change="updateActiveVote" class="no-border">
        <option value="question">Question</option>
        <option value="duel">Duel</option>
        <option value="none">None</option>
      </select>
    </div>

    <div v-if="message">{{ message }}</div>

    <!-- Dialog pro generování kódů -->
    <v-dialog v-model="generateCodesDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Generate Codes</v-card-title>
        <v-card-text>
          Are you sure you want to generate new codes? This action will overwrite the previous ones.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="generateCodes">Yes</v-btn>
          <v-btn color="red" text @click="generateCodesDialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog pro resetování Duel příznaků -->
    <v-dialog v-model="resetDuelDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Reset Duel Flags</v-card-title>
        <v-card-text>
          Are you sure you want to reset the duel flags?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="resetUsedDuel">Yes</v-btn>
          <v-btn color="red" text @click="resetDuelDialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog pro resetování Question příznaků -->
    <v-dialog v-model="resetQuestionDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Reset Question Flags</v-card-title>
        <v-card-text>
          Are you sure you want to reset the question flags?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="resetUsedQuestion">Yes</v-btn>
          <v-btn color="red" text @click="resetQuestionDialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { API_BASE_URL } from '@/config';

export default {
  data() {
    return {
      episodeTitle: '',
      message: '',
      activeVote: "none",
      generateCodesDialog: false,
      resetDuelDialog: false,
      resetQuestionDialog: false
    };
  },
  computed: {
    episodeId() {
      return this.$route.params.id;
    },
  },
  async created() {
    await this.fetchEpisodeTitle(); 
    await this.fetchCurrentVoteStatus();
  },
  methods: {
    async fetchEpisodeTitle() {
      try {
        const response = await fetch(`${API_BASE_URL}/episodes/${this.episodeId}/title`);
        if (response.ok) {
          const data = await response.json();
          this.episodeTitle = data.title; // Uložení názvu epizody
        } else {
          console.error('Failed to fetch episode title.');
        }
      } catch (error) {
        console.error('Error fetching episode title:', error);
      }
    },
    async fetchCurrentVoteStatus() {
      try {
        const response = await fetch(`${API_BASE_URL}/get-vote-status/${this.episodeId}`);
        const data = await response.json();
        this.activeVote = data.activeVote === "question"; // Assuming "question" is true
      } catch (error) {
        console.error('Error fetching vote status:', error);
      }
    },
    async updateActiveVote() {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_BASE_URL}/update-active-vote/${this.episodeId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ activeVote: this.activeVote }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        this.message = 'Vote status updated successfully!';
      } catch (error) {
        console.error('Error updating vote status:', error);
        this.message = 'Error updating vote status.';
      }
    },
    openGenerateCodesDialog() {
      this.generateCodesDialog = true;
    },
    openResetDuelDialog() {
      this.resetDuelDialog = true;
    },
    openResetQuestionDialog() {
      this.resetQuestionDialog = true;
    },
    async generateCodes() {
      this.generateCodesDialog = false; // Zavření dialogu
      const pollId = this.episodeId;
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_BASE_URL}/generate-codes/${pollId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        this.message = data.message;

        console.log('Generated codes:', data.codes);
      } catch (error) {
        console.error('Error generating codes:', error);
        this.message = 'Error generating codes.';
      }
    },
    async resetUsedDuel() {
      this.resetDuelDialog = false; // Zavření dialogu
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_BASE_URL}/reset-used-duel/${this.episodeId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        this.message = data.message;
      } catch (error) {
        console.error('Error resetting Duel flags:', error);
        this.message = 'Error resetting Duel flags.';
      }
    },
    async resetUsedQuestion() {
      this.resetQuestionDialog = false; // Zavření dialogu
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_BASE_URL}/reset-used-question/${this.episodeId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        this.message = data.message;
      } catch (error) {
        console.error('Error resetting Question flags:', error);
        this.message = 'Error resetting Question flags.';
      }
    }
  }
};
</script>

<style scoped>
.button-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* Spacing between buttons */
}

.select-container {
  margin-top: 16px;
}
</style>
