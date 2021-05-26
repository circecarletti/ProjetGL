<template>
    <div class="children-accounts-list-area"> 
        <div class="list-area">
            <span>Liste de(s) compte(s) mineur(s) rattaché(s) :</span>
            <div class="display-data"  v-if="!waiting">
                <div class="error-area" v-if="(dataError || accountsList.length === 0) && !waiting">
                    <ul>
                        <li>Aucune donnée disponible</li>
                    </ul>
                </div>
                <ul v-else>
                    <li v-for="account in accountsList" :key="account">
                        {{account.firstName}} {{account.lastName}}, {{account.balance}} €
                    </li>
                </ul>
            </div>
            <div class="waiting-area" v-if="waiting">
                <the-spinner></the-spinner>
            </div>
        </div>
        <div class="actions-area">
            <div class="feed-area">
                <form @submit.prevent="addBalance" ref="formFeedAmount">
                    <span class="title-area">Approvisionner un compte mineur</span>
                    <div class="line">
                        <label for="childrenId">Identifiant du mineur : </label>
                        <select id="childrenId" name="childrenId" v-model="childrenAccountIdToFeed" required>
                            <option :value="account.id" v-for="account in accountsList" :key="account">{{account.id}}</option>
                        </select>                    
                    </div>
                    <div class="line action">
                        <label for="balanceToAdd">Montant à ajouter au solde : </label>
                        <input id="balanceToAdd" type="text" v-model="amountToFeed" ref="amountToFeed" 
                            :pattern="balanceRegEx" required>
                        <button type="submit" :disabled="feedAmountDataNotValid">Valider</button>
                    </div>
                </form>
            </div>
            <div class="add-area">
                <form @submit.prevent="addAccount" ref="formChildrenSubscription">
                    <span class="title-area">Ajouter un compte mineur</span>
                    <div class="line">
                        <label for="newLastName">Nom : </label>
                        <input id="newLastName" type="text" ref="newLastName" 
                            v-model="newAccountLastName" :pattern="nameRegEx" required>
                    </div>
                    <div class="line">
                        <label for="newFirstName">Prénom : </label>
                        <input id="newFirstName" type="text" ref="newFirstName" 
                            v-model="newAccountFirstName" :pattern="nameRegEx" required>
                    </div>
                    <div class="line">
                        <label for="newAge">Age : </label>
                        <input id="newAge" type="string" ref="newAge" 
                            v-model="newAccountAge"
                            pattern="^0*([2-9]|1[0-7]{0,1})$" required>
                    </div>
                    <div class="line">
                        <label for="newEmail">Email : </label>
                        <input id="newEmail" type="email" ref="newEmail" 
                            v-model="newAccountEmail" required>
                    </div>
                    <div class="line">
                        <label for="newPassword">Mot de passe : </label>
                        <input 
                        type="password" 
                        id="newPassword" 
                        ref="password" 
                        required
                        v-model="newAccountPassword">
                    </div>
                    <div class="line">
                        <button class="btn-green" type="submit" :disabled="createChildrenAccountDataNotValid">Valider</button>
                    </div>
                </form>
            </div>
        </div>
        <the-modal ref="theModalUpdated" 
            title="Mise à jour effectuée" 
            okButtonLabel="OK">
        </the-modal>
        <the-modal ref="theModalError" 
            title="Erreur" 
            type="error"
            okButtonLabel="OK">
        </the-modal>
    </div>
</template>


<script>
import { openModal } from '../components/Modal.vue';
import { sendGet, sendPost, sendPut } from '../services/httpHelpers.js'
import { 
    regexStringFormulaForName, 
    regexStringFormulaForBalance, 
    manageValidityMessage,
    positiveNumberDecimalCheck } from '../services/utils.js';

