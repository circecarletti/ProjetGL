<template>
    <div class="simple-search-area">
        <input type="text" class="simple-search-input" v-model="userInput" placeholder="Nom de la ressource...">
        <div class="simple-search-button" v-bind:class="{ disabled : waitingForResult }" @click="onClick">
            <i class="fas fa-search fa-2x"> </i>
        </div>
    </div>
</template>

<script>
/**
 * Props :
 *  waitingForResult : indique si une recherche est en cours, auquel cas on end inactif le bouton de recherche.
 * 
 * Events:
 *  search : Renvoie les critères demandés pour une recherche.
 *      L'object est de la forme (nb: tous les membres sont facultatifs):
 *      {
 *          simpleCriteria: String, la signification dépend de l'appelant.
 *      }
 */
export default {
    props: {
      'waitingForResult' : {
          type: Boolean,
          required: true,
      }
    },

    emits: ['search'],

    data() {
        return {
            userInput: '',
        }
    },

    methods: {
      onClick() {
        console.log('simple search click');
          this.$emit(
            'search', this.userInput
          );
        }
    }
}
</script>

<style scoped>
.simple-search-area {
    height: 2rem;
    width: 100%;
    display: flex;
}

.simple-search-input {
    height: 100%;
    width: 100%;
    border: solid 2px grey;
    padding: 0;
}

.simple-search-button {
    height: 100%;
    border: solid 2px grey;
}

.simple-search-button.disabled {
    pointer-events: none;
    color: rgba(125, 125, 125, 0.5);
}

</style>