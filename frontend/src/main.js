import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';

const app = createApp(App);

// Pinia must be installed before the router so navigation guards can read stores.
app.use(createPinia());
app.use(router);

app.mount('#app');
