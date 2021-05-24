<template>
    <div class="add-customer-area">
        <div class="line">
            <div class="label-cell">
                <span>Nom :</span>
            </div>
            <div class="input-cell">
                <input type="text"
                    ref="add-customer-last-name"
                    v-model="lastName"
                    required :pattern="nameRegEx">
            </div>
        </div>
        <div class="line">
            <div class="label-cell">
                <span>Prénom :</span>
            </div>
            <div class="input-cell">
                <input type="text"
                    ref="add-customer-first-name"
                    v-model="firstName"
                    required :pattern="nameRegEx">
            </div>
        </div>
        <div class="line">
            <div class="label-cell">
                <span>Email :</span>
            </div>
            <div class="input-cell">
                <input type="text"
                    ref="add-customer-email"
                    v-model="email"
                    required :pattern="emailRegEx">
            </div>
        </div>
        <div class="line">
            <div class="label-cell">
                <span>Age :</span>
            </div>
            <div class="input-cell">
                <input type="text"
                    ref="add-customer-age"
                    v-model="age"
                    required :pattern="ageRegEx">
            </div>
        </div>
        <div class="line">
            <div class="label-cell">
                <span>Mot de passe :</span>
            </div>
            <div class="input-cell">
                <input type="password"
                    ref="add-customer-password"
                    v-model="password"
                    required>
            </div>
        </div>
        <div class="line">
            <div class="label-cell">
                <span>Solde :</span>
            </div>
            <div class="input-cell">
                <input type="text"
                    ref="add-customer-balance"
                    v-model="balance"
                    required :pattern="balanceRegEx"> €
            </div>
        </div>
        <div class="line">
            <div class="action-cell">
                <button type="button" class="btn-green" @click="onCreate" :disabled="invalidData">Valider</button>
            </div>
        </div>
        <the-modal ref="add-customer-error-modal" 
            title="Erreur" 
            type="error"
            okButtonLabel="OK">
        </the-modal>
        <the-modal ref="add-customer-create-modal" 
            title="Création effectuée" 
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
            email: '',
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
                this.$refs['add-customer-first-name'],
                `Le prénom est obligatoire et doit être au bon format.`);
        },
        lastName() {
            manageValidityMessage(
                this.$refs['add-customer-last-name'],
                `Le nom est obligatoire et doit être au bon format.`);
        },
        email() {
            manageValidityMessage(
                this.$refs['add-customer-email'],
                `L'email' est obligatoire et doit être au bon format.`);
        },
        age() {
            manageValidityMessage(
                this.$refs['add-customer-age'],
                `L'age est un entier strictement positif.`);
        },
        balance() {
            manageValidityMessage(
                this.$refs['add-customer-balance'],
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
            return this.age.trim() === '' || !this.$refs['add-customer-age'].validity.valid;
        },
        lastNameNotValid() {
            return this.lastName.trim() === '' || !this.$refs['add-customer-last-name'].validity.valid;
        },
        firstNameNotValid() {
            return this.firstName.trim() === '' || !this.$refs['add-customer-first-name'].validity.valid;
        },
        invalidData() {
            return this.balanceNotValid || this.passwordNotValid || this.ageNotValid ||
                    this.lastNameNotValid || this.firstNameNotValid;
        }
    },

    methods: {
        onCreate() {

            if (!this.invalidData) {
                const newCustomer = {
                    id: this.email,
                    firstname: this.firstName,
                    name: this.lastName,
                    age: this.age,
                    password: this.password,
                    balance : this.balance
                };

                sendPost('https://orsaymediatheque.herokuapp.com/api/users/register', newCustomer).
                    then( response => {
                        console.log(response);
                        this.lastName = '';
                        this.firstName = '';
                        this.email = '';
                        this.age = '';
                        this.password = '';
                        this.balance = '';
                        openModal(this, 'add-customer-create-modal', `Création du nouvel adhérent effectuée.`)
                    }).
                    catch( error => {
                        console.error(error);
                        this.errorMsg = error.message;
                        openModal(this, 'add-customer-error-modal', `Echec de la création du nouvel adhérent: ${error.message}`);
                    });
            } else {
                openModal(this, 'add-customer-error-modal', `Les données de création ne sont pas valides.`);
            }
        }
    }
}
</script>

<style scoped>
.add-customer-area {
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
    justify-content: flex-end;
    width: 100%;
    height: 100%;
}

</style>