<template>
    <div class="update-customer-area"> 
        <div class="line">
            <div class="label-cell">
                <span>Nom :</span>
            </div>
            <div class="input-cell">
                <input type="text"
                    ref="update-customer-last-name"
                    v-model="lastName"
                    required :pattern="nameRegEx">
            </div>
            <div class="action-cell">
                <button type="button" class="btn-green" @click="onUpdate('lastName')" :disabled="lastNameNotValid">Valider</button>
            </div>
        </div>
        <div class="line">
            <div class="label-cell">
                <span>Prénom :</span>
            </div>
            <div class="input-cell">
                <input type="text"
                    ref="update-customer-first-name"
                    v-model="firstName"
                    required :pattern="nameRegEx">
            </div>
            <div class="action-cell">
                <button type="button" class="btn-green" @click="onUpdate('firstName')" :disabled="firstNameNotValid">Valider</button>
            </div>
        </div>
        <div class="line">
            <div class="label-cell">
                <span>Age :</span>
            </div>
            <div class="input-cell">
                <input type="text"
                    ref="update-customer-age"
                    v-model="age"
                    required :pattern="ageRegEx">
            </div>
            <div class="action-cell">
                <button type="button" class="btn-green" @click="onUpdate('age')" :disabled="ageNotValid">Valider</button>
            </div>
        </div>
        <div class="line">
            <div class="label-cell">
                <span>Mot de passe :</span>
            </div>
            <div class="input-cell">
                <input type="password"
                    ref="update-customer-password"
                    v-model="password"
                    required>
            </div>
            <div class="action-cell">
                <button type="button" class="btn-green" @click="onUpdate('password')" :disabled="passwordNotValid">Valider</button>
            </div>
        </div>
        <div class="line">
            <div class="label-cell">
                <span>Solde :</span>
            </div>
            <div class="input-cell">
                <input type="text"
                    ref="update-customer-balance"
                    v-model="balance"
                    required :pattern="balanceRegEx"> €
            </div>
            <div class="action-cell">
                <button type="button" class="btn-green" @click="onUpdate('balance')" :disabled="balanceNotValid">Valider</button>
            </div>
        </div>
        <the-modal ref="update-customer-error-modal" 
            title="Erreur" 
            type="error"
            okButtonLabel="OK">
        </the-modal>
        <the-modal ref="update-customer-update-modal" 
            title="Mise à jur effectuée" 
            okButtonLabel="OK">
        </the-modal>
    </div>
</template>


<script>
import { openModal} from './Modal.vue';
import { sendPost } from '../services/httpHelpers.js';
import { 
    regexStringFormulaForName, 
    regexStringFormulaForBalance,
    regexStringFormulaForAge,
    positiveNumberDecimalCheck,
    manageValidityMessage } from '../services/utils.js';

export default {
    data() {
        return {
            lastName: '',
            firstName: '',
            age: '',
            password: '',
            balance: '',
            nameRegEx: regexStringFormulaForName,
            balanceRegEx: regexStringFormulaForBalance,
            ageRegEx: regexStringFormulaForAge,
        }
    },
    watch: {
        firstName() {
            manageValidityMessage(
                this.$refs['update-customer-first-name'],
                `Le prénom est obligatoire et doit être au bon format.`);
        },
        lastName() {
            manageValidityMessage(
                this.$refs['update-customer-last-name'],
                `Le nom est obligatoire et doit être au bon format.`);
        },
        age() {
            manageValidityMessage(
                this.$refs['update-customer-age'],
                `L'age est un entier strictement positif.`);
        },
        balance() {
            manageValidityMessage(
                this.$refs['update-customer-balance'],
                `Le montant doit être un nombre strictement positif, avec un maximum de deux décimales.`);
        },
    },
    computed: {
        balanceNotValid() {
            return !positiveNumberDecimalCheck(Number(this.balance), 2);
        },
        passwordNotValid() {
            return this.password === '';
        },
        ageNotValid() {
            return this.age.trim() === '' || !this.$refs['update-customer-age'].validity.valid;
        },
        lastNameNotValid() {
            return this.lastName.trim() === '' || !this.$refs['update-customer-last-name'].validity.valid;
        },
        firstNameNotValid() {
            return this.firstName.trim() === '' || !this.$refs['update-customer-first-name'].validity.valid;
        },
    },
    methods: {
        onUpdate(field) {
            let item = '';
            const updatePayload = {
                customerId: this.$route.params.customerId,
                field
            };
            let toDo = true;

            switch(field) {
                case 'lastName':
                    item = 'e nom';
                    updatePayload.value = this.lastName;
                    break;
                case 'firstName':
                    item = 'e prénom';
                    updatePayload.value = this.fistName;
                    break;
                case 'age':
                    item = `'age`;
                    updatePayload.value = this.age;
                    break;
                case 'password':
                    item = 'e mot de passe';
                    updatePayload.value = this.password;
                    break;
                case 'balance':
                    item = 'e solde';
                    updatePayload.value = this.balance;
                    break;
                default:
                    toDo = false;
                    openModal(this, 'update-customer-error-modal', `Type de champ inconnu : ${field}`);
            }

            if (toDo) {
                sendPost(`https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/updateCustomer.json`, updatePayload).
                    then( response => {
                        console.log(response);
                        openModal(this, 'update-customer-update-modal', `L${item} a bien été mis à jour.`)
                    }).
                    catch( error => {
                        console.error(error);
                        openModal(this, 'update-customer-error-modal', `L'enregistrement a échoué : ${error.message}`);
                    });
            }

        }
    }
}
</script>

<style scoped>
.update-customer-area {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: calc(100% - 1rem);
    padding-top: 1rem;
    overflow-y: auto;
}

.line {
    display: flex;
    width: calc(100% - 2rem);
    height: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-top: 0.25rem;
}

.label-cell {
    display: flex;
    align-items: center;
    width: 7rem;
    height: 100%;
}

.input-cell {
    display: flex;
    align-items: center;
    height: 100%;
    flex: auto;
}

.input-cell > input[type="text"],
.input-cell > input[type="password"] {
    text-align: center;
    margin-left: 1rem;
    margin-right: 1rem;
}

.action-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 8rem;
    height: 100%;
}

</style>