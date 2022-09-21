import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Config, Notification } from '@oruga-ui/oruga-next';
import '../node_modules/@oruga-ui/oruga-next/dist/oruga-full-vars.css';
import './assets/styles.scss';
import App from './App.vue';

createApp(App).use(createPinia()).use(Notification).use(Config, { iconPack: 'fa' }).mount('#app');
