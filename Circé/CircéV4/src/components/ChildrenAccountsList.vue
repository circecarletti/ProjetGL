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
                        {{account.prenom}} {{account.prenom}}, {{account.solde}} €
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
                            <option :value="account.id" v-for="account in accountsList" :key="account">{{account.email}}</option>
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
                        <label for="startingBalance">Solde de départ : </label>
                        <input id="startingBalance" type="text" ref="startingBalance"
                            v-model="newAccountBalance"
                            :pattern="balanceRegEx" required>
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
import { sendGet, sendPost } from '../services/httpHelpers.js'
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
            newAccountBalance: '',
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
        newAccountBalance() {
            manageValidityMessage(
                this.$refs['startingBalance'],
                `Le montant doit être un nombre strictement positif, avec un maximum de deux décimales.`);
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
            const amount = Number(this.newAccountBalance);
            const amountValid = positiveNumberDecimalCheck(amount, 2);
            return !(lastNameValid && firstNameValid && ageValid && emailValid && amountValid);
        }
    },
    methods: {
        addBalance() {

            if (this.feedAmountDataNotValid) {
                openModal(this, 'theModalError', `Les données pour la mise à jour du solde sont incorrectes.`);
            } else {
                const updatePayload = {
                    accountId: Number(this.childrenAccountIdToFeed),
                    amountToAdd: Number(this.amountToFeed)
                };
                sendPost('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/updateBalance.json', updatePayload).
                    then( response => {
                        console.log(response);
                        openModal(this, 'theModalUpdated', `Le solde a bien été mis à jour.`)
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
                const newAccountPayload = {
                    nom: this.newAccountLastName,
                    prenom: this.newAccountFirstName,
                    age: this.newAccountAge,
                    email: this.newAccountEmail,
                    solde: this.newAccountBalance,
                    type: "client",
                    compteMaitre: this.customerId,
                    emprunt: [],
                    nbEnfants: 0,
                    status: "ok"
                };

                sendPost('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/addChildrenAccount.json', newAccountPayload).
                    then( response => {
                        console.log(response);
                        openModal(this, 'theModalUpdated', `Le compte pour mineur a bien été créé.`)
                    }).
                    catch( error => {
                        console.error(error);
                        openModal(this, 'theModalError', `L'enregistrement a échoué : ${error.message}`);
                    })            

            }

        }
    },
    mounted() {
        this.customerId = Number.parseInt(this.$route.params.customerId);
        // ICI APPEL du service serveur qui retourne la liste des comptes mineurs
        // rattachés à l'identifiant du client
        // La valorisation du tableau des comptes se fait dans le "then"
        // de la promise
        this.waiting = true;
        sendGet('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/users.json').
            then( response => {
                // DUMMY le filtre est fait ici mais normalement le back ne doit renvoyer
                // QUE les compte des mineur rattaches.
                this.accountsList = response.filter( user => user.compteMaitre === this.customerId );
                this.dataError = false;
                this.waiting = false;
            }).
            catch( error => {
                this.dataError = true;
                this.waiting = false;
                console.error(error);
            });
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