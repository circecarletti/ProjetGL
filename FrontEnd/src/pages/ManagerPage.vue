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
import { translateStatus } from '../services/utils.js'

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
            manager: {},
            functionsList: [],
        };
    },

    
    methods: {
        onSearchResource(searchCriteria) {
            const resourceName = searchCriteria.simpleCriteria;
            let criteria = {};
            
            if (typeof resourceName === 'string' && resourceName.trim() !== '') {
                criteria.name = resourceName.trim();
            } else {
                openModal(this, 'manager-error-modal', `Aucun critère de recherche valide pour la ressource.`);
                return;
            }
            this.searchingResources = true;

            sendGet('https://orsaymediatheque.herokuapp.com/api/resource', [{name : 'name', value: criteria.name.toLowerCase()}]).
                then( response => {
                    let result = [];
                    if(response.success){
                        
                        result = response.docs.map(keptresource => {
                            return {
                                title: keptresource.title,
                                image: keptresource.picture,
                                url: `/resource/${keptresource.id}`,
                                lines: [ 
                                    `${keptresource.author}, ${keptresource.releasedate}`,
                                    ``,
                                    `${keptresource.type}`,
                                ]
                            };
                        });
                    }else{
                        console.log("Error in getting list of ressources : ", response.message);
                    }
                    this.searchingResources = false;
                    this.resourceResults = result;
                }).
                catch( error => {
                    openModal(this, 'manager-error-modal', `erreur lors de la recherche de la ressource : ${error.message}`);
                    this.searchingResources = false;
                    this.resourceResults = [];
                    console.error(error);
                })
        },


        onSearchCustomers(searchCriteria) {
            this.customersResult = [];
            // const customerId = Number(searchCriteria.simpleCriteria);
            const customerName = searchCriteria.simpleCriteria;
            let criteria = {};
            if (typeof customerName === 'string' && customerName.trim() !== '') {
                criteria.name = customerName.trim();
            } else {
                openModal(this, 'manager-error-modal', `Aucun crière de recherche valide pour l'adhérent.`);
                return;
            }

            this.searchingCustomers = true;
            // Ici, on appelle le service qui renvoie les données
            // de la recherche des adhérents
            sendGet(`https://orsaymediatheque.herokuapp.com/jwtidManager`).then(()=>{
                return sendGet('https://orsaymediatheque.herokuapp.com/api/user/manager/getUsersInfo/info', [{name: 'name', value : searchCriteria.simpleCriteria}]);
            }).then( response => {
                    if(response.success){
                        // console.log("users list : ", response.docs);
                        const customersPres = response.docs.map(cust =>{
                            return {
                                title: cust.name + ', ' + cust.firstname,
                                image : cust.picture,
                                url: `/customer/${cust.id}/update`, 
                                lines: [ 
                                    `email : ${cust.id}`,
                                    `statut : ${translateStatus(cust.statut)}`,
                                ]
                            }
                        });
                        this.customersResult = customersPres;
                    }else{
                        console.log("Error in getting users list : ", response.message);
                    }
                    
                    this.searchingCustomers = false;

                }).catch( error => {
                    openModal(this, 'manager-error-modal', `erreur lors de la recherche de l'adhérent : ${error.message}`);
                    this.searchingCustomers = false;
                    this.customersResult = [];
                });
        },
    },


    created() {
        const managerId = this.$route.params.managerId;
        console.log("creation page du manager : ", managerId);
        // Ici normalement, on appelle le service qui renvoie les données
        // de l'utilisateur en fonction de son id
        sendGet(`https://orsaymediatheque.herokuapp.com/jwtidManager`).then(()=>{
            return sendGet(`https://orsaymediatheque.herokuapp.com/api/user/manager/${managerId}`);
        }).then( response => {
                if(response.success){
                    console.log("infos manager : ", response);
                    const userRequested = {
                        email: response.docs.id,
                        firstName: response.docs.firstname,
                        lastName: response.docs.name,
                        age: response.docs.age,
                        status: response.docs.statut,
                    };
                    this.manager = userRequested;
                    this.dataError = false;
                }else{
                    console.log("Error in getting manager infos : ", response.message);
                    this.dataError = true;
                }
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
        const managerId = to.params.managerId;
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