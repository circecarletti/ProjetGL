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
        <div class="line"></div>
        <div class="line">
            <div>
                Vous abonnez vous permet d'obtenir des 
                <br>réductions (30%) sur vos prochains emprunts.
                <br> Un abonnement coûte 100€/an : 
            </div>
            <div>
                <button type="button" class="btn-green" @click="subscribe">
                    s'abonner
                </button>
            </div>            
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
import { sendGet, sendPut } from '../services/httpHelpers.js'
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

        subscribe(){
            sendGet(`https://orsaymediatheque.herokuapp.com/jwtidAdult`).then(() => {
                return sendPut(`https://orsaymediatheque.herokuapp.com/api/user/adultmember/buyMembership`, {id : this.$store.getters['userId']});
            }).then( response => {
                    if(response.success){
                        openModal(this, 'theModalUpdated', 'La souscription a bien été effectuée.');
                    }else{
                        openModal(this, 'theModalUpdateFailed', `La souscription n'a pas pu avoir lieu : ${response.message}`);
                    }
                })
        },

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
                const addMoney = {
                    id : this.customerId,
                    balance : feedNumber,
                };

                // ICI, appel du service de mise à jour du solde en fonction du this.customerId
                // et du montant feedNumber
                sendGet('https://orsaymediatheque.herokuapp.com/jwtidAdult').then(()=>{
                    return sendPut('https://orsaymediatheque.herokuapp.com/api/user/adultmember/fundAccount', addMoney);
                }).then(response =>{
                    if(response.success){
                        this.currentBalance += feedNumber;
                        openModal(this, 'theModalUpdated', 'La mise à jour de votre solde a bien été effectuée.');
                    }else{
                        console.log("Error in adding money : ", response.message);
                    }
                }).catch(error => {
                    this.dataError = true;
                    console.error(error);
                });
                
                // Dans le catch afficher la modale d'erreur avec le message du serveur
                // openModal(this, 'theModalUpdateFailed', 'BLa Bla bla');
            }
        }
    },

    mounted() {
        // ICI appel du service donnant le solde actuel du compte en fonction
        // de l'identifiant du client
        this.customerId = this.$route.params.customerId;
        sendGet('https://orsaymediatheque.herokuapp.com/jwtidAdult').then(()=>{
            return sendGet(`https://orsaymediatheque.herokuapp.com/api/user/adultmember/${this.customerId}`)
            }).then( response => {
                if(response.success){
                    // console.log("response getting user infos : ", response);
                    const customer = response;
                    this.dataError = false;
                    this.currentBalance = customer.docs.member.balance;
                    // console.log("current balance : ", this.currentBalance);
                }else{
                    console.log("Error in balance feed (.mounted) : ", response.message);
                }
                

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
    padding-top: 0.5rem;
    height: 3rem;
}

.btn-green {
    margin-left: 1rem;
}

.line > input[type="text"] {
    text-align: center;
    max-width: 8rem;
    margin-left: 2rem;
    margin-right: 0.5rem;
}

.line.action {
    justify-content: center;
}

</style>