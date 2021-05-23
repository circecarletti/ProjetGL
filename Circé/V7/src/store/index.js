
import { createStore } from 'vuex';


const store = createStore({


  // Etat global interne de l'application, on ne DOIT PAS y accéder directement
  // Utiliser les getter pour récupérer un état, et utiliser les actions pour mettre
  // à jour les états
  state() {
    return {
      userType: 'unauthenticated', // Un parmis : 'unAuthenticated', 'customer', 'manager', 'child'
      userId: -1,
      token:''
    };
  },


  // Permet de changer le state, ces méthodes sont invoquées via "commit('nomMethode')" 
  // mais on ne les appelle pas de l'extérieure du magasin car elle ne doivent JAMAIS 
  // réaliser de traitement assynchrones (elles ne peuvent pas retourner de promise)
  // Le premier paramètre est le state, le second (facultatif) est un objet paramètre
  // (payload) passé pour effectuer la mutation (changement)
  //équivalent à des setter private d'une classe (java)
  mutations: {
    setUserAsCustomer(state) {
      state.userType = 'customer';
    },

    setUserAsManager(state) {
      state.userType = 'manager';
    },

    setUserAsChild(state) {
      state.userType = 'child';
    },

    setUserAsUnAuthenticated(state) {
      state.userType = 'unauthenticated';
    },

    setUserId(state, id) {
      state.userId = id;
    },

    setToken(state, token){
      state.token = token;
    }
  },


  // Pour accéder aux état à partir des composants.
  // chaque getter reçoit en parametre le state et en second les autres getters.
  // On les appelle de l'extérieur avec this.$store.getters['le nom du getter']
  getters: {
    isUserAuthenticated(state) {
      return state.userType !== 'unauthenticated';
    },

    isUserCustomer(state) {
      return state.userType === 'customer';
    },

    isUserChild(state) {
      return state.userType === 'child';
    },

    isUserManager(state) {
      return state.userType === 'manager';
    },

    userId(state) {
      return state.userId;
    },

    userToken(state) {
      return state.userId;
    },
  },


  // Les actions servent à modifier les états en appelant les mutations. Elles peuvent 
  // également exécuter du code assynchrone et renvoyer des promises. On les appelle 
  // de l'extérieur avec this.$store.dispatch('nom action', {objet payload facultatif })
  // équivaut à des setter public
  actions: {

    setUserAsCustomer(context) {
      context.commit('setUserAsCustomer');
    },

    setUserAsChild(context) {
      context.commit('setUserAsChild');
    },

    setUserAsManager(context) {
      context.commit('setUserAsManager');
    },

    setUserAsUnAuthenticated(context) {
      context.commit('setUserAsUnAuthenticated');
    },

    setUserId(context, id) {
      context.commit('setUserId', id);
    },

    setUserToken(context, token){
      context.commit('setUserId', token);
    }
  },

});

export default store;