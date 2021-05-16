<template>
  <app-header></app-header>  

  <div class="center">
    
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

  // props: [
  //   'connected'
  // ],
  
  data(){
    return {
    };
  },


  methods : {
  }

};
</script>