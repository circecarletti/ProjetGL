<template>
  <app-header></app-header>  

  <div class="center">
    <div class="routed-components-area">
      <!--Zone principale doit acceuillir les composant "routés"-->
      <router-view></router-view>
    </div>
  </div>

  <app-footer></app-footer>
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