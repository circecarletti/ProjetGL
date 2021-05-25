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
                <button type="button" class="btn-green" @click="onUpdate('name')" :disabled="lastNameNotValid">Valider</button>
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
                <button type="button" class="btn-green" @click="onUpdate('firstname')" :disabled="firstNameNotValid">Valider</button>
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
import { sendPut } from '../services/httpHelpers.js';
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
            console.log("firstName : ", this.firstName);
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
        password(newValue) {
            if (newValue.length < 8) {
                this.$refs['update-customer-password'].setCustomValidity(`Le mot de passe doit contenir 8 caractères au minimum.`);
            } else {
                this.$refs['update-customer-password'].setCustomValidity(``);
                this.$refs['update-customer-password'].setCustomValidity(``);
            }
            
        },
    },

    computed: {
        balanceNotValid() {
            return this.balance.trim() === '' || !positiveNumberDecimalCheck(Number(this.balance), 2);
        },
        passwordNotValid() {
            return this.password.length < 8;
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
            const custId = this.$route.params.customerId;
            const updatePayload = {
                id: custId,
            };
            let toDo = true;
            let url = '';

            switch(field) {
                case 'name':
                    item = 'lastNameItem';
                    updatePayload.name = this.lastName;
                    url = `https://orsaymediatheque.herokuapp.com/api/user/manager/updateName`;
                    break;
                case 'firstname':
                    item = 'firstNameItem';
                    console.log("firstName in update : ", this.firstName);
                    updatePayload.firstname = this.firstName;
                    url = `https://orsaymediatheque.herokuapp.com/api/user/manager/updateFirstName`;
                    break;
                case 'age':
                    item = `ageItem`;
                    updatePayload.age = this.age;
                    url = `https://orsaymediatheque.herokuapp.com/api/user/manager/updateAge`;
                    break;
                case 'password':
                    item = 'passwordItem';
                    updatePayload.password = this.password;
                    url = `https://orsaymediatheque.herokuapp.com/api/user/manager/updatePassword`;
                    break;
                case 'balance':
                    item = 'balanceItem';
                    updatePayload.balance = this.balance;
                    url = `https://orsaymediatheque.herokuapp.com/api/user/manager/modifyBalance`;
                    break;
                default:
                    toDo = false;
                    openModal(this, 'update-customer-error-modal', `Type de champ inconnu : ${field}`);
            }

            if (toDo) {
                sendPut(url, updatePayload).
                    then( response => {
                        if(response.success){
                            openModal(this, 'update-customer-update-modal', `L'item : '${item}' de l'utilisateur ${custId} a bien été mis à jour.`);
                        }else{
                            console.log(`Error in updating item ${item} of customer ${custId} : `, response.message);
                            openModal(this, 'update-customer-error-modal', `L'enregistrement a échoué`);
                        }
                    }).
                    catch( error => {
                        console.error(error);
                        openModal(this, 'update-customer-error-modal', `La modification a échoué : ${error.message}`);
                    });
            }

        }
    },

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