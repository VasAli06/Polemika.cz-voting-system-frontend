<template>

    <h1>Váš hlas ještě <span>NEBYL</span> započten!</h1>
    <p class="text">Pro dokončení hlasování navštivte Vaši emailovou schránku, do které jsme vám zaslali potvrzovací email.
    </p>

    <article class="workflow">
        <section>
            <i class="fa-solid fa-envelope"></i>
            <p>Otevřete svoji emailovou schránku</p>
        </section>
        <img src="/arrow2.png" alt="">

        <section>
            <i class="fa-solid fa-inbox"></i>
            <p>Najděte email s předmětem “Potvrzení Hlasu”</p>
        </section>
        <img src="/arrow.png" alt="">
        <section>
            <i class="fa-solid fa-check"></i>
            <p>Klikněte na tlačítko “Potvrdit hlas”</p>
        </section>
    </article>

    <article class="support">

        <hr>
        <p class="text">Pokud se naskytl jakýkoliv problém neváhajte nás ihned kontaktovat.</p>
        <p class="email">naxera@polemika.cz</p>
    </article>
</template>

<script></script>

<style lang="scss" scoped>
@use "@/assets/colors.scss" as *;

h1 {
    text-align: center;
    font-size: 60px;
    margin-top: 50px;

    @media(max-width:750px) {
        font-size: 30px;
    }

    span {
        color: red;
    }
}

.workflow {
    margin-top: 100px;
    margin-bottom: 100px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
    text-align: center;

    @media(max-width:750px) {
        margin-top: 50px;
        margin-bottom: 50px;
        gap: 20px;
    }

    section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        font-size: 30px;

        @media(max-width:750px) {
            font-size: 20px;
        }

        @media(max-width:500px) {
            font-size: 15px;
        }

        i {
            color: $primary-color;
        }

    }

    img {
        @media(max-width:750px) {
            max-height: 100px;
        }

    }
}

.support {
    display: flex;
    flex-direction: column;
    align-items: center;

    .email {
        text-align: center;
        border: 3px solid $primary-color;
        padding: 15px;
        margin-top: 20px;
        font-size: 20px;
        border-radius: 100px;

        @media(max-width:750px) {
            font-size: 15px;

        }
    }

    hr {
        width: 80%;
        border: white 3px solid;

        @media(max-width:750px) {
            border: white 2px solid;

        }
    }
}

.text {
    text-align: center;
    font-size: 25px;
    margin-top: 30px;

    @media(max-width:750px) {
        font-size: 20px;
    }

    @media(max-width:500px) {
        font-size: 15px;
    }
}
</style>