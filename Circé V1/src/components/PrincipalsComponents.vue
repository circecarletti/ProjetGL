<template>
  <header>
    <app-header>
    </app-header>  
  </header>
<footer>
  <app-footer></app-footer>
</footer>  

</template>


<script>
import Header from './Header.vue';
import Footer from './Footer.vue';

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