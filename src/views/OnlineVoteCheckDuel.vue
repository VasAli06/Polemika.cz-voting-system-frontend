<template>
  <div>
    <article class="error" v-if="error" >
      <section>
        <h1>Váš hlas byl již započten.</h1>
      </section>

      <p>Nejspíše jste již v této epizodě hlasovali, či odkaz v zasleném emailu již není platný. Zkuste proces hlasování
        opakovat znovu.
      </p>
      <hr>
      <p>Pokud si myslíte, že v hlasovacím systému je chyba obraťte se na emilovou adresu níže.</p>
      <a class="email" href="mailto:naxera@polemika.cz">naxera@polemika.cz</a>

      <hr>
      <router-link to="/" class="email">Zpět na hlavní stránku</router-link>
    </article>
    <article class="success" v-if="message">
      <section>
        <h1>Hlasování bylo úspěšně dokončeno</h1>
      </section>

      <p>Děkujeme, že jste se účastnili hlasování. Pomocí tlačítka pod výsledky níže se můžete vrátit zpět ke všem dílům Polemiky.
      </p>

      <GuestesResult></GuestesResult>
      <hr>
  
      <p>Pokud se naskytl jakýkoliv problém neváhajte nás ihned kontaktovat</p>
      <a class="email" href="mailto:naxera@polemika.cz">naxera@polemika.cz</a>

 

      <router-link to="/" class="email">Zpět na hlavní stránku</router-link>
    </article>
  </div>
</template>

<script>
import { API_BASE_URL } from '@/config';
import GuestesResult from '@/components/Online/GuestesResult.vue';

export default {
  data() {
    return {
      loading: false,
      message: '',
      error: ''
    };
  },
  mounted() {
    this.verifyVote();
  },
  components:{
    GuestesResult
  },
  methods: {
    async verifyVote() {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const episodeId = urlParams.get('episodeId');

      this.loading = true;

      try {
        const response = await fetch(`${API_BASE_URL}/verify-vote-duel?token=${token}&episodeId=${episodeId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Něco se pokazilo.');
        }

        this.message = data.message;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@use "@/assets/colors.scss" as *;

.error {

  margin-top: 150px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;

  @media(max-width:750px) {
    margin-top: 75px;
    gap: 30px;
  }

  hr {
    width: 80%;
    border: white 3px solid;
  }

  p {
    font-size: 25px;
    width: 80%;

    @media(max-width:750px) {
      font-size: 15px;
    }

  }

  section {
    background-color: red;
    width: 80%;

    h1 {
      font-size: 60px;
      padding-top: 30px;
      padding-bottom: 30px;

      @media(max-width:750px) {
        font-size: 30px;
      }

    }
  }

  .email {
    text-align: center;
    border: 3px solid $primary-color;
    padding: 15px;
    margin-top: 20px;
    font-size: 20px;
    border-radius: 100px;
    color: white;
    text-decoration: none;

    @media(max-width:750px) {
      font-size: 15px;

    }
  }
}

.success {
  margin-top: 150px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  @media(max-width:750px) {
    margin-top: 75px;
    gap: 30px;
  }
  hr {
    width: 80%;
    border: white 3px solid;
  }

  p {
    font-size: 25px;
    width: 80%;
    @media(max-width:750px) {
      font-size: 15px;
    }
  }

  .email {
    text-align: center;
    border: 3px solid $primary-color;
    padding: 15px;
    margin-top: 20px;
    font-size: 20px;
    border-radius: 100px;
    color: white;
    text-decoration: none;
    @media(max-width:750px) {
      font-size: 15px;

    }
  }

  section {
    background-color: #029837;
    width: 80%;

    h1 {
      font-size: 60px;
      padding-top: 30px;
      padding-bottom: 30px;
      @media(max-width:750px) {
        font-size: 30px;
      }
    }
  }
}
</style>