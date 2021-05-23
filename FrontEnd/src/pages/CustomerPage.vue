<template>
    <div class="customer-area">
        <div class="me">
            <the-user-info title="Mon compte" :user="customer"></the-user-info>
        </div>
        <div class="functions-pannels">
            <the-panel :functions-list="functionsList"></the-panel>
        </div>
    </div>
</template>

<script>
import TheUserInfo from '../components/UserInfos.vue';
import ThePanel from '../components/Panel.vue';
import { sendGet } from '../services/httpHelpers.js'
// On importe la store ici pour pouvoir l'utiliser au niveau de la garde
// car dans beforeRouteEnter on n'a pas acces à "this" (et donc pas acces à this.$store)
import TheStore from '@/store/index.js';

export default {
    components: {
        'theUserInfo': TheUserInfo,
        'thePanel': ThePanel,
    },

    data() {
        return {
            customer: {},
            functionsList: [],
            dataError: false,
            waiting: false,

        }
    },

    computed: {
        isCustomer() {
            return this.$store.getters['isUserCustomer'];
        },

        isChild(){
            return this.$store.getters['isUserChild'];
        }
    },

    created() {
        const custId = this.$route.params.customerId;
        let url;
        const isChild = TheStore.getters['isUserChild'];
        if(isChild){
            url = `https://orsaymediatheque.herokuapp.com/api/user/childmember/${custId}`;
        }else{
            url = `https://orsaymediatheque.herokuapp.com/api/user/adultmember/${custId}`;
        }
        
        sendGet(url).
            then( response => {
                if(response.success){
                    console.log("response customerPage : ", response);
                    let userRequested = {};
                    if(isChild){
                        userRequested = {
                            firstName : response.docs.member.firstname,
                            lastName : response.docs.member.name,
                            email : response.docs.id,
                            age: Number(response.docs.age),
                            numberOfChildren: 0,
                            balance: Number(response.docs.member.balance),
                        };
                    }else{
                        userRequested = {
                            firstName: response.docs.member.firstname,
                            lastName: response.docs.member.name,
                            email: response.docs.id,
                            age : Number(response.docs.age),
                            numberOfChildren: response.docs.childlist.length,
                            balance: Number(response.docs.member.balance)
                        };
                    }
                    this.dataError = false;
                    this.waiting = false;
                    this.customer = userRequested;
                }else{
                    console.log("error in getting customer informations : ", response.message);
                }
                

                if (this.isCustomer || this.isChild) {
                    const currentFunctionLists = [];
                    currentFunctionLists.push({ title: `Liste d'emprunt`, routePath: `/customer/${custId}/borrowed`});
                    if (this.isCustomer) {
                        currentFunctionLists.push({ title: `Réapprovisioner solde`, routePath: `/customer/${custId}/balance-feed`});
                        currentFunctionLists.push({ title: `Compte(s) mineur(s)`, routePath: `/customer/${custId}/children-accounts-list`});
                    }
                    this.functionsList = currentFunctionLists;
                } else if (typeof this.$route.params.customerId !== 'undefined') {
                    const currentFunctionLists = [];
                    currentFunctionLists.push({ title: `Modifications`, routePath: `/customer/${custId}/update`});
                    currentFunctionLists.push({ title: `Emprunts`, routePath: `/customer/${custId}/borrowed`});
                    currentFunctionLists.push({ title: `Débloquer / Supprimer`, routePath: `/customer/${custId}/delete`});
                    this.functionsList = currentFunctionLists;
                } else {
                    // Cas du client qui essaie d'aller sur un autre identifiant, on le renvoie sur le sien
                    this.$router.push(`/customer/${this.$store.getters['userId']}/borrowed`);
                }
            }).
            catch( error => {
                this.dataError = true;
                this.waiting = false;
                console.error(error);
            });

    },

    beforeRouteEnter(to, _from, next) {
        // Permet de contrôler l'acces au composant. On vérifie que l'utilisateur est
        // bien connecté et que si c'est un client il n'accède qu'à ses données.
        const userId = TheStore.getters['userId'];
        const isCustomer = TheStore.getters['isUserCustomer'];
        const isChild = TheStore.getters['isUserChild'];
        const isManager = TheStore.getters['isUserManager'];
        const customerId = to.params.customerId;
        if ((isCustomer|| isChild) && customerId === userId) {
            next(true);
        } else if (isManager) {
            next(true);
        } else {
            console.error(`Navigation interdite vers ${to.fullPath} pour l'utilisateur courant.`);
            next('/accueil');
        }
    }
}
</script>

<style scoped>
.customer-area {
    display: flex;
    width: 100%;
    height: 100%;
}

.me {
    display: flex;
    height: calc(100% - 4rem);
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: calc(33% - 2rem);
    margin-left: 1rem;
    margin-right: 1rem;
}

.functions-pannels {
    display: flex;
    height: calc(100% - 6rem);
    margin-top: 4rem;
    margin-bottom: 2rem;
    width: calc(67% - 2rem);
    margin-left: 1rem;
    margin-right: 1rem;
}
</style>