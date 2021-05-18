import { createRouter, createWebHistory } from 'vue-router';
import TheAccueil from '../pages/AccueilPage.vue';

// Objet pour définir les différentes routes (url) de l'application
const routes = [
  {
    path: '/accueil',
    component: TheAccueil,
    name: 'start'
  },
  
  {
    path: '/:catchAll(.*)', // Défini une route qui attrape toutes celles non précédement reconnue.
    redirect: { name: 'start' }    // Redirige vers l'accueil
  },
]

const router = createRouter({
  history: createWebHistory(),  // Méthode que Vue va utiliser pour gérer l'historique de navigation
                                  // pour le navigateur (boutons <-- et -->)
  routes
})
  
  export default router;