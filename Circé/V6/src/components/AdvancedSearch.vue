<template>
    <div class="advanced-search-area">
        <div class="line">
            <div class="cell">
                <label for="advanced-search-title-id">Titre : </label>
                <input type="text" id="advanced-search-title-id" v-model="title">
            </div>
            <div class="cell">
                <label for="advanced-search-author-id">Auteur : </label>
                <input type="text" id="advanced-search-author-id" v-model="author">
            </div>
        </div>
        <div class="line">
            <div class="cell">
                <label for="advanced-search-releaseDate-id">Année de sortie : </label>
                <input type="number" id="advanced-search-releaseDate-id" v-model="releaseDate">
            </div>
        </div>
        <div class="line">
            <div class="cell">
                <checkboxes-list id="cathegorie-criteria" label="Catégorie" :data="initCbCathegory" @values-set="onCategoriesSet"></checkboxes-list>
            </div>
            <div class="cell">
                <checkboxes-list id="type-criteria" label="Types" :data="initCbTypes" @values-set="onTypesSet"></checkboxes-list>
            </div>
        </div>
        <div class="line bottom">
            <div class="cell bottom">
                <input type="checkbox" id="available-on-site-cb" v-model="available">
                <label for="available-on-site-cb">Actuellement disponible sur place</label>
            </div>
            <div class="cell bottom search" :class="{ disabled : waitingForResult }" @click="onClick">
                <i class="fas fa-search fa-2x"></i>
            </div>
        </div>
    </div>
</template>

<script>

import checkboxesList from './CheckboxesList.vue';

/**
 * Props :
 *  waitingForResult : indique si une recherche est en cours, auquel cas on end inactif le bouton de recherche.
 * 
 * Events:
 *  search : Renvoie les critères demandés pour une recherche.
 *      L'object est de la forme (nb: tous les membres sont facultatifs):
 *      {
 *          title: String, titre ou partie du tire à rechercher
 *          author: String, nom ou partie du nom del'auteur
 *          releaseDate: Integer, année de création/édition
 *          categories: string[] catégories à filtrer (garder)
 *          types: string[] types à filtrer (garder)
 *          available: boolean, indique si les élément doivent ou non être disponibles sur place
 *      }
 */
export default {
    components: {
        'checkboxes-list': checkboxesList
    },

    props: {
        'waitingForResult' : {
            type: Boolean,
            required: true,
        }
    },

    emits: ['search'],

    data() {
        return {
            initCbCathegory: [
                {
                    label: 'adulte',
                    value: 'adulte',
                    checked: false
                },
                {
                    label: 'enfant',
                    value: 'enfant',
                    checked: false
                },
                {
                    label: 'Tous publics',
                    value: 'tousPublic',
                    checked: false
                },
            ],
            initCbTypes: [
                {
                    label: 'CD',
                    value: 'cd',
                    checked: false
                },
                {
                    label: 'DVD',
                    value: 'dvd',
                    checked: false
                },
                {
                    label: 'Livres',
                    value: 'livre',
                    checked: false
                },
                {
                    label: 'Jeux video',
                    value: 'jeux',
                    checked: false
                }
            ],
            selectedCategories: [],
            selectedTypes: [],
            available: false,
            releaseDate: undefined,
            author: '',
            title: ''
        }
    },

    computed: {

    },

    methods: {
        onCategoriesSet(event) {
            this.selectedCategories = event;
        },
        onTypesSet(event) {
            this.selectedTypes = event;
        },
        onClick() {
            this.$emit(
                'search',
                {
                    title: this.title,
                    author: this.author,
                    releaseDate: this.releaseDate,
                    categories: this.selectedCategories,
                    types: this.selectedTypes,
                    available: this.available
                }
            );
        }
    }
}
</script>

<style scoped>
.advanced-search-area {
    width: 100%;
    display: flex;
    flex-flow: column;
    border: solid 1px black;
}

.line {
    width: auto;
    display: flex;
    margin: 0.5rem;
}

.line.bottom {
    margin-right: 0;
    margin-bottom: 0;
    margin-top: 0;
    justify-content: space-between;
}

.cell {
    width: 50%;
    height: 100%;
    display: flex;
}

.cell > label {
    margin-right: 1rem;
}

.cell.bottom {
    align-items: center;
    width: auto;
}

.cell.search > i {
    border: solid 1px;
    border-color: black transparent transparent black;
    padding: 2px;
}

.cell.search.disabled {
    pointer-events: none;
    color: rgba(125, 125, 125, 0.5);
}

</style>