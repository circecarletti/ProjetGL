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
        }
    },
    created() {
        const custId = Number.parseInt(this.$route.params.customerId);
        // Ici normalement, on appelle le service qui renvoie les données
        // d'un utilisateur en fonction de son id
        // Donnee dummy valorisées dans le "then", comme la partie 
        // qui définie les fonctionalités utilisables.
        sendGet('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/users.json').
            then( response => {
                // DUMMY le filtre est fait ici mais normalement le back ne doit renvoyer
                // QUE les ouvrages empruntés.
                const customer = response.find( user => user.id === custId );

                const userRequested = {
                    id: customer.id,
                    firstName: customer.prenom,
                    lastName: customer.nom,
                    email: customer.email,
                    age: customer.age,
                    numberOfChildren: customer.nbenfant,
                    balance: customer.solde,
                    status: customer.status,
                };
                this.dataError = false;
                this.waiting = false;
                this.customer = userRequested;

                if (this.isCustomer) {
                    const currentFunctionLists = [];
                    currentFunctionLists.push({ title: `Liste d'emprunt`, routePath: `/customer/${custId}/borrowed`});
                    if (userRequested.age >= 18) {
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
        const isManager = TheStore.getters['isUserManager'];
        const customerId = Number.parseInt(to.params.customerId);
        if (isCustomer && customerId === userId) {
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