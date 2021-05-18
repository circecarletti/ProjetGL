<template>
    <div class="searchListArea" v-if="!searching">
        <div class="line" v-for="(anItem, index) in result" :key="anItem" @click="onSelect(index)">
            <div class="image-area">
                <img :src="'/' + anItem.url" class="image">
            </div>
            <div class="text-area">
                <div class="title">
                    {{anItem.titre}}
                </div>
                <div class="author">
                    {{anItem.auteur}}, {{anItem.annee}}
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

                // Alors, à voir si les requêtes simples ou complexes se font sur le même
                // appel API (avec juste les critères qui changent) ou si ce sont deux
                // appels différents au niveau de l'API.
                // Là le squelette est fait pour 2 appels différents
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
        simpleSearch(titleOrAUthor) {
            // Ici, l'appel retourne toute la base (elle est trèèèèèèèèès petite) et on
            // filtre dans le front.
            // Il FAUT CHANGER ça quand l'api côté serveur sera prète, c'est au serveur back-end
            // de filtrer les donnnées en fonction de l'appel reçu.
            sendGet('https://media-orsay-default-rtdb.firebaseio.com/stock.json').
                then( response => {
                    // DUMMY le filtre est fait ici mais normalement le back ne doit renvoyer
                    // QUE les nouveautés.
                    // Il FAUT CHANGER ça quand l'api côté serveur sera prète, c'est au serveur back-end
                    // de filtrer les donnnées en fonction de l'appel reçu.
                    if (titleOrAUthor.trim() !== '') {
                        const regEx = new RegExp(titleOrAUthor.trim(), 'gi');
                        this.result = response.filter( anItem => {
                            const indexSearchAuthor = anItem.auteur.search(regEx);
                            const indexSearchtitle = anItem.titre.search(regEx);
                            return indexSearchAuthor > -1 || indexSearchtitle > -1 ;
                        } );
                    } else {
                        // Pas de filtre
                        this.result = response;
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
                })
        },
        advancedSearch(criteriaObject) {
            // Ici, l'appel retourne toute la base (elle est trèèèèèèèèès petite) et on
            // filtre dans le front.
            // Il FAUT CHANGER ça quand l'api côté serveur sera prète, c'est au serveur back-end
            // de filtrer les donnnées en fonction de l'appel reçu.
            sendGet('https://media-orsay-default-rtdb.firebaseio.com/stock.json').
                then( response => {
                    // DUMMY le filtre est fait ici mais normalement le back ne doit renvoyer
                    // QUE les nouveautés.
                    // Il FAUT CHANGER ça quand l'api côté serveur sera prète, c'est au serveur back-end
                    // de filtrer les donnnées en fonction de l'appel reçu.
                    this.result = response.filter( anItem => {
                        let check = true;
                        if (typeof criteriaObject.title === 'string') {
                            check = check && 
                                anItem.titre.search(new RegExp(criteriaObject.title.trim(), 'gi')) > -1;
                        }
                        if (typeof criteriaObject.author === 'string') {
                            check = check && 
                                anItem.auteur.search(new RegExp(criteriaObject.author.trim(), 'gi')) > -1;
                        }
                        if (Number.isInteger(criteriaObject.year)) {
                            check = check && 
                                anItem.annee === criteriaObject.year;
                        }
                        if (typeof criteriaObject.available === 'boolean') {
                            check = check && anItem.disponible === criteriaObject.available;
                        }
                        if (Array.isArray(criteriaObject.categories) && criteriaObject.categories.length > 0) {
                            check = check && criteriaObject.categories.includes(anItem.categorie);
                        }
                        if (Array.isArray(criteriaObject.types) && criteriaObject.types.length > 0) {
                            check = check && criteriaObject.types.includes(anItem.type);
                        }
                        return check;
                    } );
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
    font-size: 1.5rem;
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
</style>