<template>
    <div class="add-resource-area">
        <form @submit.prevent="onSubmit">
            <div class="line">
                <div class="label-cell">
                    <span>Titre :</span>
                </div>
                <div class="input-cell">
                    <input type="text"
                        ref="add-resource-title"
                        v-model="title"
                        required>
                </div>
            </div>
            <div class="line">
                <div class="label-cell">
                    <span>Fichier :</span>
                </div>
                <div class="input-cell">
                    <input type="file"
                        ref="add-resource-file"
                        accept="image/*"
                        name="add-resource-file"
                        @change="setFile"
                        required>
                </div>
            </div>
            <div class="line">
                <div class="label-cell">
                    <span>Type :</span>
                </div>
                <div class="input-cell">
                    <input type="radio" id="add-resource-type-livre"
                        v-model="type" value="livre" name="type">
                    <label for="add-resource-type-livre">Livre</label>
                    <input type="radio" id="add-resource-type-dvd"
                        v-model="type" value="dvd" name="type">
                    <label for="add-resource-type-dvd">DVD</label>
                </div>
            </div>
            <div class="line">
                <div class="label-cell">
                    <span>Auteur :</span>
                </div>
                <div class="input-cell">
                    <input type="text"
                        ref="add-resource-author"
                        v-model="author"
                        :pattern="nameRegEx"
                        required>
                </div>
            </div>
            <div class="line">
                <div class="label-cell">
                    <span>Année :</span>
                </div>
                <div class="input-cell">
                    <input type="text"
                        ref="add-resource-releaseDate"
                        v-model="releaseDate"
                        :pattern="releaseDateRegEx"
                        required>
                </div>
            </div>
            <div class="line">
                <div class="label-cell">
                    <span>Catégorie :</span>
                </div>
                <div class="input-cell">
                    <input type="radio" id="add-resource-category-adulte"
                        v-model="category" value="adulte" name="category">
                    <label for="add-resource-category-adulte">adulte</label>
                    <input type="radio" id="add-resource-category-enfant"
                        v-model="category" value="enfant" name="category">
                    <label for="add-resource-category-enfant">enfant</label>
                    <input type="radio" id="add-resource-category-tousPublic"
                        v-model="category" value="tousPublic" name="category">
                    <label for="add-resource-category-tousPublic">Tous</label>
                </div>
            </div>
            <div class="line large">
                <div class="label-cell">
                    <label for="add-resource-resume">Résumé :</label>
                </div>
                <div class="input-cell">
                    <textarea v-model="resume" line="4" col="80" 
                        id="add-resource-resume" 
                        ref="add-resource-resume"
                        required>
                    </textarea>
                </div>
            </div>
            <div class="line large">
                <div class="label-cell">
                    <label for="add-resource-sinopsys">Synopsis :</label>
                </div>
                <div class="input-cell">
                    <textarea v-model="synopsis" line="4" col="80" 
                        id="add-resource-synopsis" 
                        ref="add-resource-synopsis" required>
                    </textarea>
                </div>
            </div>
            <div class="line">
                <div class="action-cell">
                    <button type="submit" class="btn-green" :disabled="invalidData">Valider</button>
                </div>
            </div>
        </form>
        <the-modal ref="add-resource-error-modal" 
            title="Erreur" 
            type="error"
            okButtonLabel="OK">
        </the-modal>
        <the-modal ref="add-resource-success-modal" 
            title="Ajout effectuée" 
            okButtonLabel="OK">
        </the-modal>
    </div>
</template>

<script>
import { openModal} from './Modal.vue';
import { sendPost, sendFile } from '../services/httpHelpers.js';
import { 
    regexStringFormulaForName, 
    regexStringFormulaForAge,
    manageValidityMessage } from '../services/utils.js';