export default {
    data() {
        return {
            accountsList: [],
            childrenAccountIdToFeed: '',
            amountToFeed: '',
            newAccountFirstName: '',
            newAccountLastName: '',
            newAccountAge: '',
            newAccountEmail: '',
            newAccountPassword: '',
            dataError: false,
            waiting: false,
            nameRegEx: regexStringFormulaForName,
            balanceRegEx: regexStringFormulaForBalance,
            customerId: undefined,
        }
    },
    watch: {
        childrenAccountIdToFeed() {
            manageValidityMessage(
                this.$refs['childrenAccountIdToFeed'],
                `L'identifiant du compte à approvisionner est obligatoire.`);
        },
        amountToFeed() {
            manageValidityMessage(
                this.$refs['amountToFeed'],
                `Le montant doit être un nombre strictement positif, avec un maximum de deux décimales.`);
        },
        newAccountFirstName() {
            manageValidityMessage(
                this.$refs['newFirstName'],
                `Le prénom est obligatoire et doit être au bon format.`);
        },
        newAccountLastName() {
            manageValidityMessage(
                this.$refs['newLastName'],
                `Le nom est obligatoire et doit être au bon format.`);
        },
        newAccountAge() {
            manageValidityMessage(
                this.$refs['newAge'],
                `L'age est un entier strictement positif et inférieur à 18.`);
        },
        newAccountEmail() {
            manageValidityMessage(
                this.$refs['newEmail'],
                `L'adresse mail est obligatoire et doit être au bon format.`);
        },
        newAccountPassword(newValue) {
            if(this.$refs['password']){
                if (newValue === '') {
                    this.$refs['password'].setCustomValidity(`Le mot de passe est obligatoire .`);
                } else if (newValue.length < 8) {
                    this.$refs['password'].setCustomValidity(`Le mot de passe doit contenir 8 caractères au minimum.`);
                } else {
                    this.$refs['password'].setCustomValidity(``);
                    this.$refs['password'].setCustomValidity(``);
                }
            }
        },
    },

    computed: {
        feedAmountDataNotValid() {
            const number = Number(this.amountToFeed);
            return this.childrenAccountIdToFeed === '' || 
                    !positiveNumberDecimalCheck(number, 2);
        },

        createChildrenAccountDataNotValid() {
            const lastNameValid = this.newAccountLastName.trim() !== '' && this.$refs['newLastName'].validity.valid;
            const firstNameValid = this.newAccountFirstName.trim() !== '' && this.$refs['newFirstName'].validity.valid;
            const ageNumber = Number(this.newAccountAge);
            const ageValid = Number.isInteger(ageNumber) && ageNumber > 0 && ageNumber < 18;
            const emailValid = this.newAccountEmail.trim() !== '' && this.$refs['newEmail'].validity.valid;
            const passwordValid = this.newAccountPassword !== '' && this.$refs['password'].validity.valid;
            return !(lastNameValid && firstNameValid && ageValid && emailValid && passwordValid);
        }
    },

    methods: {

        addBalance() {

            if (this.feedAmountDataNotValid) {
                openModal(this, 'theModalError', `Les données pour la mise à jour du solde sont incorrectes.`);
            } else {
                const updateChildBalance = {
                    id: this.customerId,
                    idChild: this.childrenAccountIdToFeed,
                    balance: Number(this.amountToFeed),
                };
                sendGet(`https://orsaymediatheque.herokuapp.com/jwtidAdult`).then(()=>{
                    return sendPut('https://orsaymediatheque.herokuapp.com/api/user/adultmember/fundChildAccount', updateChildBalance);
                }).then( response => {
                        if(response.success){
                            openModal(this, 'theModalUpdated', `Le solde a bien été mis à jour.`);
                            this.refreshList();
                        }else{
                            console.log("Error in adding money to child : ", response.message);
                        }
                    }).
                    catch( error => {
                        console.error(error);
                        openModal(this, 'theModalError', `L'enregistrement a échoué : ${error.message}`);
                    });

            }

        },

        addAccount() {

            if (this.createChildrenAccountDataNotValid) {
                openModal(this, 'theModalError', `Les données pour la création d'un compte pour mineur sont incorrectes.`);
            } else {
                const newChildAccount = {
                    name: this.newAccountLastName.toLowerCase(),
                    firstname: this.newAccountFirstName.toLowerCase(),
                    age: this.newAccountAge,
                    id: this.newAccountEmail,
                    status : 'childmember',
                    adultmember: this.customerId,
                    password: this.newAccountPassword,
                    emprunt: [],
                };

                sendGet(`https://orsaymediatheque.herokuapp.com/jwtidAdult`).then(()=>{
                    return sendPost('https://orsaymediatheque.herokuapp.com/api/user/adultmember/registerChild', newChildAccount);
                }).then( response => {
                        console.log(response);
                        if(response.success){
                            openModal(this, 'theModalUpdated', `Le compte pour mineur a bien été créé.`);
                            this.refreshList();
                        }else{
                            openModal(this, 'theModalError', `L'enregistrement a échoué : ${response.message}`);
                            console.log("Error in creating new child : ", response.message);
                        }
                    }).
                    catch( error => {
                        console.error(error);
                        openModal(this, 'theModalError', `L'enregistrement a échoué : ${error.message}`);
                    });            

            }

        },

        refreshList(){
            // ICI APPEL du service serveur qui retourne la liste des comptes mineurs
            // rattachés à l'identifiant du client
            // La valorisation du tableau des comptes se fait dans le "then"
            // de la promise
            this.waiting = true;
            sendGet(`https://orsaymediatheque.herokuapp.com/jwtidAdult`).then(()=>{
                    return sendGet(`https://orsaymediatheque.herokuapp.com/api/user/adultmember/childInfo/${this.customerId}`);
            }).then( response => {
                    console.log("list of children response : ", response);
                    if(response.success){
                        this.accountsList = response.docs.childlist.map(child=>{
                            return {
                                firstName : child.member.firstname, 
                                lastName : child.member.name,
                                balance : child.member.balance,
                                id : child.id, 
                            };
                        });
                        this.dataError = false;
                    }else{
                        console.log("Error in searching list of children : ", response.message);
                        this.dataError = true;
                    }
                    this.waiting = false;
                    
                }).
                catch( error => {
                    this.dataError = true;
                    this.waiting = false;
                    console.error(error);
                });
        },
    },
    
    mounted() {
        this.customerId =this.$route.params.customerId;
        this.refreshList();
    }
}
</script>

<style scoped>
.children-accounts-list-area {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
}

.list-area,
.actions-area {
    display: flex;
    flex-flow: column;
    width: calc(100% - 2rem);
    height: calc(40% - 2rem);
    padding: 1rem;
}

.display-data {
    display: flex;
    width: 100%;
    height: 100%;
    overflow-y: auto;
}

.waiting-area {
    display: flex;
    width: 20%;
    height: calc(100% - 2rem);
}

.error-area {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: calc(100% - 2rem);
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.title-area {
    font-size: 1.2rem;
    font-weight: bold;
    height: 1.5rem;
}

.line {
    display: flex;
    align-items: center;
    width: calc(100% - 2rem);
    padding-left: 1rem;
    padding-right: 1rem;
    height: 2rem;
}

.line label {
    width: 25%;
    min-width: 12rem;

}
.line > input,
.line > select {
    min-width: 10rem;
}

.line > button {
    margin-left: 1rem;
    margin-right: 1rem;
}

</style>