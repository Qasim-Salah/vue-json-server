<template>
  <div class="container">
    <NavbarComponent />
    <p class="text-end">
      Welcome: {{ userName }}
      <router-link :to="{ name: 'Profile' }">
        <button class="btn btn-info" type="button">Profile</button>
      </router-link>
    </p>
    <CreateLocationComponent />
    <UserLocationsComponent :locations="locations" />
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import NavbarComponent from "@/components/layouts/NavbarComponent";
import CreateLocationComponent from "@/components/location/CreateLocationComponent";
import UserLocationsComponent from "@/components/location/UserLocationsComponent";

export default {
  name: "HomeView",
  components: {
    CreateLocationComponent,
    UserLocationsComponent,
    NavbarComponent,
  },
  data() {
    return {
      userName: "",
      userId: "",
      locations: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "Register" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
    }
    //get list of restaurants
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}`
    );

    if (result.status == 200 && result.data.length > 0) {
      this.locations = result.data;
    }
  },
  methods: {
    // منادات actions بطريقة مختصرة
    ...mapActions(["redirectTo"]),
  },
};
</script>
