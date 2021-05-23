<template>
    <div class="information-area">
        <div class="main-area">
            <!-- Pour retourner à l'accueil -->
            <router-link to="/accueil">Accueil</router-link>
            <h3>Nouveautés :</h3>
            <div class="list-news-area" v-if="!waiting">
                <div class="line" v-for="aData in newsData" :key="aData">
                    <span class="title">{{aData.auteur}} [{{aData.titre}}]</span>
                    <span class="synopsis">Synopsis :</span>
                    <p>{{aData.synopsis}}</p>
                </div>
            </div>
            <div class="spinner-box" v-if="waiting">
                <the-spinner></the-spinner>
            </div>
        </div>
        <the-news></the-news>
    </div>
</template>

<script>
import { sendGet } from '../services/httpHelpers.js';

export default {
    data() {
        return {
            newsData: [],
            waiting: false,
            dataError: false
        }
    },
    beforeMount() {
        this.waiting = true;
        sendGet('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/stock.json').
            then( response => {
                // DUMMY le filtre est fait ici mais normalement le back ne doit renvoyer
                // QUE les nouveautés.
                // Il FAUT CHANGER ça quand l'api côté serveur sera prète, c'est au serveur back-end
                // de filtrer les donnnées en fonction de l'appel reçu.
                this.newsData = response.filter( aNews => aNews.nouveaute );
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
.information-area {
    display: flex;
    padding: 1rem;
    height: calc(100% - 2rem);
    width: calc(100% - 2rem);
}

.main-area {
    display: flex;
    width: 65%;
    flex-flow: column;
    padding-left: 5%;
    padding-right: 5%;
    height: 100%;
}

.spinner-box {
    display: flex;
    width: 50%;
    padding-left: 25%;
    padding-right: 25%;
    height: 100%;
}

.list-news-area {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
}

.line {
    display: flex;
    flex-flow: column;
    width: 100%;
}

.title {
    font-size: 1.2rem;
    font-weight: bolder;
}

.synopsis {
    font-size: 1.1rem;
}

p {
    text-align: justify;
    margin-right: 0.2rem;
    margin-top: 0.2rem;
}
</style>