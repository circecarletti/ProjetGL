import { createRouter, createWebHistory } from 'vue-router';
import TheAccueil from '../pages/AccueilPage.vue';
import TheInformation from '../pages/InformationPage.vue';
import TheInscription from '../pages/InscriptionPage.vue';
import TheConnexion from '../pages/ConnexionPage.vue';
import TheResource from '../pages/ResourcePage.vue';
import TheCustomer from '../pages/CustomerPage.vue';
import TheBorrowedList from '../components/BorrowedList.vue';
import TheBalanceFeed from '../components/BalanceFeed.vue';
import ThechildrenAccountsList from '../components/ChildrenAccountsList.vue';
import TheUpdateCustomer from '../components/UpdateCustomer.vue';
import TheDeleteCustomer from '../components/DeleteCustomer.vue';
import TheManager from '../pages/ManagerPage.vue';
import AddCustomerPanel from '../components/AddCustomer.vue';
import AddResoucePanel from '../components/AddResource.vue';

// Objet pour définir les différentes routes (url) de l'application
const routes = [
  {
    path: '/accueil',
    component: TheAccueil,
    name: 'start'
  },
  {
    path: '/information',
    component: TheInformation
  },
  {
    path: '/inscription',
    component: TheInscription
  },
  {
    path: '/connexion',
    component: TheConnexion
  },
  {
    path: '/customer/:customerId',
    component: TheCustomer,
    children: [
      {
        path: 'borrowed',
        component: TheBorrowedList
      },
      {
        path: 'balance-feed',
        component: TheBalanceFeed
      },
      {
        path: 'children-accounts-list',
        component: ThechildrenAccountsList
      },
      {
        path: 'update',
        component: TheUpdateCustomer
      },
      {
        path: 'delete',
        component: TheDeleteCustomer
      },
    ]
  },
  {
    path: '/manager/:managerId',
    component: TheManager,
    children: [
      {
        path: 'add-customer',
        component: AddCustomerPanel
      },
      {
        path: 'add-resource',
        component: AddResoucePanel
      },
    ]
  },
  {
    path: '/resource/:resourceId',
    component: TheResource
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