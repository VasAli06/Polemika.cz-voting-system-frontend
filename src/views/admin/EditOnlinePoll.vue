<template>
  <main>
    <h1 class="text-h2 mb-5 mt-10">Hlasování pro Epizodu {{ episodeTitle }}</h1>
    
    <div>
      <v-checkbox v-model="filterVerifiedDuel" label="Zobrazit pouze ověřené hlasy pro duel"></v-checkbox>
      <v-checkbox v-model="filterVerifiedQuestion" label="Zobrazit pouze ověřené hlasy pro otázku"></v-checkbox>
      <v-btn @click="applyFilters" color="primary">Použít filtry</v-btn>
      <v-btn @click="resetFilters" color="secondary">Resetovat filtry</v-btn>
    </div>

    <div v-if="votes && votes.length" class="table-container">
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Token Duela</th>
            <th>Token Otázky</th>
            <th>Host</th>
            <th>Možnost</th>
            <th>Stav Duela</th>
            <th>Stav Otázky</th>
            <th>Čas Hlasování</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vote in filteredVotes" :key="vote.id">
            <td>
              <div @click="openEmailDialog(vote.email)">
                {{ vote.email }}
              </div>
            </td>
            <td>
              <div @click="openTokenDialog(vote.tokenDuel, 'Token Duela')">
                {{ truncateText(vote.tokenDuel, 10) }}
              </div>
            </td>
            <td>
              <div @click="openTokenDialog(vote.tokenQuestion, 'Token Otázky')">
                {{ truncateText(vote.tokenQuestion, 10) }}
              </div>
            </td>
            <td>{{ vote.guestDuel ? vote.guestDuel.name : 'N/A' }}</td>
            <td>{{ vote.option ? vote.option.text : 'N/A' }}</td>

            <td>{{ vote.verifiedDuel ? 'Dokončeno' : 'Neoveřeno' }}</td>
            <td>{{ vote.verifiedQuestion ? 'Dokončeno' : 'Neoveřeno' }}</td>
            <td>{{ new Date(vote.createdAtDuel).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Načítání dat nebo žádná data k dispozici...</p>
    </div>

    <!-- Dialog pro zobrazení emailu -->
    <v-dialog v-model="dialogEmail" max-width="500">
      <v-card>
        <v-card-title>Email</v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedEmail" label="Email" readonly append-icon="mdi-content-copy"
            @click:append="copyToClipboard(selectedEmail)" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogEmail = false">Zavřít</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog pro zobrazení tokenu -->
    <v-dialog v-model="dialogToken" max-width="500">
      <v-card>
        <v-card-title>{{ tokenType }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedToken" :label="tokenType" readonly append-icon="mdi-content-copy"
            @click:append="copyToClipboard(selectedToken)" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogToken = false">Zavřít</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn @click="downloadEmailsXLSX" color="primary" class="mt-5">Stáhnout emaily (XLSX)</v-btn>

  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { API_BASE_URL } from '@/config';

const votes = ref([]);
const filteredVotes = ref([]);
const route = useRoute();
const token = localStorage.getItem('token');
const episodeTitle = ref('');
// Pro dialogy
const dialogEmail = ref(false);
const dialogToken = ref(false);
const selectedEmail = ref('');
const selectedToken = ref('');
const tokenType = ref('');

// Filtry
const filterVerifiedDuel = ref(false);
const filterVerifiedQuestion = ref(false);

// Vytvoření computed proměnné pro episodeId
const episodeId = computed(() => route.params.id);

const fetchEpisodeTitle = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/episodes/${episodeId.value}/title`);
    if (response.ok) {
      const data = await response.json();
      episodeTitle.value = data.title; // Uložení názvu epizody
    } else {
      console.error('Failed to fetch episode title.');
    }
  } catch (error) {
    console.error('Error fetching episode title:', error);
  }
}

// Zkrácení textu
const truncateText = (text, length) => {
  if (!text) return '';
  return text.length <= length ? text : text.substring(0, length) + '...';
};

// Funkce pro otevření dialogu s emailem
const openEmailDialog = (email) => {
  selectedEmail.value = email;
  dialogEmail.value = true;
};

// Funkce pro otevření dialogu s tokenem
const openTokenDialog = (token, type) => {
  selectedToken.value = token;
  tokenType.value = type;
  dialogToken.value = true;
};

// Funkce pro kopírování textu do schránky
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Text zkopírován!');
  });
};

// Načítání hlasů z API
const fetchVotes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/episodes/${episodeId.value}/votes`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch votes');

    const data = await response.json();
    votes.value = data.length ? data : [];
    filteredVotes.value = [...votes.value]; // Inicializace filtrování
  } catch (error) {
    console.error('Error fetching votes:', error);
    votes.value = [];
  }
};

// Aplikace filtrů
const applyFilters = () => {
  filteredVotes.value = votes.value.filter(vote => {
    const duelCondition = filterVerifiedDuel.value ? vote.verifiedDuel : true;
    const questionCondition = filterVerifiedQuestion.value ? vote.verifiedQuestion : true;
    return duelCondition && questionCondition;
  });
};

// Resetování filtrů
const resetFilters = () => {
  filterVerifiedDuel.value = false;
  filterVerifiedQuestion.value = false;
  filteredVotes.value = [...votes.value]; // Obnovit na všechny hlasy
};

onMounted(() => {
  fetchVotes();
  fetchEpisodeTitle();
});

const downloadEmailsXLSX = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/episodes/${episodeId.value}/votes/emails`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Chyba při stahování souboru');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Vytvoření odkazu pro stažení
    const a = document.createElement('a');
    a.href = url;
    a.download = `votes-emails-${episodeId.value}.xlsx`;
    a.click();

    // Uvolnění URL objektu
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading XLSX:', error);
    alert('Chyba při stahování XLSX souboru');
  }
}
</script>

<style scoped>
.table-container {
  max-height: 400px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
