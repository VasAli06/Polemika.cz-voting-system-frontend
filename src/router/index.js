import { createRouter, createWebHistory } from 'vue-router';
import LocalPollResults from '../views/LocalPollResults.vue';
import LocalPollInput from '../views/LocalPollInput.vue';
import Online from '../views/Online.vue'; 
import OnlineVoteCheckDuel from '../views/OnlineVoteCheckDuel.vue'; 
import OnlineVoteCheckQuestion from '../views/OnlineVoteCheckQuestion.vue'; 
import OnlineVoteSent from '../views/OnlineVoteSent.vue'; 


import HomeView from '../views/HomeView.vue'; 






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
      name: 'online',
      component: Online
    },
    {
      path: '/odeslan', 
      name: 'sentvote',
      component: OnlineVoteSent

    },

    {
      path: '/', 
      name: 'home',
      component: HomeView
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

    
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
});

export default router;
