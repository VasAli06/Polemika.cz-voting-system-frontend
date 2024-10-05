<template>
  <div class="container">
    <h2>Edit Local Poll for Episode {{ episodeId }}</h2>
    <button @click="confirmGenerateCodes">Generate Codes</button>
    <button @click="resetUsedDuel">Reset Duel Flags</button>
    <button @click="resetUsedQuestion">Reset Question Flags</button>

    <router-link :to="{ name: 'PrintCodes', params: { id: episodeId } }">
      <button>Print Codes</button>
    </router-link>

    <div>
      <label for="activeVote">Select Active Vote:</label>
      <select v-model="activeVote" @change="updateActiveVote">
        <option value="question">Question</option>
        <option value="duel">Duel</option>
        <option value="none">None</option>
      </select>
    </div>

    <div v-if="message">{{ message }}</div>
  </div>
</template>

<script>
import { API_BASE_URL } from '@/config';

export default {
  data() {
    return {
      message: '',
      activeVote: "none", // Default value (question)
    };
  },
  computed: {
    episodeId() {
      return this.$route.params.id;
    },
  },
  async created() {
    await this.fetchCurrentVoteStatus();
  },
  methods: {
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
                'Authorization': `Bearer ${token}`, // Přidání tokenu do hlavičky
                'Content-Type': 'application/json' // Pokud je potřeba, můžete přidat i další hlavičky
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
    confirmGenerateCodes() {
      if (confirm('Are you sure you want to generate new codes? This action will overwrite the previous ones.')) {
        this.generateCodes();
      }
    },
    async generateCodes() {
      const pollId = this.episodeId;
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_BASE_URL}/generate-codes/${pollId}`, {
          method: 'POST',
          headers: {
                'Authorization': `Bearer ${token}`, // Přidání tokenu do hlavičky
                'Content-Type': 'application/json' // Pokud je potřeba, můžete přidat i další hlavičky
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
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_BASE_URL}/reset-used-duel/${this.episodeId}`, {
          method: 'POST',
          headers: {
                'Authorization': `Bearer ${token}`, // Přidání tokenu do hlavičky
                'Content-Type': 'application/json' // Pokud je potřeba, můžete přidat i další hlavičky
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
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_BASE_URL}/reset-used-question/${this.episodeId}`, {
          method: 'POST',
          headers: {
                'Authorization': `Bearer ${token}`, // Přidání tokenu do hlavičky
                'Content-Type': 'application/json' // Pokud je potřeba, můžete přidat i další hlavičky
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
<style>

.container{
  display: flex;
  flex-direction: column;
  gap: 50px;
}


</style>
