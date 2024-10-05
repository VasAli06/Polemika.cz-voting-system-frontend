<script>
import { API_BASE_URL } from '@/config';

export default {
  data() {
    return {
      duel: {
        guests: [
          { name: '',  imageFile: null, imageUrl: null },
          { name: '',  imageFile: null, imageUrl: null },
        ],
      },
    };
  },
  computed: {
    episodeId() {
      return this.$route.params.id;
    },
  },
  methods: {
    async fetchDuelData() {
  try {
    const response = await fetch(`${API_BASE_URL}/episodes/${this.episodeId}/duel`);
    if (response.ok) {
      const duelData = await response.json();
      console.log('Fetched Duel Data:', duelData); // Loguje odpověď z API
      this.duel.guests = duelData.guests.map(guest => ({
        name: guest.name,
        imageFile: null, // Ponecháme null, dokud není nahrán nový obrázek
        imageUrl: guest.imageUrl, // URL existujícího obrázku
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
        this.duel.guests.push({ name: '', percentage: 0, imageFile: null, imageUrl: null });
      }
    },
    removeGuest() {
      if (this.duel.guests.length > 2) {
        this.duel.guests.pop();
      }
    },
    async submitForm() {
      const formData = new FormData();

      // Připravíme pole hostů
      const guestsData = this.duel.guests.map(guest => ({
        name: guest.name,
        percentage: guest.percentage,
      }));

      // Přidáme hosty jako JSON string do formData
      formData.append('guests', JSON.stringify(guestsData));

      // Přidáme obrázky pro jednotlivé hosty
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
                'Authorization': `Bearer ${token}`, // Přidání tokenu do hlavičky
            },
          body: formData,
        });
        if (response.ok) {
          alert('Duel updated successfully!');
        } else {
          alert('Failed to update duel.');
        }
      } catch (error) {
        console.error('Error updating duel:', error);
      }
    }
  },
  async mounted() {
    await this.fetchDuelData(); // Načteme data při načtení komponenty
  },
};
</script>

<template>
  <div>
    <h2>Edit Duel for Episode {{ episodeId }}</h2>
    
    <form @submit.prevent="submitForm">
      <div v-for="(guest, index) in duel.guests" :key="index">
        <h3>Guest {{ index + 1 }}</h3>
        <div>
          <label for="name">Name:</label>
          <input type="text" v-model="guest.name" required />
        </div>
        <div>
          <label for="image">Image:</label>
          <input type="file" @change="onFileChange($event, index)" />
          <div v-if="guest.imageUrl">
            <p>Current Image:       {{ guest.imageUrl }}</p>
                      <img :src="`${API_BASE_URL}` + `/uploads/` + guest.imageUrl" alt="" class="host-img" />

          </div>
        </div>
      </div>

      <button type="button" @click="addGuest" :disabled="duel.guests.length >= 5">Add Guest</button>
      <button type="button" @click="removeGuest" :disabled="duel.guests.length <= 2">Remove Guest</button>
      <button type="submit">Save</button>
    </form>
  </div>
</template>