export default {
    data() {
        return {
			title: '',
			url: '',
			new: true,
            file: '',
			type: 'dvd',
			resume: '',
			author: '',
			releaseDate: '',
			category: 'tousPublic',
			synopsis: '',
            nameRegEx: regexStringFormulaForName,
            releaseDateRegEx: regexStringFormulaForAge
        }
    },
    watch: {
        title() {
            manageValidityMessage(
                this.$refs['add-resource-title'],
                `Le titre de la ressouce doit être renseigné.`);
        },
        author() {
            manageValidityMessage(
                this.$refs['add-resource-author'],
                `Le nom de l'auteur doit être renseigné.`);
        },
        releaseDate() {
            manageValidityMessage(
                this.$refs['add-resource-releaseDate'],
                `L'année de la parution doit être renseigné.`);
        },
        resume() {
            manageValidityMessage(
                this.$refs['add-resource-resume'],
                `Veuillez saisir le résumé.`);
        },
        synopsis() {
            manageValidityMessage(
                this.$refs['add-resource-synopsis'],
                `Veuillez saisir le synopsis.`);
        },
    },
    computed: {
        titleNotValid() {
            return this.title.trim() === '';
        },
        typeNotValid() {
            return this.type !== 'livre' && this.type !== 'dvd';
        },
        fileNotValid() {
            return this.file === '';
        },
        categoryNotValid() {
            return this.category !== 'adulte' && 
                    this.category !== 'enfant' && 
                    this.category !== 'tousPublic';
        },
        authorNotValid() {
            return this.author.trim() === '' && !this.$refs['add-resource-author'].validity.valid;
        },
        releaseDateNotValid() {
            return this.releaseDate.trim() === '' && !this.$refs['add-resource-releaseDate'].validity.valid;
        },
        resumeNotValid() {
            return this.resume.trim() === '';
        },
        synopsisNotValid() {
            return this.synopsis.trim() === '';
        },
        invalidData() {
            return this.titleNotValid || this.typeNotValid || this.fileNotValid ||
                    this.categoryNotValid || this.authorNotValid || this.releaseDateNotValid ||
                    this.resumeNotValid || this.synopsisNotValid;
        }
    },
    methods: {
        onSubmit() {
            if (!this.invalidData) {

                // Première chose réaliser l'upload du fichier de l'image
                const formData = new FormData();
                formData.append('type', 'resource');
                formData.append('image', this.file);

                sendFile('https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/newResource.json', formData). 
                    then( response => {
                        // La réponse contient normalement le path de l'image
                        console.log('retour upload', response);
                        const newResource = {
                            title: this.title,
                            url: '????', // ici mettre le path renvoyé par la réponse
                            new: true,
                            type: this.type,
                            resume: this.resume,
                            author: this.author,
                            releaseDate: this.releaseDate,
                            category: this.category,
                            synopsis: this.synopsis,
                        };
                        // Maintenant on appelle la création de la ressource elle même
                        return sendPost(
                            'https://projet-orsay-default-rtdb.europe-west1.firebasedatabase.app/newResource.json', 
                            newResource);
                    }).
                    then( response => {
                        console.log(response);
                        this.title = '';
                        this.url = '';
                        this.type = 'dvd';
                        this.resume = '';
                        this.author = '';
                        this.releaseDate = '';
                        this.category = 'tousPublic';
                        this.synopsis = '';
                        this.file = '';
                        openModal(this, 'add-resource-success-modal', `ajout de la nouvelle ressource effectuée.`)
                    }).
                    catch( error => {
                        console.error(error);
                        this.errorMsg = error.message;
                        openModal(this, 'add-resource-error-modal', `Echec de la création de la nouvelle resource: ${error.message}`);
                    });
            } else {
                openModal(this, 'add-customer-error-modal', `Les données pour l'ajout ne sont pas valides.`);
            }
        },
        setFile() {
            this.file = this.$refs['add-resource-file'].files[0];
        }
    }
}
</script>


<style scoped>
.add-resource-area {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
}

.line {
    display: flex;
    width: calc(100% - 2rem);
    height: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-top: 0.25rem;
}

.line.large {
    height: 6rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
}

.label-cell {
    display: flex;
    align-items: center;
    width: 7rem;
    height: 100%;
}

.input-cell {
    display: flex;
    align-items: center;
    height: 100%;
    flex: auto;
}

.input-cell > input,
.input-cell > textarea {
    margin-left: 1rem;
    margin-right: 1rem;
}

.input-cell > input[type="text"],
.input-cell > input[type="password"] {
    text-align: center;
}

.action-cell {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    padding-right: 0.9rem;
}

textarea {
    height: calc(100% - 0.4rem);
    width: 100%;
    min-width: 10rem;
    resize: none;
}

</style>