<script setup>
import { RouterView } from 'vue-router'


</script>

<template>
  <header>
    <Router-link to="/"> <i class="fa-solid fa-house"></i></Router-link>

    <h1>Hlasovací systém <div class="logo_wraper">
        <div class="black"></div>
        <h2>Polemika<span>?</span></h2>
        <img src="/head.svg" alt="hlava Polemika">
      </div>
    </h1>



  </header>

  <RouterView />


  <footer>


    <article class="logo_container">
      <div class="logo_wraper">
        <div class="black"></div>
        <h2>Polemika<span>!</span></h2>
        <img src="/head.svg" alt="hlava Polemika">
      </div>
    </article>

    <article class="social_and_partners">

      <section class="social">
        <a href="https://www.youtube.com/channel/UCEgbdConitjQsGVflcLhCmg"><i class="fa-brands fa-youtube"></i></a>
        <a href="https://www.instagram.com/polemika.cz/"><i class="fa-brands fa-instagram"></i></a>

        <a href="https://www.facebook.com/people/Polemikacz/61555003615688/"><i class="fa-brands fa-facebook"></i></a>
      </section>

      <section class="logos">
        <a href="https://www.nextzone.io/"> <img src="/nextzone_logo.png" class="nextzone" alt="logo NextZone"></a>
        <a href="https://snempraha.cz/"> <img class="snem" src="/logosnem.png"
            alt=" logo Středoškolského Sněmu Prahy"></a>
        <a href="https://www.ssps.cz/"> <img src="/ssps_logo.png" class="ssps"
            alt="Logo Smíchovské střední průmyslové školy"></a>
      </section>


    </article>

  </footer>
</template>

<style lang="scss">
@use "@/assets/colors.scss" as *;

header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-top: 30px;
  padding-bottom: 30px;
  position: relative;
  border-bottom: 4px solid $primary-color;

  @media(max-width:500px) {
    padding: 10px;
    padding-bottom: 15px;
    padding-top: 15px;
  }

  a {
    position: absolute;
    left: 20px;
    font-size: 20px;
    background-color: $primary-color;
    padding: 15px;
    border-radius: 1000px;
    transition: 0.4s ease;
    color: white;

    @media(max-width:800px) {
      font-size: 15px;
      padding: 10px;
    }

    @media(max-width:500px) {
      font-size: 10px;
      left: 5px;
      padding: 5px;
    }

    &:hover {
      transition: 0.4s ease;
      transform: scale(105%);
      cursor: pointer;
    }
  }

  h1 {

    font-size: 40px;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;

    @media(max-width:800px) {
      font-size: 30px;
    }

    @media(max-width:600px) {
      font-size: 25px;
      gap: 7px;
    }

    @media(max-width:500px) {
      font-size: 18px;
      gap: 5px;
    }

    .logo_wraper {
      position: relative;

      h2 {
        font-size: 40px;

        @media(max-width:800px) {
          font-size: 30px;
        }

        @media(max-width:600px) {
          font-size: 25px;
        }

        @media(max-width:500px) {
          font-size: 18px;
        }

        //  @include var.respond-above("sm") {
        //  font-size: 55px;
        //}
      }

      span {
        color: $accent-color;
      }

      img {
        position: absolute;


        width: 13px;
        right: 78px;
        top: 7px;

        @media(max-width:800px) {
          position: absolute;
          width: 10px;
          right: 59px;
          top: 5px;
        }

        @media(max-width:600px) {
          width: 10px;
          right: 48px;
          top: 1px;

        }

        @media(max-width:500px) {

          position: absolute;
          width: 8px;
          right: 34px;
          top: 2px;
        }
      }

      .black {
        position: absolute;
        background-color: black;
        width: 15px;
        height: 15px;
        right: 78px;
        top: 5px;

        @media(max-width:800px) {
          right: 61px;
          width: 10px;
          height: 10px;
        }

        @media(max-width:600px) {
          right: 51px;
          width: 6px;
          height: 8px;
          top: 4px;
        }

        @media(max-width:500px) {

          right: 36px;
          width: 6px;
          height: 8px;
          top: 2px;

        }

      }

    }

  }
}

@font-face {
  font-family: Dashboard;
  src: url(/Dashboard-Regular.ttf);
}

body {
  min-height: 100vh;
  line-height: 1;
  font-family: Dashboard;
  transition: 1s ease;
  background-color: #000000;
  color: white;
}

#app {
  height: 100%;
}


footer {
  padding-top: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 90px;

  .social {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;

    @media(max-width:954px) {
      align-self: baseline;
    }

    a {
      text-decoration: none;
      color: white;
      font-size: 50px;
      transition: 0.5s ease;

      @media(max-width:500px) {
        font-size: 40px;
      }

      &:hover {
        transition: 0.5s ease;
        color: $primary-color;
      }
    }

  }

  .social_and_partners {
    display: flex;
    flex-direction: row;
    width: 76%;
    gap: 40px;
    justify-content: space-between;
    align-items: center;

    @media(max-width:954px) {

      width: auto;
      gap: 92px;
    }

    @media(max-width:500px) {
      gap: 60px;
    }

    .logos {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      @media(max-width:900px) {
        flex-direction: column;
        align-items: flex-start;
      }

    }

    .ssps {
      width: 300px;

      @media(max-width:900px) {
        width: 250px;

      }

      @media(max-width:500px) {
        width: 200px;
      }

    }

    .nextzone {
      width: 200px;

      @media(max-width:900px) {
        width: 150px;

      }

      @media(max-width:500px) {
        width: 100px;
      }

    }

    .snem {
      width: 200px;

      @media(max-width:900px) {
        width: 150px;

      }

      @media(max-width:500px) {
        width: 100px;
      }

    }
  }



  .logo_container {
    display: flex;
    width: 76%;
    padding-bottom: 16px;


    @media(max-width:900px) {

      width: auto;
      justify-content: center;
    }



    .logo_wraper {
      position: relative;

      h2 {
        font-size: 70px;

        @media(max-width:600px) {
          font-size: 55px;
        }

      }

      span {
        color: $primary-color;
      }

      img {
        position: absolute;
        width: 25px;
        right: 30%;
        top: 7%;

      }

      .black {
        position: absolute;
        background-color: black;
        width: 18px;
        height: 19px;
        right: 32%;
        top: 10%;
      }

    }
  }
}
</style>
