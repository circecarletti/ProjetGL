<template>
    <div class="resource-area">
        <div class="picture-area">
            <h3>{{title}}</h3>
            <img :src="'/' + url" class="image">
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
                <span class="label">Année de sortie</span> : {{year}}
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
            <div class="line actions">
                <button type="button" @click="goBack()">Retour</button>
                <button type="button" v-if="userIsCustomer && available" @click="borrow">Emprunter</button>
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
import {sendGet} from '../services/httpHelpers.js';
import { openModal } from '../components/Modal.vue';

export default {
    data() {
        return {
            waiting: true,
            dataError: false,
            id: 0,
            title: '',
            url: '',
            type: '',
            resume: '',
            author: '',
            year: 0,
            available: false,
            cathegory: ''
        };
    },
    computed: {
        userIsCustomer() {
            return this.$store.getters['isUserCustomer'];
        },
        userIsManager() {
            return this.$store.getters['isUserManager'];
        }
    },

    
    methods: {
        goBack() {
            this.$router.back();
        },

        borrow() {
            if (this.available) {
                // ICI APPELER le service côté serveur, permettant d'emprunter
                // et dans le "then" de la promise faire
                this.goBack();
                // Dans le catch de la promise, il faut juste afficher le message
                // d'erreur en provenance du serveur
                // openModal(this, 'resource-error-modal', 'Le message en provenance du serveur');
            } else {
                openModal(this, 'resource-error-modal', 'Titre indisponible');
            }
        },

        deleteItem() {
            // Appeler ici le service de suppression et dans le then de la promise, faire
            openModal(this, 'resource-success-modal', 'Le titre a bien été supprimé.');
            // Dans le catch de la promise, il faut juste afficher le message
            // d'erreur en provenance du serveur
            // openModal(this, 'resource-error-modal', 'Le message en provenance du serveur');
        }
    },


    created() {
        this.id = Number.parseInt(this.$route.params['resourceId']);
        this.waiting = true;
        sendGet('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/stock.json').
            then( response => {
                // DUMMY le filtre est fait ici mais normalement le back ne doit renvoyer
                // on récupère la resource dont on a reçu l'identifiant en parametre.
                // Il FAUT CHANGER ça quand l'api côté serveur sera prète, c'est au serveur back-end
                // de filtrer les donnnées en fonction de l'appel reçu.
                const resource = response.find( aResource => aResource.id === this.id);
                this.dataError = false;
                this.waiting = false;

                this.id= resource.id;
                this.title= resource.titre;
                this.url= resource.url;
                this.type= resource.type;
                this.resume= resource.synopsis;
                this.author= resource.auteur;
                this.year= resource.annee;
                this.available= resource.disponible;
                this.cathegory= resource.categorie;
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
    width: 80%;
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