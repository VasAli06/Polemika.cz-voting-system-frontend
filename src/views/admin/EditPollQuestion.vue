<template>
  <v-container>
    <h2 class="text-h2 mb-5">Edit Poll Question for Episode {{ episodeTitle }}</h2>

    <v-form @submit.prevent="submitForm">
      <v-text-field v-model="pollQuestion.question" label="Poll Question" required class="mb-3"></v-text-field>

      <v-divider></v-divider>
      <div v-for="(option, index) in pollQuestion.options" :key="index" class="mt-5">
        <v-row>
          <v-col>
            <v-text-field v-model="pollQuestion.options[index].text" label="Option" required></v-text-field>
          </v-col>
          <v-col>
            <v-btn icon @click.prevent="removeOption(index)" color="red">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-btn @click.prevent="addOption" color="primary" class="mb-5">
        <v-icon left>mdi-plus</v-icon>
        Add Option
      </v-btn>

      <v-divider></v-divider>

      <v-btn type="submit" color="success" class="mt-5">Save</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { API_BASE_URL } from '@/config';

export default {
  data() {
    return {
      episodeTitle: '',
      pollQuestion: {
        question: '',
        options: [{ text: '' }], // Start with one empty option object
      },
    };
  },
  computed: {
    episodeId() {
      return this.$route.params.id;
    }
  },
  async created() {
    await this.fetchEpisodeTitle(); 
    await this.fetchPollQuestion();
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
    async fetchPollQuestion() {
      try {
        const response = await fetch(`${API_BASE_URL}/episodes/${this.episodeId}/poll-question`);
        const data = await response.json();
        this.pollQuestion = {
          question: data.pollQuestion.question,
          options: data.pollQuestion.options.map(option => ({ text: option.text })),
        };
      } catch (error) {
        console.error('Error fetching poll question:', error);
      }
    },
    addOption() {
      this.pollQuestion.options.push({ text: '' }); // Add a new empty option object
    },
    removeOption(index) {
      this.pollQuestion.options.splice(index, 1); // Remove the option at the specified index
    },
    async submitForm() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/episodes/${this.episodeId}/poll-question`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`, // Přidání tokenu do hlavičky
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: this.pollQuestion.question,
            options: this.pollQuestion.options.map(option => option.text), // Převeď objekty na řetězce
          }),
        });
        if (response.ok) {
          alert('Poll question updated successfully!');
        } else {
          alert('Failed to update poll question.');
        }
      } catch (error) {
        console.error('Error updating poll question:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Přidání stylů, pokud je potřeba */
</style>
