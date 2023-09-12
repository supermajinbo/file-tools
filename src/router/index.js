import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '@/HomePage.vue';
import FileReplace from '@/FileReplace.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/replace', component: FileReplace },
  { path: '/delete', component: FileReplace },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});

export default router;
