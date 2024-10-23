<template>
  <v-container>
    <h2 class="text-h2 mb-4">Edit duel for episode {{ episodeTitle }}</h2>

    <v-form @submit.prevent="submitForm">
      <v-row v-for="(guest, index) in duel.guests" :key="index" class="mb-4">
        <v-col cols="12">
          <v-card class="pa-3" elevation="1">
            <v-row class="d-flex align-center mb-2" style="background-color: #f5f5f5; border-radius: 5px;">
              <v-col cols="auto">
                <h3 class="ma-0">Guest {{ index + 1 }}</h3>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto">
                <v-btn icon @click="deleteGuest(index, guest.id)" color="red">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="guest.name" label="Name" required />
              </v-col>

              <v-col cols="12" sm="6">
                <v-file-input label="Image" @change="onFileChange($event, index)" show-size accept="image/*" />
              </v-col>

              <v-col cols="12" sm="6" v-if="guest.imageUrl">
                <v-img :src="`${apiBaseUrl}/uploads/${guest.imageUrl}`" height="120" contain class="my-2" />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="d-flex justify-start">
        <v-col cols="auto">
          <v-btn @click.prevent="addGuest" :disabled="duel.guests.length >= 5" color="primary" class="mr-2">
            <v-icon left>mdi-plus</v-icon>
            Add Guest
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="d-flex justify-end mt-4">
        <v-col cols="auto">
          <v-btn type="submit" color="success">
            Save
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>import { API_BASE_URL } from '@/config';

export default {
  data() {
    return {
      episodeTitle: '',
      duel: {
        guests: [
          { id: null, name: '', imageFile: null, imageUrl: null },
          { id: null, name: '', imageFile: null, imageUrl: null },
        ],
      },
    };
  },
  computed: {
    episodeId() {
      return this.$route.params.id;
    },
    apiBaseUrl() {
      return API_BASE_URL;
    }
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
    async fetchDuelData() {
      try {
        const response = await fetch(`${API_BASE_URL}/episodes/${this.episodeId}/duel`);
        if (response.ok) {
          const duelData = await response.json();
          this.duel.guests = duelData.guests.map(guest => ({
            id: guest.id,
            name: guest.name,
            imageFile: null,
            imageUrl: guest.imageUrl,
          }));
        } else {
          console.error('Failed to fetch duel data.');
        }
      } catch (error) {
        console.error('Error fetching duel data:', error);
      }
    },
    onFileChange(event, index) {
      const file = event.target.files[0];
      this.duel.guests[index].imageFile = file;
    },
    addGuest() {
      if (this.duel.guests.length < 5) {
        this.duel.guests.push({ id: null, name: '', imageFile: null, imageUrl: null });
      }
    },
    async deleteGuest(index, guestId) {
      if (guestId) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/guests/${guestId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            alert(`Guest ${index + 1} deleted successfully!`);
            this.duel.guests.splice(index, 1);
          } else {
            alert('Failed to delete guest.');
          }
        } catch (error) {
          console.error('Error deleting guest:', error);
        }
      } else {
        this.duel.guests.splice(index, 1);
      }
    },
    async submitForm() {
      const formData = new FormData();
      const guestsData = this.duel.guests.map(guest => ({
        id: guest.id,
        name: guest.name,
      }));

      formData.append('guests', JSON.stringify(guestsData));

      this.duel.guests.forEach((guest, index) => {
        if (guest.imageFile) {
          formData.append(`guestImage_${index}`, guest.imageFile);
        }
      });

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/episodes/${this.episodeId}/duel`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        if (response.ok) {
          alert('Duel updated successfully!');
          window.location.reload();
        } else {
          alert('Failed to update duel.');
        }
      } catch (error) {
        console.error('Error updating duel:', error);
      }
    }
  },
  async mounted() {
    await this.fetchEpisodeTitle(); 
    await this.fetchDuelData();
  },
};

</script>

<style scoped>
.host-img {
  max-width: 100%;
}
</style>
