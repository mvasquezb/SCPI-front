import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";
Vue.use(Router);

// configure router
const router = new Router({
  routes, // short for routes: routes
  linkActiveClass: "active"
});

export default router;