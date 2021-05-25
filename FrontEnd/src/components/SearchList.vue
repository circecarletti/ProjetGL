<template>
    <div class="searchListArea" v-if="!searching">
        <div class="empty-result" v-if="noResult">
            <label><h3>Aucun resultats</h3></label>
        </div>
        <div class="line" v-for="(anItem, index) in result" :key="anItem" @click="onSelect(index)">
            <div class="image-area">
                <img class="image" :src="'/' + anItem.picture">
            </div>
            <div class="text-area">
                <div class="title">
                    {{anItem.title}}
                </div>
                <div class="author">
                    {{anItem.author}}, {{anItem.releaseDate}}
                </div>
                <div class="technical">
                    <div class="item-type">{{anItem.type}}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="waiting-area" v-if="searching">
        <the-spinner></the-spinner>
    </div>
</template>


<script>
import { sendGet } from '../services/httpHelpers.js';

/**
 * Props:
 *  criteria: Objet avec les critères de recherche. Un recherche est déclenchée chaque 
 *              fois que les critères changent, sauf si une recherche est déjà en cours.
 * Events:
 *  searchOver: Evenement émit quand on démare une recherche (false) et quand une 
 *              recherche est terminée (true)
 */
export default {

    props: {
        criteria: {
            type: Object,
            required: true,
        }
    },

    emits: ['searchOver'],

    computed: {
        noResult(){
            return this.result.length===0;
        }
    },

    data() {
        return {
            result: [],
            searching: false
        }
    },
    
    watch: {
        criteria() {
            // On ne déclenche une recherche que si on n'est pas déjà sur une 
            // recherche en cours ET que l'on a au moin un critère
            if (!this.searching && Object.getOwnPropertyNames(this.criteria).length > 0) {
                this.searching = true;
                this.$emit('searchOver', false);

                if (typeof this.criteria.simpleCriteria === 'string') {
                    this.simpleSearch(this.criteria.simpleCriteria);
                } else {
                    this.advancedSearch(this.criteria);
                }
            }
        }
    },

    methods: {
        onSelect(index) {
            const selectedItem = this.result[index];
            if (selectedItem) {
                this.$router.push(`/resource/${selectedItem.id}`);
            }
        },
        
        simpleSearch(titleOrAuthor) {
            this.result = [];
            sendGet('https://orsaymediatheque.herokuapp.com/api/resource', [{name : 'name', value: titleOrAuthor.toLowerCase()}]).
                then( response => {
                    if(response.success){
                        this.result = response.docs;
                    }else{
                        console.log("erreur : ", response.message);
                    }
                    this.dataError = false;
                    this.searching = false;
                    this.$emit('searchOver', true);
                }).
                catch( error => {
                    this.dataError = true;
                    this.searching = false;
                    this.$emit('searchOver', true);
                    console.error(error);
                });
        },

        advancedSearch(criteriaObject) {
            this.result = [];

            const sendedCriterias = [];
                
            if(criteriaObject.title){
                sendedCriterias.push({name: "title", value: criteriaObject.title.toLowerCase()});
            }

            if(criteriaObject.author){
                sendedCriterias.push({name: "author", value: criteriaObject.author.toLowerCase()});
            }

            if(criteriaObject.releasedDate){
                sendedCriterias.push({name: "releasedDate", value: criteriaObject.releasedDate});
            }
            
            if(criteriaObject.categories){
                sendedCriterias.push({name: "category", value: criteriaObject.categories.map(cat => cat.toLowerCase())});
            }
            
            if(criteriaObject.types){
                criteriaObject.types.map(type => type.toLowerCase());
                criteriaObject.types.map(type => {
                    if(type === 'child'){
                        sendedCriterias.push({name: "type", value: "type-child"});
                    }else if (type === 'customer'){
                        sendedCriterias.push({name: "type", value: "type-customer"});
                    }else{
                        sendedCriterias.push({name: "type", value: "type-everyone"});
                    }
                });
            }

            console.log("Critères ressources recherchées en advanced research : ", sendedCriterias);

            sendGet('https://orsaymediatheque.herokuapp.com/api/resource/searchFilter',sendedCriterias).
                then( response => {
                    if(response.success){
                        this.result = response.docs;
                    }else{
                        console.log(response.message)
                    }
                    this.dataError = false;
                    this.searching = false;
                    this.$emit('searchOver', true);
                }).
                catch( error => {
                    this.dataError = true;
                    this.searching = false;
                    console.error(error);
                    this.$emit('searchOver', true);
                })
        }
    }
}
</script>

<style scoped>
.searchListArea,
.waiting-area {
    display: flex;
    height: 100%;
    width: 100%;
    flex-flow: column;
    overflow-y: auto;
    border: solid 1px black;
}

.waiting-area {
    padding-left: 35%;
    padding-right: 35%;
}

.line {
    width: calc(100% - 2px);
    height: 6rem;
    display: flex;
    border: solid 1px black;
    cursor: pointer;
}

.image-area {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 20%;
    border-right: solid 1px black;
}

.image {
    height: calc(100% - 1rem);
    width: auto;
}

.text-area {
    display: flex;
    flex-flow: column;
    width: calc(80% - 10px);
    height: 100%;
}

.title {
    font-size: 1.3rem;
    font-weight: bolder;
    padding: 0.3rem;
    width: 100%;
}

.author {
    padding: 0.1rem;
    padding-left: 0.3rem;
    width: 100%;
    color: rgba(100, 100, 100, 08);
}

.technical {
    padding: 0.1rem;
    padding-left: 0.3rem;
    width: 100%;
    display: flex;
    flex: auto;
    position: relative;
}

.item-type {
    position: absolute;
    bottom: 0;
    right: 0;
}

.empty-result {
    padding-left: 0.3rem;
}
</style>