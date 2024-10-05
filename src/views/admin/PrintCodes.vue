<template>
  <div>
    <div class="qr-codes">
      <div v-for="(code, index) in qrCodes" :key="index" class="qr-code-container">
        <p class="counter">{{ index + 1 }}.</p>
        <qrcode-vue :value="generateUrl(code)" :size="128" class="qrcode"></qrcode-vue>
        <p class="hash">KÓD: {{ code }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'vue-qrcode';
import { API_BASE_URL } from '@/config';

export default {
  components: {
    QrcodeVue,
  },
  data() {
    return {
      qrCodes: [],
    };
  },
  async created() {
    await this.fetchCodes();
  },
  methods: {
    async fetchCodes() {
      const token = localStorage.getItem('token');

      const episodeId = this.$route.params.id; // Získání episodeId z URL
      try {
        const response = await fetch(`${API_BASE_URL}/get-codes/${episodeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Přidejte token do hlavičky
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.qrCodes = data.codes; // Předpokládáme, že data obsahují pole kódů
      } catch (error) {
        console.error('Error fetching codes:', error);
      }
    },
    generateUrl(code) {
      const episodeId = this.$route.params.id; // Získání episodeId z URL
      return `https://hlasovani.polemika.cz/hlasovanilocal/${episodeId}/${code}`;
    },
    printCodes() {
      window.print(); // Otevře dialog pro tisk
    },
  },
};
</script>

<style>
.qr-codes {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 30px;
  font-family: 'Roboto', sans-serif;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  page-break-inside: avoid;
  /* Vyhnout se rozdělení stránek uvnitř elementu */
}

.counter {
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
}

.hash {
  margin-top: 10px;
  text-align: center;
  color: black;
}
</style>