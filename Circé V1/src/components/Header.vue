<template>
  <header>      
    <h1> Médiathèque d'Orsay </h1>   
    <div v-if="isLogIn">
      <div id="logOut">
        <button @click="logOut">deconnexion</button>
      </div>
    </div>
    <div v-else>
      <div id="SignIn">
        <button @click="signIn">inscription</button> 
      </div>
      <div id="logIn">
        <button @click="logInCustomer">connexion</button>
      </div>
    </div>
  </header>
</template>


<script>

export default {
  
  data(){
    return {};
  },

  computed : {
    isLogIn(){
      return this.$store.getters['isUserAuthenticated'];
    }
  },

  methods : {
    logInCustomer(){
      this.$store.dispatch('setUserAsCustomer');
    },

    logOut(){
      this.$store.dispatch('setUserAsUnAuthenticated');
    }
  }
};
</script>