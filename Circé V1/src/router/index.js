import { createRouter, createWebHistory } from 'vue-router';
import TheAccueil from '../pages/AccueilPage.vue';

// Objet pour définir les différentes routes (url) de l'application
const routes = [
  {
    path: '/accueil',
    component: TheAccueil,
    name: 'start'
  }
]

  const router = createRouter({
    history: createWebHistory(),  // Méthode que Vue va utiliser pour gérer l'historique de navigation
                                  // pour le navigateur (boutons <-- et -->)
    routes
  })
  
  export default router