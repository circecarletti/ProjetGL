<template>
    <div class="borrowed-list-area"> 
        <div class="display-area" v-if="!waiting">
            <span>Liste d'emprunts :</span>
            <div class="error-area" v-if="(dataError || borrowedItems.length === 0) && !waiting">
                <span>Aucune</span><br>
                <span>donnée</span><br>
                <span>disponible</span><br>
            </div>
            <div class="list-area" v-else>
                <ul>
                    <li v-for="item in borrowedItems" :key="item">
                        <div class="line">
                            <span>{{item.title}} ({{item.year}}), {{item.author}}</span>
                            <button type="button" class="btn-green" @click="onRemove(item.id)" v-if="isManager">Retirer</button>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="borrow-area" v-if="isManager">
                <form @submit.prevent="onBorrowItem">
                    <div class="line">
                        <span>Identifiant de la ressource à emprunter :</span>
                        <input type="text" 
                            name="itemIdToBorrow" 
                            ref="itemIdToBorrow"
                            v-model="itemIdToBorrow"
                            required pattern="^[1-9][0-9]*">
                        <button class="btn-green" :disabled="!isIdValidToBorrow">Valider</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="waiting-area" v-if="waiting">
            <the-spinner></the-spinner>
        </div>
        <the-modal ref="borrowed-list-error-modal" 
            title="Erreur" 
            okButtonLabel="OK"
            type="error">
        </the-modal>
    </div>
</template>


<script>
import { sendGet, sendPost } from '../services/httpHelpers.js'
import { openModal} from './Modal.vue';

export default {
    data() {
        return {
            borrowedItems: [],
            dataError: false,
            waiting: false,
            itemIdToBorrow: '',
        }
    },
    computed: {
        isManager() {
            return this.$store.getters['isUserManager'];
        },
        isIdValidToBorrow() {
            return this.itemIdToBorrow.trim() !== '' && this.$refs['itemIdToBorrow'].validity.valid;
        }
    },
    methods: {
        onRemove(borrowedId) {
            const customerId = this.$route.params.customerId;
            const removePayload = {
                customerId,
                itemId: borrowedId
            };
           // A FAIRE : appeler le bon service de retrait d'un ouvrage de la liste d'emprunt
            sendPost('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/removeBorrowed.json', removePayload).
                then( response => {
                    console.log(response);
                    // Si tout est ok, on n'a plus qu'à retirer l'objet de la liste
                    this.borrowedItems = this.borrowedItems.filter(item => item.id !== borrowedId);
                }).
                catch( error => {
                    console.error(error);
                    openModal(this, 'borrowed-list-error-modal', `Echec de la restitution de l'emprunt ${borrowedId}`);
                });
        },
        onBorrowItem() {
            if (this.isIdValidToBorrow) {
                const customerId = this.$route.params.customerId;
                const borrowPayload = {
                    customerId,
                    itemId: Number(this.itemIdToBorrow)
                };
                // A FAIRE : appeler le bon service d'emprunt d'un ouvrage
                sendPost('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/borrowResource.json', borrowPayload).
                    then( response => {
                        console.log(response);
                        // Si tout est ok, on n'a plus qu'à ajouter l'objet de la liste,
                        // la réponse doit renvoyer toutes les informations de la ressource
                        // Sinon, il faut faire un autre appel au serveur pour les avoir, 
                        // mais c'est pas terrible
                        // Là, à part pour l'id, on met des données DUMMY
                        this.borrowedItems.push({
                            id: this.itemIdToBorrow,
                            title: `On vient d'emprunter`,
                            year: 666,
                            author: `Mohâ !!!`
                        });
                    }).
                    catch( error => {
                        console.error(error);
                        openModal(this, 'borrowed-list-error-modal', `L'emprunt de la ressouce ${this.itemIdToBorrow} n'a put être effectué : ${error.message}`);
                    });

            }
        }
    },
    mounted() {
        // const custId = this.$route.params.customerId;
        // ICI APPEL du service serveur qui retourne la liste des livres/films
        // empruntés en fonction de l'identifiant du client
        //La valorisation du tableau des éléments empruntés se fait dans le "then"
        // de la promise
        this.waiting = true;
        sendGet('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/stock.json').
            then( response => {
                // DUMMY le filtre est fait ici mais normalement le back ne doit renvoyer
                // QUE les ouvrages empruntés.
                const items = response.filter( item => item.id === 1002 || item.id === 1009 || item.id === 1012 );
                this.borrowedItems = items.map( fullItem => {
                        return { id: fullItem.id, title: fullItem.titre, year: fullItem.annee, author: fullItem.auteur };
                    });
                this.dataError = false;
                this.waiting = false;
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
.borrowed-list-area {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.error-area {
    display: flex;
    flex-flow: column;
    flex: auto;
    justify-content: center;
    align-items: center;
    margin: 1rem;
    padding-bottom: 2rem;
    font-size: 1.2rem;
}

.display-area {
    display: flex;
    flex-flow: column;
    padding-top: 1rem;
    padding-bottom: 1rem;
    height: calc(100% - 2rem);
    width: calc(100% - 2rem);
    padding-left: 1rem;
    padding-right: 1rem;
    overflow-y: auto;
}

.list-area {
    display: flex;
    flex-flow: column;
    flex: auto;
}

.waiting-area {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
}

.line {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
}

.borrow-area {
    display: flex;
    width: 100%;
    height: 2rem;
    align-items: center;
}

.borrow-area input[type="text"] {
    text-align: center;
    max-width: 8rem;
    margin-left: 2rem;
    margin-right: 2rem;
}
</style>