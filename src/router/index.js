import { createRouter, createWebHistory } from 'vue-router';
import LocalPollResults from '../views/LocalPollResults.vue';
import LocalPollInput from '../views/LocalPollInput.vue';
import EpisodesView from '../views/EpisodesView.vue'; // Seznam epizod
import EpisodeDetail from '../views/EpisodeDetail.vue'; // Detail epizody
import EditLocalPoll from '../views/EditLocalPoll.vue'; // Editace Local Pollu
import EditOnlinePoll from '../views/EditOnlinePoll.vue'; // Editace Online Pollu
import EditDuel from '../views/EditDuel.vue'; // Editace Duelu
import EditPollQuestion from '../views/EditPollQuestion.vue'; // Editace Poll Question
import PrintCodes from '../views/PrintCodes.vue'; // Tisk kódů
import Login from '../views/Login.vue'; // Přihlášení

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/localhlasovani/vysledky/:id?',
      name: 'results',
      component: LocalPollResults
    },
    {
      path: '/hlasovanilocal/:id?/:code?', // Cesta pro home s parametrem id, '?' znamená, že parametr je volitelný
      name: 'home',
      component: LocalPollInput
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin',
      component: EpisodesView,  // Hlavní layout admin rozhraní
      beforeEnter: async (to, from, next) => {
        const token = localStorage.getItem('token'); // Získání tokenu
        if (token) {
          try {
            // Ověření tokenu
            const response = await fetch('/api/validate-token', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            if (response.ok) {
              // Token je platný, pokračujte na admin
              next();
            } else {
              // Token není platný, přesměrování na login
              localStorage.removeItem('token'); // Odstranění tokenu z localStorage
              next({ path: '/login' });
            }
          } catch (error) {
            console.error('Token validation error:', error);
            // V případě chyby (např. síťové problémy) přesměrování na login
            localStorage.removeItem('token'); // Odstranění tokenu z localStorage
            next({ path: '/login' });
          }
        } else {
          next({ path: '/login' }); // Jinak přesměrujte na login
        }
      },
      children: [
        {
          path: 'episodes/:id', // /admin/episodes/:id
          name: 'EpisodeDetail',
          component: EpisodeDetail,
        },
        {
          path: 'episodes/:id/edit-local-poll', // /admin/episodes/:id/edit-local-poll
          name: 'EditLocalPoll',
          component: EditLocalPoll,
        },
        {
          path: 'episodes/:id/edit-online-poll', // /admin/episodes/:id/edit-online-poll
          name: 'EditOnlinePoll',
          component: EditOnlinePoll,
        },
        {
          path: 'episodes/:id/edit-duel', // /admin/episodes/:id/edit-duel
          name: 'EditDuel',
          component: EditDuel,
        },
        {
          path: 'episodes/:id/edit-poll-question', // /admin/episodes/:id/edit-poll-question
          name: 'EditPollQuestion',
          component: EditPollQuestion,
        },
        {
          path: 'episodes/:id/print-codes', // /admin/episodes/:id/print-codes
          name: 'PrintCodes',
          component: PrintCodes,
        }
      ],
    }
  ]
});

export default router;
