<template>
    <div class="panel-area">
        <div class="header">
            <div class="cell" 
                v-for="(fct, index) in functionsList" :key="fct" 
                :style="panelClass(index)">
                <router-link :to="fct.routePath" @click="setActivePanel(index)">
                {{fct.title}}
                </router-link>
            </div>
        </div>
        <div class="body">
            <!-- Permet de charger ICI les composants référencés par les routes spécifiées
                 pour chacune des fonctions dans la liste "functionsList" -->
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
/**
 * Props :
 * functionsList : Tableau d'objet représentant les fonctionalité de
 *                  chacun des paneau
 *      {
 *          title: titre de la fonctionalité,
 *          routePath: chaine de caractères représentant la route permettant de charger le composant de la fonctionalité.
 *      }
 * C'est la première fonctionalité qui est considérée comme active à l'affichage du panneau
 */
export default {
    props: ['functionsList'],
    data() {
        return {
            activePanelIndex: 0,
        }
    },

    methods: {
        panelClass(panelIdx) {
            if (panelIdx === this.activePanelIndex) {
                return { borderBottomColor: 'transparent' };
            } else {
                return {};
            }
        },
        
        setActivePanel(panelIdx) {
            this.activePanelIndex = panelIdx;
        }
    }
}
</script>

<style scoped>
.panel-area {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
    background-color: pink;
    border: solid 1px black;
}

.header {
    display: flex;
    width: 100%;
    height: 2rem;
    align-items: center;
    justify-content: center;
}

.body {
    display: flex;
    width: 100%;
    height: calc(100% - 2rem);
    align-items: center;
    justify-content: center;
}

.cell {
    display: flex;
    flex: 1;
    height: calc(100% - 2px);
    align-items: center;
    justify-content: center;
    border-right: solid 1px black;
    border-bottom: solid 1px black;
}

.cell:last-child {
  border-right-color: transparent;
}
</style>
