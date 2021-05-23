<template>
  <div class="top-area">
    <app-header></app-header>  
  </div>

  <div class="center">
    <div class="routed-components-area">
      <!--Zone principale doit acceuillir les composant "routés"-->
      <router-view></router-view>
    </div>
  </div>

  <div class="bottom-area">
    <app-footer></app-footer>
  </div>
</template>


<script>
import Header from './components/Header';
import Footer from './components/Footer';

export default {
  components : {
    "app-header" : Header,
    "app-footer" : Footer,
  },

  
  data(){
    return {
    };
  },


  methods : {
  }

};
</script>


<style>
#app {
  display: flex;
  width: 100%;
  height: 100%;
  flex-flow: column;
  border: solid 1px black;
}

.btn-red,
.btn-green {
    min-width: 3rem;
    height: 1.75rem;
    margin: 0.25rem;
    border-radius: 4px;
    font-weight: bold;
    color: white;
}

.btn-red:disabled,
.btn-green:disabled {
    color: grey;
}

.btn-red {
    background-color: red;
}

.btn-green {
    background-color: green;
}

.btn-red:disabled {
    background-color: darkred;
}

.btn-green:disabled {
    background-color: darkgreen;
}

input:invalid {
    border: solid 2px red;
}

</style>

<style scoped>

.top-area,
.bottom-area,
.center {
  display: flex;
  flex-flow: row;
  width: 100%;
}

.top-area {
  height: 10%;
  min-height: 3rem;
}

.bottom-area {
  height: 20%;
  min-height: 10rem;
}

.center {
  height: 70%;
  min-height: 20rem;
  overflow-y: auto;
}

.routed-components-area {
  display: flex;
  flex: auto;
  height: 100%;
}
</style>