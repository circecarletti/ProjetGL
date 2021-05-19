<template>
    <div class="manager-area">
        <div class="search-area">
            <div class="resource">
                <a-small-search 
                    title="Ressource"
                    :data="resourceResults"
                    @searchCriteria="onSearchResource" 
                    :searching="searchingResources"
                    ref="resource-small-search">
                </a-small-search>
            </div>
            <div class="customers">
                <a-small-search 
                    title="Adhérent"
                    :data="customersResult"
                    @searchCriteria="onSearchCustomers" 
                    :searching="searchingCustomers"
                    ref="customers-small-search">
                </a-small-search>
            </div>
        </div>
        <div class="management-area">
            <div class="me">
                <the-user-info title="Mon compte" :user="manager"></the-user-info>
            </div>
            <div class="functions-pannels">
                <the-panel :functions-list="functionsList"></the-panel>
            </div>
        </div>
        <the-modal ref="manager-error-modal" 
            title="Erreur" 
            okButtonLabel="OK"
            type="error">
        </the-modal>
    </div>
</template>

<script>
import ASmallSearch from '../components/SmallSearch.vue';
import TheUserInfo from '../components/UserInfos.vue';
import ThePanel from '../components/Panel.vue';

// On importe la store ici pour pouvoir l'utiliser au niveau de la garde
// car dans beforeRouteEnter on n'a pas acces à "this" (et donc pas acces à this.$store)
import TheStore from '@/store/index.js';
import { sendGet } from '../services/httpHelpers.js';
import { openModal } from '../components/Modal.vue';

