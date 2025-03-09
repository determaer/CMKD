import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueKonva from 'vue-konva'
import { createPinia } from 'pinia';

const pinia = createPinia();

createApp(App).use(pinia).use(VueKonva).mount('#app')
