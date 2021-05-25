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
                            <span>{{item.title}} ({{item.releaseDate}}), {{item.author}}</span>
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
import { sendGet, sendPut } from '../services/httpHelpers.js'
import { openModal} from './Modal.vue';

export default {
    data() {
        return {
            customerStatus: '',
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
        },
    },

    methods: {
        onRemove(borrowedId) {
            const customerId = this.$route.params.customerId;
            const removePayload = {id : customerId, idresource : borrowedId};
            sendPut('https://orsaymediatheque.herokuapp.com/api/user/manager/removeResourceToMember', removePayload).
                then( response => {
                        console.log(response);
                    if(response.success){
                        console.log(response);
                        this.borrowedItems = this.borrowedItems.filter(item => item.id !== borrowedId);
                    }else{
                        console.log("Error in unborrowing ressource : ", response.message);
                    }
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
                    id : customerId,
                    idresource: Number(this.itemIdToBorrow)
                };
                // Si tout est ok, on n'a plus qu'à ajouter l'objet de la liste
                sendPut('https://orsaymediatheque.herokuapp.com/api/user/manager/addResourceToMember', borrowPayload).
                    then( response => {
                        console.log(response);
                        if(response.success){
                            this.borrowedItems.push({
                            id: this.itemIdToBorrow,
                            title: response.resource.title,
                            releaseDate: response.resource.releasedate,
                            author: response.resource.author
                        });
                        }else{
                            console.log("Error in adding ressource to member : ", response.message);
                        }
                        
                    }).
                    catch( error => {
                        console.error(error);
                        openModal(this, 'borrowed-list-error-modal', `L'emprunt de la ressouce ${this.itemIdToBorrow} n'a put être effectué : ${error.message}`);
                    });

            }
        },

    },

    mounted() {
        this.waiting = true;
        const userId = this.$route.params.customerId;
        sendGet(`https://orsaymediatheque.herokuapp.com/api/user/manager/getUserInfoById/${userId}`).
            then( response => {
                // console.log("response to getting customer info : ", response);
                if(response.success){
                    this.customerStatus = (response.docs.member.statut).trim();
                    // console.log("response of getting status of user info by id : ", this.customerStatus);
                    
                    let url = '';
                    if(this.isManager){
                        url = `https://orsaymediatheque.herokuapp.com/api/user/manager/getUserLoanInfo/${userId}`;
                    }else{
                        url = `https://orsaymediatheque.herokuapp.com/api/user/${this.customerStatus}/loanInfo/${userId}`;
                    }
                    return  sendGet(url);
                }else{
                    console.log("error in getting customer informations : ", response.message);
                    this.customerStatus = 'undefinedStatus';
                }
            }).then( response => {
                console.log("list of items : ", response);
                if(response.success){
                    const listOfResources = response.docs.member.loan.idresources;
                    console.log("liste d'emprunts : ", listOfResources);
                    const items = listOfResources.map( fullItem => {
                        return { id: fullItem.id, title: fullItem.title, releaseDate: fullItem.releasedate, author: fullItem.author };
                    });
                    this.borrowedItems = items;
                    this.dataError = false;
                    this.waiting = false;
                }else{
                    console.log("Error in getting borrowed list : ", response.message);
                }
            }).
            catch( error => {
                this.dataError = true;
                this.waiting = false;
                console.error(error);
            });
            
    }, 

    
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