<template>

  <h2>Vítejte<span>!</span></h2>

  <p class="action-text">Vyberte si v jaké debatě chcete hlasovat. </p>
  <hr>
  <article class="all-episodes">
    <section class="wrapper">
      <div v-for="episode in episodes" :key="episode.id">

        <router-link :to="{ name: 'online', params: { id: episode.id } }">
          <p>{{ episode.title }}</p>

          <img :src="apiBaseUrl + '/uploads/' + episode.imageUrl" alt="">
        </router-link>

      </div>
    </section>
  </article>

  <hr>

  <article class="info">
    <span class="desing">?</span>

    <h2>K čemu tento portál slouží<span>?</span></h2>

    <section>

      <p>Na tomto webu Vám nabízíme příležitost vyjádřit Váš názor stejně jako to mohou dělat diváci na živém natáčení
        pořadu Polemika!</p>
      <p> Ke každé akci, kterou pořádáme bývají zpravidla dva typy interakcí: Duely a Ankety.</p>

      <p> Ankteta obsahuje nějakou tezi, která je spjatá s tématem debaty a nabídku různých odpovědí.</p>
      <p> V duelu můžete hlasovat pro hosta, se kterým více sympatizujete.</p>


    </section>




  </article>

  <article class="technical">
      <p>Technické problémy můžete hlásit na:</p>
      <a class="email" href="mailto:naxera@polemika.cz">naxera@polemika.cz</a>

  </article>
</template>
<style lang="scss" scoped>
@use "@/assets/colors.scss" as *;


.technical{
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 150px;
  margin-top: 100px;

  @media(max-width:600px) {
    margin-bottom: 50px;
    margin-top: 50px;
  }

  @media(max-width:500px) {
    gap: 20px;
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
.info {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 150px;
  margin-top: 100px;

  @media(max-width:600px) {
    margin-bottom: 50px;
    margin-top: 50px;
  }

  @media(max-width:500px) {
    gap: 20px;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 40px;
    justify-content: center;
    align-items: center;

    p {
      text-align: center;

      @media(max-width:500px) {
        width: 80%;
      }

    }

    @media(max-width:500px) {
      gap: 20px;
    }

  }

  h2 {


    span {
      color: $primary-color;

    }
  }

  .desing {
    position: absolute;
    font-size: 700px;
    left: -100px;
    z-index: -1;
    top: -200px;
    color: $accent-color;
    transform: rotate(10deg);

    @media(max-width:970px) {
      font-size: 500px;
    }

    @media(max-width:600px) {
      font-size: 400px;
      top: -100px;
    }

  }

  p {
    font-size: 25px;

    @media(max-width:970px) {
      font-size: 20px;
    }

    @media(max-width:500px) {
      font-size: 15px;
    }

  }
}

h2 {
  text-align: center;
  font-size: 100px;
  padding-top: 50px;

  span {
    color: $accent-color;
  }

  @media(max-width:970px) {
    font-size: 50px;
  }

  @media(max-width:500px) {
    font-size: 40px;
  }

}

.action-text {
  font-size: 25px;
  text-align: center;
  padding-top: 40px;
  padding-bottom: 40px;

  @media(max-width:500px) {
    font-size: 18px;
    padding-top: 20px;
    padding-bottom: 20px;

  }
}

hr {
  width: 80%;
}

.all-episodes {
  padding-top: 40px;
  padding-bottom: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .wrapper {
    width: 80%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 80px;

    @media (max-width: 954px) {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }

    @media (max-width: 390px) {
      grid-template-columns: minmax(0, 1fr);
    }

    @media (max-width: 600px) {
      gap: 30px;
    }

    div {
      width: 100%;
      transition: 0.4s ease;

      &:hover {
        transition: 0.4s ease;
        transform: scale(105%);
      }

      img {
        width: 100%;
        border: 3px solid white;
        object-fit: cover;
        border-radius: 10px;

        @media (max-width: 600px) {
          height: 100px;

        }

        @media (max-width: 390px) {
          width: 60%;
        }

      }

      a {
        text-decoration: none;
        color: white;
        text-align: center;
        font-size: 25px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        gap: 20px;

        @media (max-width: 500px) {
          font-size: 20px;
        }
      }
    }
  }
}
</style>

<script>
import { ref, onMounted, computed } from 'vue';
import { API_BASE_URL } from '@/config'; // Importuje konfiguraci pro API

export default {
  setup() {
    const episodes = ref([]); // Ref pro uložení epizod
    const apiBaseUrl = computed(() => API_BASE_URL); // Použití computed pro API Base URL

    const fetchEpisodes = async () => {
      try {
        const response = await fetch(`${apiBaseUrl.value}/episodes`); // Použití computed hodnoty
        const data = await response.json();
        episodes.value = data.sort((a, b) => b.id - a.id);

        console.log(data);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    };

    onMounted(fetchEpisodes); // Načte epizody při montování komponenty

    return {
      episodes,
      apiBaseUrl,
    };
  },
};
</script>