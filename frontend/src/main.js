import Vue from 'vue'

import App from './App.vue'
import router from './router'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import LoadScript from 'vue-plugin-load-script';


Vue.config.productionTip = false

Vue.component('v-select', vSelect)
Vue.use(LoadScript);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')