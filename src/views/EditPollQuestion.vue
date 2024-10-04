<template>
  <div>
    <h2>Edit Poll Question for Episode {{ episodeId }}</h2>
    
    <form @submit.prevent="submitForm">
      <div>
        <label for="question">Poll Question:</label>
        <input type="text" id="question" v-model="pollQuestion.question" required />
      </div>
      <div>
        <label>Options:</label>
        <div v-for="(option, index) in pollQuestion.options" :key="index">
          <input type="text" v-model="pollQuestion.options[index].text" required />
          <button @click.prevent="removeOption(index)">Remove</button>
        </div>
        <button @click.prevent="addOption">Add Option</button>
      </div>
      
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
import { API_BASE_URL } from '../config';

export default {
  data() {
    return {
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
    await this.fetchPollQuestion();
  },
  methods: {
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
