<template>
  <v-app>
    <!-- Horní app bar s hamburger menu pro menší zařízení -->
    <v-app-bar app v-if="this.$route.name !== 'PrintCodes'"> 
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title> Polemika hlasovací systém</v-toolbar-title>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app v-if="this.$route.name !== 'PrintCodes'">
      <v-list>
        <v-list-item-group v-model="activeEpisodeId" color="primary">
          <v-list-item
            v-for="episode in episodes"
            :key="episode.id"
            @click="goToEpisodeDetail(episode.id)"
            :value="episode.id"
          >
            <v-list-item-content>
              <v-list-item-title>{{ episode.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <!-- Tlačítko pro přidání epizody, vycentrované -->
      <v-row justify="center" class="mt-6">
        <v-btn @click="showAddEpisodeDialog = true" color="success">
          Add Episode
        </v-btn>
      </v-row>
    </v-navigation-drawer>

    <!-- Hlavní obsah -->
    <v-main>
      <v-container>
        <template v-if="activeEpisodeId">
          <router-view></router-view>
        </template>
        <template v-else>
          <v-alert type="info" dismissible>
            Žádná epizoda není vybrána. Prosím, vyberte epizodu z menu na levé straně.
          </v-alert>
        </template>
      </v-container>
    </v-main>

    <!-- Dialog pro přidání nové epizody -->
    <v-dialog v-model="showAddEpisodeDialog" max-width="500" >
      <v-card>
        <v-card-title>
          <span class="headline">Add New Episode</span>
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="newEpisodeTitle"
            label="Enter episode title"
            outlined
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="addEpisode">Save Episode</v-btn>
          <v-btn color="secondary" @click="showAddEpisodeDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { API_BASE_URL } from '@/config';

export default {
  data() {
    return {
      episodes: [],
      newEpisodeTitle: '',
      showAddEpisodeDialog: false,
      activeEpisodeId: null,
      drawer: true, // Stav pro zobrazení/skrytí navigation drawer
    };
  },
  methods: {
    async fetchEpisodes() {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_BASE_URL}/episodes`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        this.episodes = data;
        console.log( this.episodes)
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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: this.newEpisodeTitle })
        });
        const newEpisode = await response.json();
        this.episodes.push(newEpisode);
        this.newEpisodeTitle = '';
        this.showAddEpisodeDialog = false;
      } catch (error) {
        console.error('Error adding episode:', error);
      }
    },
    goToEpisodeDetail(id) {
      this.activeEpisodeId = id;
      this.$router.push({ name: 'EpisodeDetail', params: { id } });
    }
  },
  mounted() {
    this.fetchEpisodes();
    this.activeEpisodeId = this.$route.params.id;
  },
  watch: {
    '$route.params.id'(newId) {
      this.activeEpisodeId = newId;
    }
  }
};
</script>

<style scoped>
.v-navigation-drawer {
  width: 300px;
}
</style>
