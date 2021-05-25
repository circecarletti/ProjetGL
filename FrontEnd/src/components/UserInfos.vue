<template>
    <div class="user-info-area">
        <div class="title">
            {{title}}
        </div>
        <div class="background-area">
            <div class="picture">
                <img src="/images/face.jpg">
            </div>
            <div class="informations">
                <div class="line">
                    {{lastName}}, {{firstName}}
                </div>
                <div class="line">
                    <span class="label">email</span> : {{email}}
                </div>
                <div class="line">
                    <span class="label">age</span> : {{age}}
                </div>
                <div class="line" v-if="numberOfChildren >= 0">
                    <span class="label">Nombre d'enfant</span> : {{numberOfChildren}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * Les props:
 *  title : libellé du titre.
 *  user : Objet contenant les données de l'utilisateur
 *      {
 *          firstName: prénom,
 *          lastName: nom,
 *          email: email,
 *          age: l'age en années
 *          childrenAccountIds: tableau des identifiants de comptes de mineurs ratachés au compte. 
 *                              Non spécifié pour un administrateur.
 *      }
 */
export default {
    props: ['title', 'user'],

    computed: {
        lastName() {
            if (this.user && typeof this.user.lastName === 'string') {
                return this.user.lastName.trim();
            } else {
                return 'Inconnu';
            }
        },
        firstName() {
            if (this.user && typeof this.user.firstName === 'string') {
                return this.user.firstName.trim();
            } else {
                return 'inconnu';
            }
        },
        email() {
            if (this.user && typeof this.user.email === 'string') {
                return this.user.email.trim();
            } else {
                return 'Inconnu';
            }
        },
        age() {
            if (this.user && typeof this.user.age === 'number') {
                return this.user.age > 1 ? this.user.age + 'ans' : this.user.age + 'an';
            } else {
                return 'Inconnu';
            }
        },
        numberOfChildren() {
            if (this.user && this.user.numberOfChildren && typeof this.user.numberOfChildren === 'number') {
                return `${this.user.numberOfChildren}`;
            } else {
                return -1;
            }
        },
    }
}
</script>

<style scoped>
.user-info-area {
    display: flex;
    flex-flow: column;
    align-items: center;
    height: 100%;
    width: 100%;
}

.title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 2rem;
    font-size: 1.5rem;
    font-weight: bold;
}

.background-area {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100% - 2rem);
    background-color: pink;
}

.picture {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 33%;
}

.picture > img {
    height: auto;
    width: 50%;
    max-height: 90%;
}

.informations {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 67%;
    justify-content: center;
}

.line {
    display: flex;
    width: calc(100% - 2rem);
    margin: 1rem;
}

.label {
    font-weight: bold;
}

</style>