<template>
  <div class="container">
    <NavbarComponent />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete Restaurant # {{ id }}</h1>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete this location?
          </p>
          {{ name }}<br />
          {{ address }}<br />
          {{ phone }}<br />
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button class="btn btn-info" @click="redirectTo({ value: 'Home' })">
            Go Back
          </button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteLocation()">
            Delete Now
          </button>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto alert alert-success"
          v-if="successMessage.length > 0"
        >
          {{ successMessage }}
        </div>
        <div
          class="col-auto d-block mx-auto alert alert-warning"
          v-if="errorMessage.length > 0"
        >
          {{ errorMessage }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import NavbarComponent from "@/components/layouts/NavbarComponent.vue";
import { mapActions } from "vuex";

export default {
  name: "DeleteLocationComponent",
  components: {
    NavbarComponent,
  },
  data() {
    return {
      id: "",
      name: "",
      address: "",
      phone: "",
      userId: "",
      data: [],
      successMessage: "",
      errorMessage: "",
      allItemsIdIs: [],
      allCategoriesIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "Register" });
    } else {
      this.id = this.$route.params.id;
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
    }

    let result = await axios.get(
      `http://localhost:3000/items?locId=${this.id}`
    );
    let resultLen = result.data.length;
    for (var i = 0; i < resultLen; i++) {
      this.allItemsIdIs.push(result.data[i].id);
    }
    let resultForCategories = await axios.get(
      `http://localhost:3000/categories?locationId=${this.locationId}`
    );
    let resultCatLen = resultForCategories.data.length;
    for (var c = 0; c < resultCatLen; c++) {
      this.allCategoriesIdIs.push(resultForCategories.data[c].id);
    }
  },
  methods: {
    // منادات actions بطريقة مختصرة
    ...mapActions(["redirectTo"]),

    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.id}&userId=${this.userId}`
      );
      if (result.status == 200) {
        this.data = result.data;
        this.name = this.data[0].name;
        this.address = this.data[0].address;
        this.phone = this.data[0].phone;
      } else {
        this.redirectTo({ value: "Home" });
      }
    },
    async deleteLocation() {
      let result = await axios.delete(
        `http://localhost:3000/locations/${this.id}`
      );
      let allCatsResults = [];
      for (var v = 0; v < this.allCategoriesIdIs.length; v++) {
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.allCategoriesIdIs[v]}`
        );
        if (result.status == 200) {
          allCatsResults.push(true);
        } else {
          allCatsResults.push(false);
        }
      }
      let allItemsResults = [];
      for (var y = 0; y < this.allItemsIdIs.length; y++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[y]}`
        );
        if (result.status == 200) {
          allItemsResults.push(true);
        } else {
          allItemsResults.push(false);
        }
      }
      if (
        result.status == 200 &&
        !allCatsResults.includes(false) &&
        !allItemsResults.includes(false)
      ) {
        this.successMessage = "Location is deleted ...";
        this.errorMessage = "";
        setTimeout(() => {
          this.redirectTo({ value: "Home" });
        }, 2000);
      } else {
        this.successMessage = "";
        this.errorMessage = "Something Went Wrong, try again";
      }
    },
  },
};
</script>

<style></style>
