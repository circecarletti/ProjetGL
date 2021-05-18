<template>
    <div class="news-area">
        <div class="background-area">
            <div class="title">
                <h3>Nouveautés</h3>
            </div>
            <div class="error-area" v-if="(dataError || news.length === 0) && !waiting">
                <span>Aucune</span><br>
                <span>donnée</span><br>
                <span>disponible</span><br>
            </div>
            <div class="display-area" v-if="!dataError && news.length > 0 && !waiting">
                <div v-for="aNews in news" :key="aNews" class="new-spot">
                    <img :src="aNews.url" class="image"  @click="onClick(aNews.id)">
                </div>
            </div>
            <the-spinner v-if="waiting"></the-spinner>
        </div>
    </div>
</template>

<script>
import { sendGet } from '../services/httpHelpers.js'

export default {
    data() {
        return {
            news: [],
            dataError: false,
            waiting: false,
        };
    },
    methods: {
        onClick(id) {
            this.$router.push(`/resource/${id}`);
        },
    },
    beforeMount() {
        this.waiting = true;
        sendGet('https://media-orsay-default-rtdb.firebaseio.com/stock.json').
            then( response => {
                // DUMMY le filtre est fait ici mais normalement le back ne doit renvoyer
                // QUE les nouveautés.
                // Il FAUT CHANGER ça quand l'api côté serveur sera prète, c'est au serveur back-end
                // de filtrer les donnnées en fonction de l'appel reçu.
                this.news = response.filter( aNews => aNews.nouveaute );
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
.news-area {
    width: 25%;
    height: 100%;
    display: flex;
}

.background-area {
    /*margin: 1rem;*/
    display: flex;
    flex: auto;
    flex-flow: column;
    background-color: pink;
    border: solid 1px black;
}

.title {
    display: flex;
    width: 100%;
    height: 2rem;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
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
    flex: auto;
    overflow-y: auto;
    justify-content: flex-start;
}

.new-spot {
    width: 100%;
    display: flex;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    justify-content: center;
}

.image {
    height: 8rem;
    width: auto;
    cursor: pointer;
}
</style>