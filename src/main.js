import Vue from 'vue';

import '@/plugins/request';
import components from '@/plugins/components';

import App from './App';
import router from './router';
import store from './store';

// 按需引入组件，删除不需要的组件
import '@/plugins/element-ui';
import '@/styles/common.scss';

Vue.use(components);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
