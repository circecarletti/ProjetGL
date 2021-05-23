<template>
    <div class="delete-customer-area"> 
        <div class="top">
            <button type="button" class="btn-green" @click="onRelease">Débloquer l'adhérent</button>
        </div>
        <div class="bottom">
            <button type="button" class="btn-red" @click="onDelete">Supprimer l'adhérent</button>
        </div>
        <the-modal 
            ref="delete-customer-confirmation-modal" 
            title="Suppression de l'adhérent" 
            type="warning"
            okButtonLabel="Supprimer"
            cancelButtonLabel="Annuler"
            @okClose="deleteCustomer">
        </the-modal>
        <the-modal 
            ref="update-delete-update-modal" 
            title="Mise à jour effectuée" >
        </the-modal>
        <the-modal 
            ref="update-delete-error-modal" 
            type="error"
            title="Erreur de mise à jour" >
        </the-modal>
    </div>
</template>


<script>
import { openModal } from './Modal.vue';
import { sendPost } from '../services/httpHelpers.js';

export default {
    methods: {
        onRelease() {
            const releasePayload = { customerId: this.$route.params.customerId };

            sendPost(`https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/releaseCustomer.json`, releasePayload).
                then( response => {
                    console.log(response);
                    openModal(this, 'update-delete-update-modal', `L'adhérent a bien été débloqué.`);
                }).
                catch( error => {
                    console.error(error);
                    openModal(this, 'update-delete-error-modal', `L'adhérent n'a pas pu être débloqué : ${error.message}`);
                });
        },
        onDelete() {
            openModal(this, 'delete-customer-confirmation-modal', 
                'Etes vous sûr de vouloir supprimer cet adhérent ?');
        },
        deleteCustomer() {
            const deletePayload = { customerId: this.$route.params.customerId };

            sendPost(`https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/deleteCustomer.json`, deletePayload).
                then( response => {
                    console.log(response);
                    const userId = this.$store.getters['userId'];
                    this.$router.push(`/manager/${userId}/add-customer`);
                }).
                catch( error => {
                    console.error(error);
                    openModal(this, 'update-delete-error-modal', `L'adhérent n'a pas pu être supprimé : ${error.message}`);
                });
        }
    }
}
</script>

<style scoped>
.delete-customer-area {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
}

.top,
.bottom {
    display: flex;
    width: 100%;
    height: 50%;
    justify-content: center;
    align-items: center;
}

</style>
