<template>
    <div class="resource-area">
        <div class="picture-area">
            <h3>{{title}}</h3>
            <div class="picture">
                <img class="image" :src="'/' + urlImage">
            </div>
        </div>
        <div class="text-area">
            <h4>INFORMATIONS SUR LA RESSOURCE</h4>
            <div class="line">
                <span class="label">ID</span> : {{id}}
            </div>
            <div class="line">
                <span class="label">Titre</span> : {{title}}
            </div>
            <div class="line">
                <span class="label">Auteur</span> : {{author}}
            </div>
            <div class="line">
                <span class="label">Année de sortie</span> : {{releaseDate}}
            </div>
            <div class="line">
                <span class="label">Catégorie</span> : {{cathegory}}
            </div>
            <div class="line">
                <span class="label">Type</span> : {{type}}
            </div>
            <div class="line">
                <span class="label">Résumé</span> :&nbsp;<span>{{resume}}</span>
            </div>
            <div class="line">
                <span class="label checkbox">Disponibilité sur place</span> : 
                <input type="checkbox" :checked="available" :disabled="true">
            </div>
            <div class="line">
                <span class="label">Prix de la ressource </span> : {{price}}€ 
                ({{suscriberPrice}}€ pour les abonnés) pour 30 jours.
            </div>
            <div class="line actions">
                <button type="button" @click="goBack()">Retour</button>
                <button type="button" v-if="userIsCustomerOrChild && available" @click="borrow">Emprunter</button>
                <button type="button" v-if="userIsManager" @click="deleteItem">Supprimer</button>
            </div>
        </div>
        <the-modal ref="resource-error-modal" 
            title="Erreur" 
            okButtonLabel="OK"
            type="error">
        </the-modal>
        <the-modal ref="resource-success-modal" 
            title="Mise à jour effectuée" 
            okButtonLabel="OK"
            @okClose="goBack">
        </the-modal>
    </div>
</template>

<script>
import {sendDelete, sendGet, sendPut} from '../services/httpHelpers.js';
import { openModal } from '../components/Modal.vue';

export default {
    data() {
        return {
            waiting: true,
            dataError: false,
            id: 0,
            title: '',
            urlImage: '',
            type: '',
            price: '',
            resume: '',
            author: '',
            releaseDate: 0,
            available: false,
            cathegory: ''
        };
    },

    computed: {
        suscriberPrice(){
            if(this.price){
                return Math.floor(this.price*0.7);
            }else{
                return 0;
            }
        },
        userIsCustomerOrChild() {
            return this.$store.getters['isUserCustomer'] || this.$store.getters['isUserChild'];
        },
        userIsManager() {
            return this.$store.getters['isUserManager'];
        }
    },

    
    methods: {

        translateType(type){
            switch (type){
                case 'book': 
                    return 'livre';
                case 'dvd' :
                    return 'DVD';
                case 'cd' : 
                    return 'CD';
                case 'videogames' : 
                    return 'Jeux Videos'; 
                default :
                    return 'inconnu';
            }
        },

        translateCategory(cat){
            switch (cat){
                case 'child': 
                    return 'enfant';
                case 'adult' :
                    return 'adulte';
                case 'allpublic' : 
                    return 'tous public';
                default : 
                    return 'inconnu'; 
            }
        },

        goBack() {
            this.$router.back();
        },

        borrow() {
            if (this.available) {
                const borrowSend = {
                    id : this.$store.getters['userId'],
                    idresource : this.id,
                }

                let url = '';
                if(this.$store.getters['isUserChild']){
                    sendGet(`https://orsaymediatheque.herokuapp.com/jwtidChild`);
                    url = 'https://orsaymediatheque.herokuapp.com/api/user/childmember/rentResource';
                }else{
                    sendGet('https://orsaymediatheque.herokuapp.com/jwtidAdult');
                    url = 'https://orsaymediatheque.herokuapp.com/api/user/adultmember/rentResource';
                }
                sendPut(url, borrowSend).
                    then( response => {
                        if(response.success){
                            openModal(this, 'resource-success-modal', 'Ressource empruntée.');
                            this.goBack();
                        }else{
                            console.log("Error in borrowing resource : ", response.message);
                            openModal(this, 'resource-error-modal', 'Titre indisponible');
                        }
                    }).catch( error => {
                        this.dataError = true;
                        this.waiting = false;
                        console.error(error);
                    });
            } else {
                openModal(this, 'resource-error-modal', 'Titre indisponible');
            }
        },

        deleteItem() {
            sendGet(`https://orsaymediatheque.herokuapp.com/jwtidManager`).then(()=>{
                return sendDelete(`https://orsaymediatheque.herokuapp.com/api/user/manager/deleteResource/${this.id}`);
            }).then(response => {
                    if(response.success){
                        openModal(this, 'resource-success-modal', 'La ressource a bien été supprimé.');
                            this.dataError = false;
                    }else{
                        console.log("Error in deleting ressources", response.message);
                        openModal(this, 'resource-error-modal', "La ressource n'a pas pu être supprimé.");
                        this.dataError = true;
                    }
                    this.waiting = false;
                }).catch( error => {
                            this.dataError = true;
                            this.waiting = false;
                            console.error(error);
                        });
        }
    },


    created() {
        this.id = Number.parseInt(this.$route.params['resourceId']);
        this.waiting = true;
        sendGet(`https://orsaymediatheque.herokuapp.com/api/resource/${this.id}`).
            then( response => {
                if(response.success){
                    console.log("ressource : ", response);
                    const resource = response.docs;
                    this.dataError = false;
                    this.waiting = false;

                    this.price = resource.price;
                    this.id= resource.id;
                    this.title= resource.title;
                    this.urlImage= resource.picture;
                    this.type= this.translateType(resource.type);
                    this.resume= resource.resume;
                    this.synopsis = resource.synopsis;
                    this.author= resource.author;
                    this.releaseDate= resource.releasedate;
                    this.available= !resource.loan;
                    this.cathegory= this.translateCategory(resource.category);
                }else{
                    console.log("Error in getting ressource : ", response.message);
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
.resource-area {
    display: flex;
    width: 100%;
    height: 100%;
}

.picture-area {
    display: flex;
    width: 33%;
    height: 100%;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    padding-left: 10%;
    padding-right: 10%;
}

.image {
    width: 60%;
    height: auto;
    max-height: 85%
}

.text-area {
    display: flex;
    height: 100%;
    width: 64%;
    flex-flow: column;
    align-items: center;
    justify-content: space-evenly;
}

.line {
    display: flex;
    width: calc(100% - 4rem);
    margin-left: 2rem;
    margin-right: 2rem;
}

.line.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem;
}

.label {
    color: pink;
    margin-right: 0.25rem;
}
</style>