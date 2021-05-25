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
                    <img class="image" :src="'/' +  aNews.url"  @click="onClick(aNews.id)">
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
        sendGet('https://orsaymediatheque.herokuapp.com/api/resource/getNouveaute/news').
            then( response => {
                if(response.success){
                    const newResources = response.docs.map(newR =>{
                            return {
                                id : newR.id,
                                url : newR.picture
                            }
                        });
                    this.news = newResources;
                    this.dataError = false;
                }else{
                    console.log("Error in getting news : ", response.message);
                    this.dataError = false;
                }
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