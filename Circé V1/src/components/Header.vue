<template>
  <header>      
    <h1> Médiathèque d'Orsay </h1>   
    <div v-if="connected">
      <div id="logOut">
        <button @click="logOut()">deconnexion</button>
      </div>
    </div>
    <div v-else>
      <div id="SignIn">
        <button @click="SignIn()">inscription</button> 
      </div>
      <div id="logIn">
        <button @click="logIn()">connexion</button>
      </div>
    </div>
  </header>
</template>


<script>

export default {
  
  data(){
    return {
      connected : false,
    };
  },


  methods : {
    logIn() {
      this.connected = true;
      console.log('connexion...');
    },

    logOut() {
      this.connected = false;
      console.log('deconnexion...');
    }
  }

};
</script>