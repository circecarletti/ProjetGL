<template>
    <div class="accueil-area">
        <div class="main-area">
            <div class="actions-area">
                <the-simple-search v-if="searchIsSimple" :waitingForResult="searching" @search="onSimpleSearch"></the-simple-search>
                <the-advanced-search v-if="!searchIsSimple" :waitingForResult="searching" @search="onAdvancedSearch"></the-advanced-search>
                <div class="link-actions-area">
                    <router-link to="/information">Informations générales</router-link>
                    <a href="javascript:" @click="toggleResearch">{{ searchTypeLabel }}</a>
                </div>
            </div>
            <div class="display-area">
                <the-search-result :criteria="searchCriteria" @searchOver="updateSearchingState"></the-search-result>
            </div>
        </div>
        <the-news></the-news>
    </div>
</template>



<script>
import simpleSearch from '../components/SimpleSearch.vue';
import advancedSearch from '../components/AdvancedSearch.vue';
import searchResult from '../components/SearchList.vue';

export default {

    components: {
        "the-simple-search": simpleSearch,
        "the-advanced-search": advancedSearch,
        "the-search-result": searchResult
    },


    data() {
        return {
            searchIsSimple: true,
            searching: false,
            searchCriteria: {},
        }
    },


    computed: {
        searchTypeLabel() {
            if (this.searchIsSimple) {
                return 'Recherche avancée';
            } else {
                return 'Recherche simple';
            }
        }
    },


    methods: {

        toggleResearch() {
            this.searchIsSimple = !this.searchIsSimple;
        },

        onAdvancedSearch(advancedCriteria) {
            this.searchCriteria = advancedCriteria;
        },

        onSimpleSearch(simpleCriteria) {
            this.searchCriteria = simpleCriteria;
        },
        
        updateSearchingState(searchIsOver) {
            this.searching = !searchIsOver;
        }
    },
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