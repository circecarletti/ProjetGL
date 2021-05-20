<template>
    <div class="balance-feed-area"> 
        <div class="line">
            <span>Voici votre solde actuel : </span> {{currentBalance}} €
        </div>
        <div class="line">
            <span>Vous souhaitez recharger de : </span> 
            <input v-model="feedAmount" 
                ref="feedAmount"
                type="text"
                :pattern="regExBalance"
                required> €
        </div>
        <div class="line action">
            <button type="button" @click="onValidate" :disabled="feedAmountDataNotValid">Valider</button>
        </div>
        <the-modal ref="theModalUpdateFailed" 
            title="Echec de la mise à jour du solde" 
            type="error"
            okButtonLabel="OK">
        </the-modal>
        <the-modal ref="theModalUpdated" 
            title="Mise à jour effectuée" 
            okButtonLabel="OK">
        </the-modal>
    </div>
</template>


<script>
import { openModal } from '../components/Modal.vue';
import { sendGet } from '../services/httpHelpers.js'
import { 
    regexStringFormulaForBalance, 
    manageValidityMessage,
    positiveNumberDecimalCheck } from '../services/utils.js';

export default {
    data() {
        return {
            currentBalance: 0.0,
            feedAmount: '',
            customerId: undefined,
            dataError: false,
            regExBalance: regexStringFormulaForBalance
        };
    },
    watch: {
        feedAmount() {
            manageValidityMessage(
                this.$refs['feedAmount'],
                `Le montant doit être un nombre strictement positif, avec un maximum de deux décimales.`);
        },
    },
    computed: {
        feedAmountDataNotValid() {
            return !positiveNumberDecimalCheck(Number(this.feedAmount), 2);
        },
    },
    methods: {
        validateFeed() {
            const numValue = Number.parseFloat(this.feedAmount);
            if (Number.isNaN(numValue) || numValue < 0) {
                this.feedAmount = '0.0';
            } else {
                this.feedAmount = numValue.toFixed(2);
            }
        },
        onValidate() {
            this.validateFeed();
            const feedNumber = Number.parseFloat(this.feedAmount);
            if (feedNumber > 0) {
                // ICI, appel du service de mise à jour du solde en fonction du this.customerId
                // et du montant feedNumber
                // Dans le then (si tout c'est bien passé), faire :
                this.currentBalance += feedNumber;
                openModal(this, 'theModalUpdated', 'La mise à jour de votre solde a bien été effectuée.');
                // Dans le catch afficher la modale d'erreur avec le message du serveur
                // openModal(this, 'theModalUpdateFailed', 'BLa Bla bla');
            }
        }
    },
    mounted() {
        // ICI appel du service donnant le solde actuel du compte en fonction
        // de l'identifiant du client
        this.customerId = Number.parseInt(this.$route.params.customerId);
        sendGet('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/users.json').
            then( response => {
                // DUMMY le filtre est fait ici mais normalement le back ne doit renvoyer
                // QUE les ouvrages empruntés.
                const customer = response.find( user => user.id === this.customerId );
                this.dataError = false;
                this.currentBalance = customer.solde;

            }).
            catch( error => {
                this.dataError = true;
                this.waiting = false;
                console.error(error);
            })

    }
}
</script>


<style scoped>
.balance-feed-area {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
}

.line {
    display: flex;
    align-items: center;
    width: 100%;
    padding-left: 1rem;
    height: 2rem;
}

.line > input[type="text"] {
    text-align: center;
    max-width: 8rem;
    margin-left: 2rem;
    margin-right: 2rem;
}

.line.action {
    justify-content: center;
}

</style>