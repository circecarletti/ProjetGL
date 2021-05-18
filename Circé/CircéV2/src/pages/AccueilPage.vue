<template>
  <div class="accueil-area">
        <div class="main-area">
            <div class="actions-area">
                <simple-search v-if="searchIsSimple" v-bind:waitingForResult="waitingForResult" @search="onSimpleSearch"></simple-search>
            </div>
            <div class="display-area">
                <search-result v-bind:criteria="searchCriteria" @searchOver="updateSearchingState"></search-result>
            </div>
        </div>
        <!-- <the-news></the-news> -->
    </div>
</template>

<script>
import simpleSearch from '../components/SimpleSearch.vue';
import searchResult from '../components/SearchList.vue';

export default {
  components:{
    "simple-search" : simpleSearch,
    "search-result": searchResult,
  },

  data(){
    return{
      searchIsSimple : true,
      waitingForResult : false,
      searchCriteria: {},
    };
  },

  methods: {
    toggleResearch() {
      this.searchIsSimple = !this.searchIsSimple;
    },
    
    onSimpleSearch(simpleCriteria) {
      this.searchCriteria = simpleCriteria;
    },
    
    updateSearchingState(searchIsOver) {
      this.waitingForResult = !searchIsOver;
    }
  }

}
</script>

<style scoped>
.accueil-area {
    display: flex;
    padding: 1rem;
    height: calc(100% - 2rem);
    width: calc(100% - 2rem);
}

.main-area {
    display: flex;
    width: 65%;
    flex-flow: column;
    padding-left: 5%;
    padding-right: 5%;
    height: 100%;
}

.actions-area {
    display: flex;
    flex-flow: column;
    width: 100%;
}

.display-area {
    width: 100%;
    display: flex;
    height: 10%;
    flex: auto;
}

.link-actions-area {
    display: flex;
    height: 2rem;
    align-items: center;
    justify-content: space-between;
}
</style>