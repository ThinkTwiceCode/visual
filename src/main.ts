import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/index.less'

import { router } from './router/index';
import { i18n } from './i18n/index';

import App from './App.vue'

const app = createApp(App);
app
.use(router)
.use(i18n)
.mount('#app');
