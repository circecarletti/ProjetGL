<template>
    <div class="connexion-area">
        <div class="form-area">
            <form @submit.prevent="onSubmit">
                <div class="title">
                    <span>Veuillez vous connecter</span>
                </div>
                <div class="edit-area">
                    <div class="line">
                        <label for="identifier-id">Identifiant (email)</label>
                        <input 
                            type="email" 
                            name="email" 
                            ref="email" 
                            required
                            v-model="email">
                    </div>
                    <div class="line">
                        <label for="password-id">Mot de passe</label>
                        <input 
                            type="password" 
                            name="password" 
                            ref="password" 
                            required
                            v-model="password">
                    </div>
                </div>
                <div class="action-area">
                    <div class="left">
                        <button type="button" @click="onCancel">Annuler</button>
                    </div>
                    <div class="right">
                        <button type="submit">Valider</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <the-modal ref="theModalLogginFailed" 
        title="Echec de la connexion" 
        type="error"
        okButtonLabel="OK"
        @ok-close="goToConnexion">
    </the-modal>
</template>

<script>
import { sendPost } from '../services/httpHelpers.js';
import { openModal } from '../components/Modal.vue';

export default {

    data() {
        return {
            email: '',
            emailElement: undefined,
            password: '',
            passportElement: undefined,
        };
    },


    watch: {
        email() {
            if (this.emailElement) {
                this.emailElement.setCustomValidity('');
                this.emailElement.checkValidity();
                if (!this.emailElement.validity.valid) {
                    this.emailElement.setCustomValidity(
                        `Votre identifiant doit être au format email.`
                    );
                }
            }
        },
        
        password(newValue) {
            if (newValue === '') {
                this.passportElement.setCustomValidity(`Le mot de passe est obligatoire pour se connecter.`);
            } else {
                this.passportElement.setCustomValidity(``);
            }
        },
    },


    methods: {
        onCancel() {
            this.$router.push('/accueil');
        },

        onSubmit() {
            this.errorMsg = '';
            const credentials = {
                id: this.email,
                password: this.password,
            };

            // service d'authentification
            sendPost('https://orsaymediatheque.herokuapp.com/api/users/login', credentials).
                then( response => {
                    if(response.success){
                        this.$store.dispatch('setUserId', this.email);

                        if(response.statut==="manager"){
                            this.$store.dispatch('setUserAsManager');
                        }else if(response.statut==="adultmember"){
                            this.$store.dispatch('setUserAsCustomer');
                        }else if(response.statut==="childmember"){
                            this.$store.dispatch('setUserAsChild');
                        }

                        this.$store.dispatch('setUserToken', response.token);
                        
                        this.$router.push('/accueil');
                    }else{
                        console.log("error in loging in : ", response.message);
                        if(response.message === 'user is block please contact manager'){
                            openModal(this, 'theModalLogginFailed', 'Votre compte est bloqué, veuillez contacter un manager pour vous débloquer.');
                        }else{
                            openModal(this, 'theModalLogginFailed', 'La connexion à échouée, vérifier votre identifiant et mot de passe.');
                        }
                    }
                }).
                catch( error => {
                    console.error(error);
                    openModal(this, 'theModalLogginFailed', `La connexion n'a put être effectuée.`);
                });

        },

        goToConnexion(){
            this.$router.push('/connexion');
        }
    },


    mounted() {
        this.emailElement = this.$refs['email'];
        this.passportElement = this.$refs['password'];
    }
}
</script>

<style scoped>
.connexion-area {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.form-area {
    display: flex;
    width: 40%;
    min-width: 20rem;
    height: 50%;
    min-height: 15rem;
    background-color: pink;
    border: solid 1px black;
    border-radius: 5px;
}

form {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
}

.title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex: auto;
}

.edit-area {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 70%;
    justify-content: center;
    align-items: center;
}

.line {
    display: flex;
    flex-flow: column;
    width: calc(100% - 4rem);
    height: 3rem;
    margin-left: 1rem;
    margin-right: 1rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    justify-content: center;
    padding-left: 2rem;
    padding-right: 2rem;
}
.action-area {
    display: flex;
    height: 3rem;
    width: 100%;
    justify-content: center;
    align-items: center;
}

.left,
.right {
    display: flex;
    height: 100%;
    width: calc(50% - 2rem);
    align-items: center;
}

.left {
    justify-content: left;
    padding-left: 2rem;
}

.right {
    justify-content: right;
    padding-right: 2rem;
}

</style>