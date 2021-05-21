<template>
    <div class="small-search-area">
        <div class="search-banner">
            <span class="title">{{searchTitle}}</span>
            <the-search @search="onSearch" :waitingForResult="searching"></the-search>
        </div>
        <div class="waiting-area" v-if="searching">
            <the-spinner></the-spinner>
        </div>
        <div class="no-data" v-else-if="searchResult.length === 0">
            <span>Aucune donnée pour les critères courants.</span>
        </div>
        <div class="result-area" v-else>
            <a-result-item v-for="resultItem in searchResult" :key="resultItem"
                :title="resultItem.title"
                :image="resultItem.image"
                :url="resultItem.url"
                :lines="resultItem.lines">
            </a-result-item>
        </div>
    </div>
</template>

<script>
import TheSearch from './SimpleSearch.vue';
import AResultItem from './SmallSearchResultItem.vue';

/**
 * Usage :
 *  Props :
 *      title: Le titre à afficher au dessus du composant de saisie du critère de recherche.
 *      data: Tableau d'objets ontenant le résultat de la rechereche. chacune des objets doit avoir 
 *              le format suivant (correspond aux props des éléments résultat à afficher):
 *      {
 *          title: Titre de l'élémént (nom du client, titre de l'ouvrage, ...)
 *          image: path (à partir du répertoire public) où trouver l'image à afficher avec l'élément
 *          url: url pour débrancher quand on clique sur le titre (facultative)
 *          lines: tableau de string représentant des informations complémentaires à afficher. 
 *      }
 *      searching: booleen indiquant si une recherche est en cours ou non
 */
export default {
    components: {
        "the-search": TheSearch,
        "a-result-item": AResultItem
    },
    props: ['title','data', 'searching', 'error'],

    emits: ['searchCriteria'],

    computed: {
        searchTitle() {
            if (typeof this.title === 'string' && this.title.trim() !== '') {
                return this.title.trim();
            } else {
                return 'Recherche inconnue';
            }
        },

        searchResult() {
            if (Array.isArray(this.data) && this.data.length > 0) {
                return this.data.map( item => {
                    return {
                        title: item.title,
                        image: item.image,
                        url: item.url,
                        lines: Array.isArray(item.lines) ? [...item.lines] : [],
                    }
                });
            } else {
                return [];
            }
        }
    },
    
    methods: {
        onSearch(event) {
            console.log('onSearch', event);
            this.$emit('searchCriteria', event);
        }
    }
}
</script>

<style scoped>
.small-search-area {
    display: flex;
    height: 100%;
    width: 100%;
    flex-flow: column;
    align-items: center;
}

.search-banner {
    display: flex;
    flex-flow: column;
    height: 3.5rem;
    width: 100%;
}

.search-banner > span.title {
    font-weight: bold;
    font-style: italic;
}

.waiting-area {
    display: flex;
    width: 20%;
    height: calc(100% - 3.5rem);
}

.no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100% - 3.5rem);
}

.result-area {
    display: flex;
    flex-flow: column;
    height: calc(100% - 3.5rem);
    width: 100%;
    overflow-y: auto;
}

a-result-item {
    margin-top: 0.3rem;
}
</style>