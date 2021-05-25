<template>
    <div class="small-search-result-item-area">
        <div class="image-area">
            <img class="image" :src="'/' + imageUrl">
        </div>
        <div class="text-area">
            <div class="title">
                <router-link :to="goToLink" v-if="goToLink">{{itemTitle}}</router-link>
                <span v-else>{{itemTitle}}</span>
            </div>
            <div class="line" v-for="line in allLines" :key="line">
                {{line.trim()}}
            </div>
        </div>
    </div>
</template>

<script>
/**
 * Usage :
 *  props:
 *      title: Titre dans la zone d'information, portera le lien hypertexte pour le débranchement
 *      url: url pour débrancher (en chemin absolu)
 *      lines: tableau de string représentant les lignes d'informations supplémentaires sur l'élément. 
 *              Seules les trois première seront prises en compte.
 */
export default {
    props: ['image', 'title', 'url', 'lines'],
    computed: {
        imageUrl() {
            // console.log("urlImage : ", this.image);
            if(typeof this.title === 'string' && this.title.trim() !== ''){
                return this.image;
            }else{
                return '';
            }
        },

        itemTitle() {
            if (typeof this.title === 'string' && this.title.trim() !== '') {
                return this.title.trim();
            } else {
                return 'Inconnu...';
            }
        },

        goToLink() {
            if (typeof this.url === 'string' && this.url.trim() !== '') {
                return this.url.trim();
            } else {
                return undefined;
            }
        },

        allLines() {
            if (Array.isArray(this.lines) && this.lines.length > 0) {
                let counter = 0;
                return this.lines.filter(line => {
                    if (typeof line === 'string') {
                        counter++;
                        // On ne garde la ligne (valide car string)
                        // que si c'est l'une des trois premières
                        return counter <= 3;
                    } else {
                        // La ligne n'est pas valide (pas string)
                        return false;
                    }
                });
            } else {
                return [];
            }
        }
    }
}
</script>

<style scoped>
.small-search-result-item-area {
    display: flex;
    width: 100%;
    max-height: 6rem;
    min-height: 5rem;
}

.image-area {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(20% - 2px);
    height: calc(100% - 2px);
    border: solid 1px black;
}

.image-area > img {
    width: 90%;
    height: auto;
    max-height: 95%;
}

.text-area {
    display: flex;
    flex-flow: column;
    justify-content: center;
    width: calc(80% - 1px);
    height: calc(100% - 2px);
    border-top: solid 1px black;
    border-bottom: solid 1px black;
    border-right: solid 1px black;
}

.title {
    font-weight: bold;
}

.title,
.line {
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 1rem;
    width: calc(100% - 2rem);
    align-items: center;
    justify-content: flex-start;
}

</style>