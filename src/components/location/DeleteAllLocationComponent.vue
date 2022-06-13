<template>
  <div class="container">
    <NavbarComponent />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete All Locations</h1>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete all locations?
          </p>
          <p class="text-danger">
            It will aslo delete all related items and categories... Be careful!
          </p>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button class="btn btn-info" @click="redirectTo({ value: 'Home' })">
            Go Back
          </button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteAllLocation()">
            Delete All
          </button>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto alert alert-warning"
          v-if="successMessage.length > 0"
        >
          {{ successMessage }}
        </div>
        <div
          class="col-auto d-block mx-auto alert alert-success"
          v-if="errorMessage.length > 0"
        >
          {{ errorMessage }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import NavbarComponent from "@/components/layouts/NavbarComponent.vue";
import { mapActions } from "vuex";
import axios from "axios";

export default {
  name: "DeleteAllLocationComponent",
  components: {
    NavbarComponent,
  },
  data() {
    return {
      userId: "",
      successMessage: "",
      errorMessage: "",
      allLocationId: [],
      allItemsIdIs: [],
      allCategoriesIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "Register" });
    } else {
      this.userId = JSON.parse(user).id;
      //locations
      let resultLocation = await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}`
      );
      let resultLength = resultLocation.data.length;
      for (var i = 0; i < resultLength; i++) {
        this.allLocationId.push(resultLocation.data[i].id);
      }
    }

    //categories
    let resultCatLoc = await axios.get(
      `http://localhost:3000/categories?userId=${this.userId}`
    );
    let resultCatLocLen = resultCatLoc.data.length;
    for (var ti = 0; ti < resultCatLocLen; ti++) {
      this.allCategoriesIdIs.push(resultCatLoc.data[ti].id);
    }
    //items
    let resultItemsLoc = await axios.get(
      `http://localhost:3000/items?userId=${this.userId}`
    );
    let resultItemsLocLen = resultItemsLoc.data.length;
    for (var hi = 0; hi < resultItemsLocLen; hi++) {
      this.allItemsIdIs.push(resultItemsLoc.data[hi].id);
    }
  },
  methods: {
    // منادات actions بطريقة مختصرة
    ...mapActions(["redirectTo"]),

    async deleteAllLocation() {
      let allResults = [];
      for (var i = 0; i < this.allLocationId.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/locations/${this.allLocationId[i]}`
        );

        if (result.status == 200) {
          allResults.push(true);
        } else {
          allResults.push(false);
        }

        if (!allResults.includes(false)) {
          //all deleted successfully
          this.successMessage = "All Locations are deleted ...";
          this.errorMessage = "";
          setTimeout(() => {
            this.redirectTo({ value: "Home" });
          }, 2000);
        } else {
          this.successMessage = "";
          this.errorMessage = "Something Went Wrong, try again";
        }
      }
    },
  },
};
</script>

<style></style>
