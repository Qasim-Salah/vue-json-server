<template>
  <NavbarComponent />
  <div class="container">
    <router-link
      :to="{ name: 'Categories', params: { locationId: locationId } }"
    >
      <button class="btn btn-info">Back to Category</button> </router-link
    >&nbsp;&nbsp;
    <router-link :to="{ name: 'Menu', params: { id: locationId } }">
      <button class="btn btn-success">Back to Menu</button>
    </router-link>
    <br />
    <div class="clearfix"></div>
    <div class="text-center">
      <h4 class="mb0">{{ locationName }}</h4>
      <p class="text-muted">{{ locationAddress }}</p>
    </div>
    <br />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Add New Category</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.name.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatRestCatIs"
              placeholder="Category Name Is"
              v-model.trim="name"
            />
            <label for="floatRestCatIs">Category Name Is</label>
            <span class="error-feedback" v-if="v$.name.$error">{{
              v$.name.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center mb-3">
        <div class="col-auto d-block mx-auto">
          <button
            type="button"
            @click="addCategory()"
            class="w250 btn btn-success"
          >
            Add Now
          </button>
        </div>
      </div>
      <div class="row g-3 align-items-center mb-3">
        <div
          class="col-auto d-block mx-auto alert alert-success"
          v-if="successMessage.length > 0"
        >
          {{ successMessage }}
        </div>
        <div
          class="col-auto d-block mx-auto alert alert-danger mb-3"
          v-if="errorMessage.length > 0"
        >
          {{ errorMessage }}
        </div>
      </div>
      <br />
    </form>
  </div>
</template>

<script>
import NavbarComponent from "@/components/layouts/NavbarComponent.vue";
import { mapActions, mapMutations } from "vuex";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
export default {
  name: "CreateCategoryComponent",
  components: {
    NavbarComponent,
  },
  data() {
    return {
      v$: useValidate(),
      locationId: this.$route.params.locationId,
      userId: "",
      locationName: "",
      locationAddress: "",
      name: "",
      successMessage: "",
      errorMessage: "",
      listOfUserCategories: [],
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(3), maxLength: maxLength(15) },
    };
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
      this.getLocationInfo(this.userId, this.locationId);
      this.displayUserCategories(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
    ]),
    ...mapActions(["redirectTo"]),
    async displayUserCategories(userId, locationId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locationId}`
      );
      if (result.status == 200) {
        this.listOfUserCategories = result.data;
      }
    },
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
    async addCategory() {
      this.v$.$validate();
      let filterCategoryName = this.listOfUserCategories.filter(
        (v) => v.name.toLocaleLowerCase() == this.name.toLocaleLowerCase()
      );
      if (!this.v$.$error) {
        if (filterCategoryName.length > 0) {
          this.errorMessage = "Category Name already exists, try another name";
          this.successMessage = "";
        } else {
          let result = await axios.post(`http://localhost:3000/categories`, {
            name: this.name,
            userId: this.userId,
            locationId: parseInt(this.locationId, 10),
          });

          if (result.status == 201) {
            this.errorMessage = "";
            this.successMessage = "Added New Category Successfully";
            setTimeout(() => {
              this.$router.push({
                name: "Categories",
                params: { locationId: this.locationId },
              });
            }, 2000);
          } else {
            this.successMessage = "";
            this.errorMessage = "Something went wrong, try again..";
          }
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "You must fill in category name";
      }
    },
  },
};
</script>

<style></style>
