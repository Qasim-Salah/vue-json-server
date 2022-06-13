<template>
  <NavbarComponent />
  <div class="container">
    <router-link
      :to="{ name: 'CreateCategory', params: { locationId: locationId } }"
    >
      <button class="btn btn-info">Add Category</button> </router-link
    >&nbsp;&nbsp;
    <router-link :to="{ name: 'Menu', params: { id: locationId } }">
      <button class="btn btn-success">Back to Menu</button>
    </router-link>
    <br />
    <div class="text-center">
      <h1 class="mb0">{{ locationName }}</h1>
      <p class="text-muted">{{ locationAddress }}</p>
    </div>
    <table class="table caption-top" v-if="numOfCategories > 0">
      <caption>
        <span> List of Categories ({{ numOfCategories }}) </span>
        <span class="float-end">
          <router-link
            :to="{
              name: 'DeleteAllCategories',
              params: { locationId: locationId },
            }"
          >
            <button class="btn btn-danger">Delete All</button>
          </router-link>
        </span>
      </caption>
      <thead class="table-dark">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in listOfCategories" :key="index">
          <th scope="row">{{ category.name }}</th>
          <td>
            <router-link
              :to="{
                name: 'UpdateCategory',
                params: {
                  categoryId: category.id,
                  locationId: category.locationId,
                },
              }"
            >
              <button class="btn btn-info">Update</button>
            </router-link>
            &nbsp;
            <router-link
              :to="{
                name: 'DeleteCategory',
                params: {
                  categoryId: category.id,
                  locationId: category.locationId,
                },
              }"
            >
              <button class="btn btn-danger">Delete</button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="alert alert-warning mt15" role="alert">
      No Categories Added Yet
    </div>
  </div>
</template>

<script>
import NavbarComponent from "@/components/layouts/NavbarComponent.vue";
import axios from "axios";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "CategoriesComponent",
  components: { NavbarComponent },
  data() {
    return {
      locationId: this.$route.params.locationId,
      userId: "",
      locationName: "",
      locationAddress: "",
    };
  },
  computed: {
    ...mapState([
      "isUserLoggedIn",
      "loggedInUserId",
      "numOfCategories",
      "listOfCategories",
      "listOfLocations",
    ]),
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "Register" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.canUserAccessThisLocation({
        userId: this.userId,
        locationId: this.locationId,
        redirectToPage: "Home",
      });
      this.displayAllCategories({
        userId: this.userId,
        locationId: this.locationId,
      });
      this.getLocationInfo(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
    ]),
    ...mapActions(["redirectTo"]),
    async getLocationInfo(userId, locationId) {
      //http://localhost:3000/locations?userId=1
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${userId}&id=${locationId}`
      );
      let locationDetails = [];
      if (result.status == 200) {
        locationDetails = result.data;
        this.locationName = locationDetails[0].name;
        this.locationAddress = locationDetails[0].address;
      }
    },
  },
};
</script>

<style>
.mb0 {
  margin-bottom: 0;
}
</style>
