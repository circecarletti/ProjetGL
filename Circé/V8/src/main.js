import { createApp } from 'vue';
import App from './App.vue';

import router from './router/index.js';
import store from './store/index.js'; // Importe le magasin de données qui gère l'état global de l'application (voir ./store/index.js)
import news from './components/News.vue';
import spinner from './components/SpinnerResponsive.vue';
import modal from './components/Modal.vue';



const app = createApp(App);

app.component('the-news', news);
app.component('the-spinner', spinner);
app.component('the-modal', modal);

app.use(router);
app.use(store);
app.mount('#app');