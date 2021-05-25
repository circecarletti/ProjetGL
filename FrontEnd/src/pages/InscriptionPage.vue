<template>
    <div class="inscription-area">
        <div class="edition-area">
            <div class="title">
                Inscription
            </div>
            <form @submit.prevent="subscribe">
                <div class="line">
                    <label for="inscription-lastname-id">Saisissez votre nom :</label>
                    <input 
                        type="text" 
                        id="inscription-lastname-id" 
                        name="lastName" 
                        ref="lastName"
                        required 
                        :pattern="nameValidationRegExFormula"
                        v-model="lastName">
                    <span></span>
                </div>
                <div class="line">
                    <label for="inscription-firstname-id">Saisissez votre prénom :</label>
                    <input 
                        type="text" 
                        id="inscription-firstname-id" 
                        name="firstName" 
                        ref="firstName" 
                        required
                        :pattern="nameValidationRegExFormula"
                        v-model="firstName">
                    <span></span>
                </div>
                <hr>
                <div class="line">
                    <label for="inscription-age-id">Saisissez votre age :</label>
                    <input 
                        type="text" 
                        id="inscription-age-id" 
                        name="age" 
                        ref="age" 
                        required 
                        :pattern="ageValidationRegExFormula"
                        v-model="age">
                    <span></span>
                </div>
                <div class="line">
                    <label for="inscription-email-id">Saisissez votre email (futur identifiant) :</label>
                    <input 
                        type="email" 
                        id="inscription-email-id" 
                        name="email" 
                        ref="email" 
                        required
                        v-model="email">
                    <span></span>
                </div>
                <hr>
                <div class="line">
                    <label for="inscription-password-id">Saisissez votre mot de passe :</label>
                    <input 
                        type="password" 
                        id="inscription-password-id" 
                        name="password" 
                        ref="password" 
                        required
                        v-model="password">
                    <span></span>
                </div>
                <div class="line">
                    <label for="inscription-password-confirm-id">Confirmez votre mot de passe :</label>
                    <input 
                        type="password" 
                        id="inscription-password-confirm-id" 
                        name="passwordConfirm" 
                        ref="passwordConfirm" 
                        required
                        v-model="passwordConfirm">
                    <span></span>
                </div>
                <hr>
                <div class="line action">
                    <button type="button" @click="endSubscription">Annuler</button>
                    <button type="submit">Valider</button>
                </div>
            </form>
        </div>
    </div>
    <the-modal ref="theModalSuccess" 
        title="Inscription réussie" 
        okButtonLabel="OK"
        @okClose="endSubscription">
    </the-modal>
    <the-modal 
        ref="theModalFail" 
        title="Erreur" 
        type="error"
        okButtonLabel="OK">
        <div style="display: flex; flex: auto; justify-content: center; align-items: center; flex-flow: column">
            <p>Votre inscription n'a put être effectuée en raison de l'erreur suivante :</p>
            <p>{{errorMsg}}</p>
        </div>
    </the-modal>

</template>

<script>
import { sendPost } from '../services/httpHelpers.js';
import { openModal } from '../components/Modal.vue';
import { regexStringFormulaForName, regexStringFormulaForAge, manageValidityMessage } from '../services/utils.js';

export default {
    data () {
        return {
            firstName: '',
            firstNameElement: undefined,
            lastName: '',
            lastNameElement: undefined,
            age: undefined,
            ageElement: undefined,
            email: '',
            emailElement: undefined,
            password: '',
            passwordElement: undefined,
            passwordConfirm: '',
            passwordConfirmElement: undefined,
            nameValidationRegExFormula: regexStringFormulaForName,
            ageValidationRegExFormula: regexStringFormulaForAge,
            errorMsg: ''
        }
    },

    computed: {
    },

    methods: {

        endSubscription() {
            this.$router.push('/accueil');
        },

        subscribe() {
            this.errorMsg = '';
            const newCustomer = {
                firstname: this.firstName,
                name: this.lastName,
                age: this.age,
                id: this.email,
                password: this.password,
                passwordConfirm: this.passwordConfirm,
                balance : 0
            };

            sendPost('https://orsaymediatheque.herokuapp.com/api/users/register', newCustomer)
                .then( response => {
                    console.log(response);
                    openModal(this, 'theModalSuccess', `Votre inscription s'est correctement déroulée.`)
                }).catch( error => {
                    console.error(error);
                    this.errorMsg = error.message;
                    openModal(this, 'theModalFail');
                });
        }
    },


    watch: {
        lastName() {
            manageValidityMessage(
                this.lastNameElement,
                `Le nom est obligatoire et ne doit pas comporter d'espace avant ou après.`);
        },
        
        firstName() {
            manageValidityMessage(
                this.firstNameElement,
                `Le prénom est obligatoire et ne doit pas comporter d'espace avant ou après.`);
        },

        age(newValue) {
            manageValidityMessage(
                this.ageElement,
                `L'age est obligatoire et doit être positif.`);
            if (Number(newValue) < 18) {
                this.ageElement.setCustomValidity(`Vous devez être majeur pour vous inscrire depuis cette page. Si vous êtes mineur, votre responsable légal doit vous inscrire depuis la page de son compte.`);
            }
        },

        email() {
            manageValidityMessage(
                this.emailElement,
                `L'email est obligatoire et doit être au bon format.`);
        },

        password(newValue) {
            if (newValue === '' || newValue !== this.passwordConfirm) {
                this.passwordElement.setCustomValidity(`Le mot de passe est obligatoire et doit être égal à sa confirmation.`);
            } else if (newValue.length < 8) {
                this.passwordElement.setCustomValidity(`Le mot de passe doit contenir 8 caractères au minimum.`);
            } else {
                this.passwordElement.setCustomValidity(``);
                this.passwordConfirmElement.setCustomValidity(``);
            }
        },

        passwordConfirm(newValue) {
            if (newValue === '' || newValue !== this.password) {
                this.passwordConfirmElement.setCustomValidity(`La confirmation du mot de passe est obligatoire et doit être égale à l'originel.`);
            }else if (newValue.length < 8) {
                this.passwordElement.setCustomValidity(`Le mot de passe doit contenir 8 caractères au minimum.`);
            } else {
                this.passwordElement.setCustomValidity(``);
                this.passwordConfirmElement.setCustomValidity(``);
            }
        },
    },

    
    mounted() {
        this.lastNameElement = this.$refs['lastName'];
        this.firstNameElement = this.$refs['firstName'];
        this.ageElement = this.$refs['age'];
        this.emailElement = this.$refs['email'];
        this.passwordElement = this.$refs['password'];
        this.passwordConfirmElement = this.$refs['passwordConfirm'];
    }
}
</script>

<style scoped>

.inscription-area {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.edition-area {
    display: flex;
    flex-flow: column;
    width: 60%;
    max-width: 500px;
    min-width: 150px;
    height: 80%;
    border-radius: 0.5rem;
    background-color: pink;
    align-items: stretch;
    justify-content: space-evenly;
}

.title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bolder;
}

.line {
    display: flex;
    flex-flow: column;
    width: calc(100% - 2rem);
    margin: 1rem;
}

.line.action {
    display: flex;
    flex-flow: row;
    flex: auto;
    justify-content: space-between;
    align-items: baseline;
    width: calc(100% - 2rem);
}

</style>