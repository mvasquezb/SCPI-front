import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue';
import NotFound from "@/pages/NotFoundPage.vue";
import Login from '@/pages/Login.vue';
import ModelSelection from '@/views/ModelSelection.vue';
import ColorSelection from '@/views/ColorSelection.vue';

Vue.use(Router)

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/home",
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home
      },
      {
        path: 'about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
      },
      {
        path: 'model-selection',
        name: 'model-selection',
        component: ModelSelection,
      },
      {
        path: 'color-selection',
        name: 'color-selection',
        component: ColorSelection,
      },
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "*",
    name: "notfound",
    component: NotFound
  }
];

export default routes;