<template>
    <div class="footer-area">
        <div class="left-area">
            <div class="cell left">
                <div class="image">
                    <!--i class="far fa-clock" style="font-size:1rem;color:red;"></i-->
                    <i class="far fa-clock fa-2x"></i>
                </div>
                <div class="text">
                    Horaires d'ouverture<br>
                    Mardi - Vendredi : 15h - 18h<br>
                    Samedi : 14h - 17h<br>
                </div>
            </div>
            <div class="cell left">
                <div class="image">
                    <i class="fas fa-street-view fa-2x"></i>
                </div>
                <div class="text">
                    Adresse:<br>
                    7, allée de la Bouvèche,<br>
                    91400 Orsay<br>
                    Médiathèque d'Orsay
                </div>
            </div>
        </div>
        <div class="right-area">
            <div class="cell right">
                <div class="image">
                    <i class="far fa-address-card fa-2x"></i>
                </div>
                <div class="text">
                    Contact:<br>
                    Numéro: 01.XX.XX.XX.XX<br>
                    E-mail: abc@medorsay.com<br>
                </div>
            </div>
            <div class="cell right">
                <div class="image">
                    <i class="fab fa-twitter-square fa-2x"></i>
                </div>
                <div class="text">
                    Nos réseaux:<br>
                    Facebook:<br>
                    Twitter:<br>
                    Instagram:<br>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.footer-area {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: pink;
}

.left-area {
    display: flex;
    flex-flow: column;
    width: 50%;
    height: 100%;
    padding-left: 1rem;
}

.right-area {
    display: flex;
    flex-flow: column;
    width: 50%;
    height: 100%;
    padding-right: 1rem;
}

.cell {
    display: flex;
    width: 100%;
    height: 50%;
}

.cell.left {
    justify-content: flex-start;
}

.cell.right {
    justify-content: flex-end;
}

.image {
    margin: 1rem;
    display: flex;
    width: 3rem;
    align-items: center;
    justify-content: center;
}

.text {
    margin: 1rem;
    display: flex;
    align-items: center;
    justify-content: left;
    width: 15rem;
}

</style>