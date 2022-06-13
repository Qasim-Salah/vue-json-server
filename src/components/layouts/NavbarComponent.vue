<template>
  <nav>
    <ul id="nav">
      <router-link :to="{ name: 'Home' }" exact><a>Home</a></router-link>
      <a href="#" @click="logout()">Logout</a>
    </ul>
  </nav>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "NavbarComponent",
  methods: {
    // منادات actions بطريقة مختصرة
    ...mapActions(["redirectTo"]),

    logout() {
      localStorage.clear();
      this.redirectTo({ value: "Login" });
    },
  },
};
</script>

<style lang="scss" scoped>
$fontColor: darkcyan;
$navColor: #525a5a;
ul {
  display: flex;
  justify-content: center;
  list-style: none;
  margin-bottom: 50px;
  a {
    text-decoration: none;
    font-weight: bold;
    color: $fontColor;
    padding: 10px;
  }
}
a.router-link-exact-active a,
ul a a:hover {
  color: $navColor;
  box-shadow: 2px 2px 4px 0px $navColor;
}
</style>
