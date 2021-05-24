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
                    <span>Type :</span>
                </div>
                <div class="input-cell">
                    <input type="radio" id="add-resource-type-book"
                        v-model="type" value="book" name="type">
                    <label for="add-resource-type-book">Livre</label>
                    <input type="radio" id="add-resource-type-dvd"
                        v-model="type" value="dvd" name="type">
                    <label for="add-resource-type-dvd">DVD</label>
                    <input type="radio" id="add-resource-type-cd"
                        v-model="type" value="cd" name="type">
                    <label for="add-resource-type-cd">CD</label>
                    <input type="radio" id="add-resource-type-videogames"
                        v-model="type" value="videogames" name="type">
                    <label for="add-resource-type-videogames">Jeux Videos</label>
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
                    <input type="radio" id="add-resource-category-customer"
                        v-model="category" value="customer" name="category">
                    <label for="add-resource-category-customer">adulte</label>
                    <input type="radio" id="add-resource-category-child"
                        v-model="category" value="child" name="category">
                    <label for="add-resource-category-child">enfant</label>
                    <input type="radio" id="add-resource-category-allpublic"
                        v-model="category" value="allpublic" name="category">
                    <label for="add-resource-category-allpublic">tous public</label>
                </div>
            </div>
            <div class="line">
                <div class="label-cell">
                    <span>Prix :</span>
                </div>
                <div class="input-cell">
                    <input type="text"
                        ref="add-resource-price"
                        v-model="price"
                        :pattern="priceRegEx"
                        required>
                    € (pour 30 jours)
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
import { sendPost } from '../services/httpHelpers.js';
import { 
    regexStringFormulaForName, 
    regexStringFormulaForAge,
    manageValidityMessage,
    regexStringFormulaForBalance } from '../services/utils.js';

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
            price: '',
			category: 'allpublic',
			synopsis: '',
            nameRegEx: regexStringFormulaForName,
            releaseDateRegEx: regexStringFormulaForAge,
            priceRegEx : regexStringFormulaForBalance,
        }
    },

    watch: {

        title() {
            if(this.title.length < 3 || this.title.length > 30){
                this.$refs['add-resource-title'].setCustomValidity("le titre doit faire entre 3 et 30 caractères");
            }else{
                manageValidityMessage(
                    this.$refs['add-resource-title'],
                    `Le titre de la ressource doit être renseigné.`);
            }
        },

        author() {
            if(this.author.length < 3 || this.author.length > 30){
                this.$refs['add-resource-author'].setCustomValidity("le nom de l'auteur doit faire entre 3 et 30 caractères");
            }else{
                    manageValidityMessage(
                    this.$refs['add-resource-author'],
                    `Le nom de l'auteur doit être renseigné.`);
            }
        },

        releaseDate() {
            if(Number(this.releaseDate < 1000)){
                this.$refs['add-resource-releaseDate'].setCustomValidity("L'année renseigné ne doit pas précédée l'an 1000");
            }else{
                manageValidityMessage(
                    this.$refs['add-resource-releaseDate'],
                    `L'année de la parution doit être renseigné.`);
            }
        },

        price(){
            if(Number(this.price > 100 || Number(this.price < 0))){
                this.$refs['add-resource-price'].setCustomValidity("Le prix doit être compris entre 1 et 100€");
            }else{
                manageValidityMessage(
                    this.$refs['add-resource-price'],
                    `Le prix de l'emprunt doit être renseigné.`);
            }
            
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


        fileNotValid() {
            return this.file === '';
        },

        categoryNotValid() {
            return this.category !== 'customer' && 
                    this.category !== 'child' && 
                    this.category !== 'allpublic';
        },

        authorNotValid() {
            return this.author.trim() === '' || !this.$refs['add-resource-author'].validity.valid;
        },

        releaseDateNotValid() {
            return this.releaseDate.trim() === ''
                || Number(this.releaseDate.trim()) < 1000 
                || !this.$refs['add-resource-releaseDate'].validity.valid;
        },

        resumeNotValid() {
            return this.resume.trim() === '';
        },

        synopsisNotValid() {
            return this.synopsis.trim() === '';
        },

        priceNotValid(){
            return  this.price.trim() === ''
                || Number(this.price.trim()) < 0 
                || Number(this.price.trim()) > 100 
                || !this.$refs['add-resource-price'].validity.valid;
        },

        typeNotValid(){
            return this.type !== 'dvd'
                    && this.type !== 'cd'
                    && this.type !== 'book'
                    && this.type !== 'videogames';
        },

        invalidData() {
            console.log("resultat des test de validité : ", this.titleNotValid, this.typeNotValid, this.priceNotValid,
                    this.categoryNotValid, this.authorNotValid, this.releaseDateNotValid,
                    this.resumeNotValid, this.synopsisNotValid);
            return this.titleNotValid || this.typeNotValid || this.priceNotValid ||
                    this.categoryNotValid || this.authorNotValid || this.releaseDateNotValid ||
                    this.resumeNotValid || this.synopsisNotValid;
        }
    },
    methods: {
        onSubmit() {
            if (!this.invalidData) {

                const newResource = {
                    title: this.title,
                    category: this.category,
                    author: this.author, 
                    releasedate: this.releaseDate,
                    type: this.type,
                    price: this.price,
                    resume: this.resume,
                    synopsis: this.synopsis
                };

                sendPost('https://orsaymediatheque.herokuapp.com/api/user/manager/createResource', newResource). 
                    then( response => {
                        if(response.success){
                            this.title = '';
                            this.url = '';
                            this.type = 'dvd';
                            this.resume = '';
                            this.author = '';
                            this.releaseDate = '';
                            this.category = 'allpublic';
                            this.synopsis = '';
                            this.file = '';
                            openModal(this, 'add-resource-success-modal', `ajout de la nouvelle ressource effectuée.`);
                        }else{
                            console.log("Error in adding a new resource : ", response.message);
                        }
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