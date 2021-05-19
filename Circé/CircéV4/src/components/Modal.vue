<template>
    <teleport to="body">
        <div class="modal-overlay" @click.stop="" v-if="display" ref="modal-component">
            <div class="dialog-window">
                <div class="title">{{theTitle}}</div>
                <div class="display-area">
                    <slot>
                        <div class="default-text">
                            <p>{{theText}}</p>
                        </div>
                    </slot>
                </div>
                <div class="action-area">
                    <button type="button" @click="onClickOk">{{okLabel}}</button>
                    <button type="button" @click="onClickCancel" v-if="cancelLabel">{{cancelLabel}}</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script>

/**
 *  @example :
 *  Usage :
 *      Importer le composant et sa fonction.
 *      Dans le template insérer le composant (s'il a été importé avec l'alias html <the-modal>) :
 *          <the-modal 
 *              ref="theModal" 
 *              title="Un titre" 
 *              type="warning/error/[rien]"
 *              okButtonLabel="Label pour OK"
 *              cancelButtonLabel="Label pour cancel ou rien si pas de cancel"
 *              @okClose="fct à appeler sur la fermeture"
 *              @cancelClose="fct à appeler sur l'annulation">
 *              <!-- code html qui sera injecté dans la modale
 *                   Si pas besoin de style, peut être omis pour 
 *                   juste être fourni à la fonction d'oouverture.
 *              -->
 *          </the-modal>
 *      Dans le code, appeler la fonction importée :
 *    openModal(this, "identifant ref de la modale", "eventuellement texte à insérer sans mise en forme");
 */
const openModal = function(that, modalRef, text) {
    const theModal = that.$refs[modalRef];
    if (typeof text === 'string' && text.trim() !== '') {
        theModal.setText(text);
    }
    theModal.open();
}

export { 
    openModal
}


export default {
    props: ['title', 'type', 'okButtonLabel', 'cancelButtonLabel'],
    emits: ['okClose', 'cancelClose'],
    data() {
        return {
            theTitle: '',
            theType: '',
            okLabel: '',
            cancelLabel: '',
            cancelStyle: {},
            display: false,
            theText: '<b>Texte</b> par défaut.'
        }
    },
    methods: {
        onClickOk() {
            this.$emit('okClose', true);
            this.display = false;
        },
        onClickCancel() {
            this.$emit('cancelClose', true);
            this.display = false;
        },
        setText(allText) {
            this.theText = allText;
        },
        open() {
            this.display = true;
        }
    },
    computed: {
    },
    mounted() {
        if (typeof this.title === 'string' && this.title.trim() !== '') {
            this.theTitle = this.title.trim();
        } else {
            this.theTitle = 'Titre';
        }

        if (this.type !== 'warning' && this.type !== 'error' && this.type !== 'info') {
            this.theType = 'info';
        } else {
            this.theType = this.type;
        }

        if (typeof this.okButtonLabel !== 'string' || this.okButtonLabel.trim() === '') {
            this.okLabel = 'OK';
        } else {
            this.okLabel = this.okButtonLabel;
        }

        if (typeof this.cancelButtonLabel !== 'string' || this.cancelButtonLabel.trim() === '') {
            this.cancelLabel = undefined;
        } else {
            this.cancelLabel = this.cancelButtonLabel;
        }
    }
}
</script>


<style scoped>
.modal-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(100, 100, 100, 0.4);
}

.dialog-window {
    display: flex;
    width: 50%;
    height: 50%;
    flex-flow: column;
    background-color: blanchedalmond;
    border: solid 1px black;
    border-radius: 5px;
    box-shadow: 5px 5px 10px;
}

.title {
    display: flex;
    width: 100%;
    height: 10%;
    min-height: 2rem;
    border-bottom: solid 1px black;
}

.display-area {
    display: flex;
    flex: auto;
    height: 50%;
    width: 100%;
}

.default-text {
    display: flex;
    flex: auto;
    align-items: center;
    justify-content: center;
}

.action-area {
    display: flex;
    width: 100%;
    min-height: 3rem;
    height: 15%;
    align-items: center;
    justify-content: space-between
}
</style>