export default {
    components: {
        'a-small-search': ASmallSearch,
        'the-panel': ThePanel,
        'the-user-info': TheUserInfo,
    },
    data() {
        return {
            resourceResults: [],
            customersResult: [],
            searchingCustomers: false,
            searchingResources: false,
            manager: undefined,
            functionsList: [],
        };
    },
    methods: {
        onSearchResource(searchCriteria) {
            const resourceId = Number(searchCriteria.simpleCriteria);
            const resourceName = searchCriteria.simpleCriteria;
            let criteria = {};
            if (Number.isInteger(resourceId)) {
                criteria.id = resourceId;
            } else if (typeof resourceName === 'string' && resourceName.trim() !== '') {
                criteria.name = resourceName.trim();
                // regEx just là pour le filtre côté front, n'a plus lieu d'être quand le serveur
                // fera le filtre
                criteria.regEx = new RegExp(`^.*${criteria.name}.*$`, 'gi');
            } else {
                openModal(this, 'manager-error-modal', `Aucun critère de recherche valide pour la ressource.`);
                return;
            }
            this.searchingResources = true;

            sendGet('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/stock.json').
                then( response => {
                    // DUMMY le filtre est fait ici mais normalement le back ne doit renvoyer
                    // on récupère la resource dont on a reçu l'identifiant en parametre.
                    // Il FAUT CHANGER ça quand l'api côté serveur sera prète, c'est au serveur back-end
                    // de filtrer les donnnées en fonction de l'appel reçu.
                    const resources = response.filter( aResource => {
                        if (typeof criteria.id !== 'undefined') {
                            // filtre par id
                            return aResource.id === criteria.id;
                        } else {
                            // Filtre par titre/auteur
                            return aResource.auteur.search(criteria.regEx) !== -1 ||
                                    aResource.titre.search(criteria.regEx) !== -1;
                        }
                    }).map(keptresource => {
                        return {
                            title: keptresource.titre,
                            image: `/${keptresource.url}`,
                            url: `/resource/${keptresource.id}`,
                            lines: [ 
                                `${keptresource.auteur}, ${keptresource.annee}`,
                                ``,
                                `${keptresource.type}`,
                            ]
                        };
                    });

                    this.searchingResources = false;
                    this.resourceResults = resources;
                }).
                catch( error => {
                    openModal(this, 'manager-error-modal', `erreur lors de la recherche de la ressource : ${error.message}`);
                    this.searchingResources = false;
                    this.resourceResults = [];
                    console.error(error);
                })
        },
        onSearchCustomers(searchCriteria) {
            const customerId = Number(searchCriteria.simpleCriteria);
            const customerName = searchCriteria.simpleCriteria;
            let criteria = {};
            if (Number.isInteger(customerId)) {
                criteria.id = customerId;
            } else if (typeof customerName === 'string' && customerName.trim() !== '') {
                criteria.name = customerName.trim();
                // regEx just là pour le filtre côté front, n'a plus lieu d'être quand le serveur
                // fera le filtre
                criteria.regEx = new RegExp(`^.*${criteria.name}.*$`, 'gi');
            } else {
                openModal(this, 'manager-error-modal', `Aucun crière de recherche valide pour l'adhérent.`);
                return;
            }
            this.searchingCustomers = true;
            // Ici normalement, on appelle le service qui renvoie les données
            // de la recherche des adhérents
            // Donnee dummy valorisées dans le "then", comme la partie 
            // qui définie les fonctionalités utilisables.
            sendGet('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/users.json').
                then( response => {
                    // DUMMY le filtre est fait ici mais normalement le back ne doit renvoyer
                    // QUE les/le adhérent(s) correspondant à la recherche.
                    const customers = response.filter( customer => {
                            if (typeof criteria.id !== 'undefined') {
                                // filtre par id
                                return customer.id === criteria.id && customer.type === 'client';
                            } else {
                                // Filtre par nom/prénom
                                return customer.type === 'client' && ( 
                                    customer.nom.search(criteria.regEx) !== -1 ||
                                    customer.prenom.search(criteria.regEx) !== -1)
                            }
                        }).map( keptCustomer => {
                            return {
                                title: keptCustomer.nom + ', ' + keptCustomer.prenom,
                                image: '/images/face.jpg',
                                // On envoie sur la première fonctionalité du paneau car c'est elle 
                                // qui est considérée comme "active" lors de l'affichage initial
                                url: `/customer/${keptCustomer.id}/update`, 
                                lines: [ 
                                    `email : ${keptCustomer.email}`,
                                    `Age : ${keptCustomer.age}`,
                                    `Solde : ${keptCustomer.solde} €`,
                                ]
                            };
                        });
                    this.searchingCustomers = false;
                    this.customersResult = customers;

                }).catch( error => {
                    openModal(this, 'manager-error-modal', `erreur lors de la recherche de l'adhérent : ${error.message}`);
                    this.searchingCustomers = false;
                    this.customersResult = [];
                });
        },
    },
    created() {
        const managerId = Number.parseInt(this.$route.params.managerId);
        // Ici normalement, on appelle le service qui renvoie les données
        // de l'utilisateur en fonction de son id
        // Donnee dummy valorisées dans le "then", comme la partie 
        // qui définie les fonctionalités utilisables.
        sendGet('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/users.json').
            then( response => {
                // DUMMY le filtre est fait ici mais normalement le back ne doit renvoyer
                // QUE l'utilisateur concerné
                const customer = response.find( user => user.id === managerId );

                const userRequested = {
                    id: customer.id,
                    firstName: customer.prenom,
                    lastName: customer.nom,
                    email: customer.email,
                    age: customer.age,
                    numberOfChildren: customer.nbEnfants,
                    balance: customer.solde,
                    status: customer.status,
                };
                this.dataError = false;
                this.manager = userRequested;

            }).
            catch( error => {
                openModal(this, 'manager-error-modal', `Erreur lors de la récupération de vos données : ${error.message}`);
                console.error(error);
            })
        const currentFunctionLists = []
        currentFunctionLists.push({ title: `Ajouter un adhérent`, routePath: `/manager/${managerId}/add-customer`});
        currentFunctionLists.push({ title: `Ajouter une ressource`, routePath: `/manager/${managerId}/add-resource`});
        this.functionsList = currentFunctionLists;
    },
    beforeRouteEnter(to, _from, next) {
        // Permet de contrôler l'acces au composant. On vérifie que l'utilisateur est
        // bien un manager et qu'il n'accede qu'à ses informations personnelles
        const userId = TheStore.getters['userId'];
        const isManager = TheStore.getters['isUserManager'];
        const managerId = Number.parseInt(to.params.managerId);
        if (isManager && managerId === userId) {
            next(true);
        } else {
            console.error(`Navigation interdite vers ${to.fullPath} pour l'utilisateur courant.`);
            next('/accueil');
        }
    }
}
</script>

<style scoped>
.manager-area {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
}

.search-area {
    display: flex;
    height: 33%;
    width: 100%;
}

.resource,
.customers {
    display: flex;
    height: calc(100% - 2rem);
    width: calc(50% - 2rem);
    margin: 1rem;
}

.management-area {
    display: flex;
    height: 67%;
    width: 100%;
}

.me {
    display: flex;
    height: calc(100% - 1.5rem);
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    width: calc(33% - 2rem);
    margin-left: 1rem;
    margin-right: 1rem;
}

.functions-pannels {
    display: flex;
    height: calc(100% - 3.5rem);
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    width: calc(67% - 2rem);
    margin-left: 1rem;
    margin-right: 1rem;
}
</style>