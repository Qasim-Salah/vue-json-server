import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "normalize.css";

const app = createApp(App);
// app.component('fffff' , 'path'); كلوبل
app.use(store).use(router).mount("#app");
