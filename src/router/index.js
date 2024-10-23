import { createRouter, createWebHistory } from 'vue-router';
import LocalPollResults from '../views/LocalPollResults.vue';
import LocalPollInput from '../views/LocalPollInput.vue';
import Login from '../views/Login.vue'; 
import Online from '../views/Online.vue'; 
import OnlineVoteCheckDuel from '../views/OnlineVoteCheckDuel.vue'; 
import OnlineVoteCheckQuestion from '../views/OnlineVoteCheckQuestion.vue'; 


import EpisodesView from '../views/admin/EpisodesView.vue'; 
import EpisodeDetail from '../views/admin/EpisodeDetail.vue'; 
import EditLocalPoll from '../views/admin/EditLocalPoll.vue'; 
import EditOnlinePoll from '../views/admin/EditOnlinePoll.vue'; 
import EditDuel from '../views/admin/EditDuel.vue';
import EditPollQuestion from '../views/admin/EditPollQuestion.vue'; 
import PrintCodes from '../views/admin/PrintCodes.vue'; 



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/localhlasovani/vysledky/:id?',
      name: 'results',
      component: LocalPollResults
    },
    {
      path: '/hlasovanilocal/:id?/:code?', 
      name: 'vote',
      component: LocalPollInput
    },
    {
      path: '/online/:id?', 
      name: 'home',
      component: Online
    },
    {
      path: '/overeni-hlasovani-duelu/:token?/:episodeId?', 
      name: 'vote-check-duel',
      component: OnlineVoteCheckDuel
    },
    {
      path: '/overeni-hlasovani-otazky/:token?/:episodeId?', 
      name: 'vote-check-questin',
      component: OnlineVoteCheckQuestion
    },

    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin',
      component: EpisodesView,  
      beforeEnter: async (to, from, next) => {
        const token = localStorage.getItem('token'); 
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
