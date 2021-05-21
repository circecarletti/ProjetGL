<template>
    <div class="checkboxes-list-area">
        <div class="checkboxes-group-label">
            <span>{{label}}</span>
        </div>
        <div class="checkboxes-list">
            <div class="line" v-for="(aData, index) in data" :key="aData">
                <input type="checkbox" 
                    :id="id + '_cb_' + index" 
                    :value="aData.value" 
                    v-model="checkedItems">
                <label :for="id + '_cb_' + index">{{aData.label}}</label>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * Props :
 *  id : Identifiant html global pour le composant, utile pour générer les identifiants internes.
 *  label: Nom affiché pour le groupe de check boxes.
 *  data: Ensemble des objets permettant de définir chacune des checkboxes.
 *          Chaque objet est de la forme :
 *          {
 *              label: string affichée à côté de la checkboxe
 *              value: string repésentant la valeur de la checkbox lorsquelle est cochée
 *              checked: booleen indiquant si la check box ext cochée ou non
 *          }
 * Event : 
 *  valuesSet : Evenement émis quand les valeurs sélectionnées changent. Cet évènement 
 *              est émis également à la fin de l'initialisation du composant.
 */
export default {
    props: {
        'id': {
            type: String,
            required: true
        },
        'label' : {
            type: String,
            required: true
        },
        'data': {
            type: Array,
            required: true
        }
    },
    emits: ['valuesSet'],
    data() {
        return {
            checkedItems: []
        }
    },
    watch : {
        checkedItems(newValue) {
            this.$emit('valuesSet', newValue);
        }
    },
    beforeMount() {
        if (Array.isArray(this.data)) {
            this.data.forEach( aData => {
                if (aData.checked) {
                    this.checkedItems.push(aData.value);
                }
            });
        }
        this.$emit('valuesSet', this.checkedItems);
    }
}
</script>


<style scoped>
.checkboxes-list-area {
    display: flex;
    flex: auto;
}

.checkboxes-group-label,
.checkboxes-list {
    height: 100%;
    width: auto;
    display: flex;
    justify-content: left;
}

.checkboxes-group-label {
    margin-right: 1rem;
}

.checkboxes-list {
    flex-flow: column;
}

.line {
    display: flex;
}
</style>