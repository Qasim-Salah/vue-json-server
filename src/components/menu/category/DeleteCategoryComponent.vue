<template>
  <div class="container">
    <NavbarComponent />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete Category #{{ categoryId }}</h1>
          <h4>Category Name: {{ name }}</h4>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete this Category?
          </p>
          <p class="text-danger">
            When Deleting this category, it will delete all related menu items
            as well...
          </p>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button class="btn btn-info" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteCategory()">
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
import NavbarComponent from "@/components/layouts/NavbarComponent.vue";
import { mapActions, mapMutations } from "vuex";
import axios from "axios";
export default {
  name: "DeleteCategoryComponent",
  components: {
    NavbarComponent,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      categoryId: this.$route.params.categoryId,
      userId: "",
      locationData: [],
      successMessage: "",
      errorMessage: "",
      name: "",
      allItemsIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "Register" });
    } else {
      this.locationId = this.$route.params.locationId;
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      this.canUserAccessThisCategory({
        userId: this.userId,
        categoryId: this.categoryId,
        locationId: this.locationId,
        redirectToPage: "Home",
      });
      this.getCategoryName(this.userId, this.locationId, this.categoryId);
      let result = await axios.get(
        `http://localhost:3000/items?catId=${this.categoryId}`
      );
      console.log(result.data.length);
      let resultLen = result.data.length;
      for (var i = 0; i < resultLen; i++) {
        this.allItemsIdIs.push(result.data[i].id);
      }
    }
  },
  methods: {
    ...mapMutations(["canUserAccessThisCategory"]),
    ...mapActions(["redirectTo"]),
    goBack() {
      this.$router.push({
        name: "ViewCategories",
        params: { locationId: this.locationId },
      });
    },
    async getCategoryName(userId, locationId, categoryId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locationId}&id=${categoryId}`
      );
      if (result.status == 200) {
        this.categoryNames = result.data;
        if (this.categoryNames.length > 0) {
          this.name = this.categoryNames[0].name;
        }
      }
    },
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.name = this.locationData[0].name;
        this.address = this.locationData[0].address;
        this.phone = this.locationData[0].phone;
      } else {
        this.redirectTo({ value: "Home" });
      }
    },
    async deleteCategory() {
      let result = await axios.delete(
        `http://localhost:3000/categories/${this.categoryId}`
      );
      let allResults = [];
      for (var i = 0; i < this.allItemsIdIs.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[i]}`
        );
        if (result.status == 200) {
          allResults.push(true);
        } else {
          allResults.push(false);
        }
      }
      if (result.status == 200 && !allResults.includes(false)) {
        this.successMessage = "Category and related items are deleted ...";
        this.errorMessage = "";
        setTimeout(() => {
          this.$router.push({
            name: "Categories",
            params: { locationId: this.locationId },
          });
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
