import Vue from 'vue';
import VueRouter from 'vue-router';
import { flattenRouterArray, getSessionStorage, setSessionStorage } from '@/utils/tools';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: {
      title: '登录',
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // 没有点击菜单直接输入地址也添加顶部标签
  const menuTags = getSessionStorage('menuTags') || [];
  const formatRouter = flattenRouterArray([...router.options.routes]);
  const currentRouter = formatRouter.find((item) => item.meta.fullPath === to.path);
  currentRouter.query = to.query;
  let index = -1;
  if (menuTags) {
    index = menuTags.findIndex((item) => item.meta.fullPath === to.path);
  }
  if (index === -1) {
    menuTags.push({ ...currentRouter });
    setSessionStorage('menuTags', menuTags);
  }

  setSessionStorage('selected', currentRouter.name);

  next();
});

export default router;
