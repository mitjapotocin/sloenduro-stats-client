import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import Home from "./components/Home.vue";
const Event = () => import("./components/Event.vue");
const Rider = () => import("./components/Rider.vue");
const Standings = () => import("./components/Standings.vue");
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en.js";

Vue.config.productionTip = false;
Vue.use(ElementUI, { locale });
Vue.use(VueRouter);

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/vents/:event", name: "event", component: Event },
  { path: "/riders/:name", name: "rider", component: Rider },
  { path: "/standings", name: "standings", component: Standings }
];

const router = new VueRouter({
  mode: "history",
  routes
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
