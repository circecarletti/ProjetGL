<template>
  <header>      
    <div class="left-area" @click="goToAccueil">
      <h1>Orsay Médiathèque</h1>
    </div>
    <div class="right-area">
      <button v-if="isLogIn" @click="goToAccount">Mon compte</button>
      <button v-if="isLogIn" @click="logOut">deconnexion</button>
      <button v-if="!isLogIn" @click="signIn">inscription</button> 
      <button v-if="!isLogIn" @click="logIn">connexion</button>
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
    logIn(){
      this.$router.push('/connexion');
    },

    signIn(){
      this.$router.push('/inscription');
    },

    logOut(){
      this.$store.dispatch('setUserAsUnAuthenticated');
      this.$router.push('/accueil');
    },

    goToAccount() {
      const userId = this.$store.getters['userId']
      if (this.$store.getters['isUserCustomer']) {
          this.$router.push(`/customer/${userId}/borrowed`);
      } else if (this.$store.getters['isUserManager']) {
          this.$router.push(`/manager/${userId}/add-customer`);
      } else {
          alert('Non implementé.');
      }
    },

    goToAccueil(){
      this.$router.push('/accueil');
    }
  }
};
</script>


<!-- Le scoped permet d'appliquer les css 'localement'=> ici uniquement
     au composant Header.vue -->

<style scoped>
header {
    display: flex;
    height: 100%;
    width: 100%;
    border-bottom: solid 1px black;
}

.left-area {
    display: flex;
    height: 100%;
    width: 50%;
    justify-content: left;
    align-items: center;
    padding-left: 2rem;
}

.right-area {
    display: flex;
    height: 100%;
    width: 50%;
    justify-content: flex-end;
    align-items: center;
    padding-right: 2rem;
}

button {
    height: 1.5rem;
    margin-left: 1rem;
    margin-right: 1rem;
}
</style>