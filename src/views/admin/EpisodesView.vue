<template>
  <article>
    <div class="menu-contaner" v-if="!isPrintPage">
      <h1>Episodes</h1>
      <button @click="fetchEpisodes">Reload Episodes</button>
      <button @click="showAddEpisodeForm = true">Add Episode</button>

      <div v-if="showAddEpisodeForm">
        <input v-model="newEpisodeTitle" placeholder="Enter episode title" />
        <button @click="addEpisode">Save Episode</button>
      </div>

      <ul>
        <li v-for="episode in episodes" :key="episode.id">
          <!-- Link na podstránku s detaily epizody -->
          <router-link :to="{ name: 'EpisodeDetail', params: { id: episode.id } }">
            {{ episode.title }}
          </router-link>
     <!---   <button @click="deleteEpisode(episode.id)">Delete</button>-->  
        </li>
      </ul>
    </div>

    <router-view></router-view>
  </article>
</template>

<script>
import { API_BASE_URL } from '@/config';

export default {
  data() {
    return {
      episodes: [],
      newEpisodeTitle: '',
      showAddEpisodeForm: false,
    };
  },
  computed: {
    isPrintPage() {
      return this.$route.name === 'PrintCodes'; // Zkontroluj, jestli je to stránka pro tisk
    }
  },
  methods: {
    async fetchEpisodes() {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_BASE_URL}/episodes`,{
          method: 'GET', // Nastavení metody, i když je to výchozí
            headers: {
                'Authorization': `Bearer ${token}`, // Přidání tokenu do hlavičky
                'Content-Type': 'application/json' // Pokud je potřeba, můžete přidat i další hlavičky
            }
        });
        const data = await response.json();
        this.episodes = data;
        console.log(data);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    },
    async addEpisode() {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_BASE_URL}/episodes`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`, // Přidání tokenu do hlavičky
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: this.newEpisodeTitle }),
        });
        const newEpisode = await response.json();
        this.episodes.push(newEpisode);
        this.newEpisodeTitle = '';
        this.showAddEpisodeForm = false;
      } catch (error) {
        console.error('Error adding episode:', error);
      }
    },
    async deleteEpisode(id) {
      const token = localStorage.getItem('token');


      try {
        await fetch(`${API_BASE_URL}/episodes/${id}`, {
          method: 'DELETE', headers: {
            'Authorization': `Bearer ${token}`, // Přidání tokenu do hlavičky
            'Content-Type': 'application/json' // Pokud je potřeba, můžete přidat i další hlavičky
          }
        });
        this.episodes = this.episodes.filter((episode) => episode.id !== id);
      } catch (error) {
        console.error('Error deleting episode:', error);
      }
    },
  },
  mounted() {
    this.fetchEpisodes();
  },
};
</script>

<style lang="scss" scoped>
article {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.menu-contaner {
  padding: 50px;
  color: white;
  background-color: white;
  height: 100vh;
  padding-top: 100px;

  ul {
    background-color: white;
    color: black;

    a {
      color: black;
    }
  }
}

div {
  padding: 50px;
}
</style>
