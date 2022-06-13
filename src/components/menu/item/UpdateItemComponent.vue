<template>
  <NavbarComponent />
  <div class="container">
    <div class="clearfix"></div>
    <router-link :to="{ name: 'Menu', params: { id: locationId } }">
      <button type="button" class="float-start btn btn-info">
        Back to Menu
      </button>
    </router-link>
    <div class="clearfix"></div>
    <br />
    <div class="text-center">
      <h4 class="mb0">{{ locationName }}</h4>
      <p class="text-muted">{{ locationAddress }}</p>
    </div>
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <hr />
          <h1>Update Item</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemName.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatItemName"
              placeholder="Enter Item Name"
              v-model.trim="itemName"
            />
            <label for="floatItemName">Enter Item Name</label>
            <span class="error-feedback" v-if="v$.itemName.$error">{{
              v$.itemName.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemPrice.$error }"
          >
            <input
              type="Number"
              class="w250 form-control"
              id="floatItemPrice"
              placeholder="Enter Item Price"
              v-model.trim="itemPrice"
            />
            <label for="floatItemPrice">Enter Item Price</label>
            <span class="error-feedback" v-if="v$.itemPrice.$error">{{
              v$.itemPrice.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemsQty.$error }"
          >
            <input
              type="number"
              class="w250 form-control"
              id="floatItemQty"
              placeholder="Enter Item Quantities"
              v-model.trim="itemsQty"
            />
            <label for="floatItemQty">Enter Item Quantities</label>
            <span class="error-feedback" v-if="v$.itemsQty.$error">{{
              v$.itemsQty.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.description.$error }"
          >
            <textarea
              class="w250 form-control h100"
              placeholder="Enter Item Descriptions"
              id="floatItemDescriptions"
              v-model.trim="description"
            ></textarea>
            <label for="floatItemDescriptions">Enter Item Descriptions</label>
            <span class="error-feedback" v-if="v$.description.$error">{{
              v$.description.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.categoryId.$error }"
          >
            <select
              class="w250 form-select"
              id="floatItemCategory"
              v-model.trim="categoryId"
            >
              <option
                v-for="(category, index) in listOfCategories"
                :key="index"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <label for="floatItemCategory">Select Category Name</label>
            <span class="error-feedback" v-if="v$.categoryId.$error">{{
              v$.categoryId.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="button"
            @click="UpdateItem()"
            class="w250 btn btn-warning"
          >
            Update Now
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
          class="col-auto d-block mx-auto alert alert-danger"
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
import { mapActions, mapState, mapMutations } from "vuex";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength, between } from "@vuelidate/validators";
import axios from "axios";
export default {
  components: { NavbarComponent },
  name: "UpdateItemComponent",
  data() {
    return {
      v$: useValidate(),
      userId: "",
      userName: "",
      locationId: this.$route.params.locationId,
      itemId: this.$route.params.itemId,
      locationName: "",
      locationAddress: "",
      successMessage: "",
      errorMessage: "",
      categoryId: "",
      itemName: "",
      description: "",
      itemsQty: 1,
      itemPrice: "",
    };
  },
  computed: {
    ...mapState([
      "isUserLoggedIn",
      "loggedInUserId",
      "numOfCategories",
      "listOfCategories",
      "listOfLocations",
      "listOfItems",
    ]),
  },
  validations() {
    return {
      itemName: { required, minLength: minLength(6) },
      description: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(120),
      },
      itemsQty: { required, between: between(1, 100000) },
      itemPrice: { required, between: between(0, 1000000) },
      categoryId: { required },
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "Register" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.isLoggedInUser();
      this.displayAllCategories({
        userId: this.userId,
        locationId: this.locationId,
      });
      this.canUserAccessThisItem({
        userId: this.userId,
        locationId: this.locationId,
        itemId: this.itemId,
        redirectToPage: "Home",
      });
      this.canUserAccessThisLocation({
        userId: this.userId,
        locationId: this.locationId,
        redirectToPage: "Home",
      });
      this.getLocationInfo(this.userId, this.locationId);
      this.getItemInfo(this.userId, this.locationId, this.itemId);
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
      "canUserAccessThisItem",
    ]),
    ...mapActions(["redirectTo"]),
    async getItemInfo(userId, locationId, itemId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&locationId=${locationId}&id=${itemId}`
      );
      let resultData = result.data[0];
      if (result.status == 200) {
        this.description = resultData.description;
        this.itemName = resultData.name;
        this.itemsQty = resultData.qty;
        this.itemPrice = resultData.price;
        this.categoryId = resultData.categoryId;
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
        if (locationDetails.length > 0) {
          this.locationName = locationDetails[0].name;
          this.locationAddress = locationDetails[0].address;
        }
      }
    },
    async UpdateItem() {
      this.v$.$validate(); //activate my validations
      if (!this.v$.$error) {
        let results = await axios.put(
          `http://localhost:3000/items/${this.itemId}`,
          {
            name: this.itemName,
            price: parseFloat(this.itemPrice).toFixed(2),
            description: this.description,
            qty: parseInt(this.itemsQty),
            userId: this.userId,
            locationId: parseInt(this.locationId),
            categoryId: this.categoryId,
          }
        );
        if (results.status == 200) {
          this.errorMessage = "";
          this.successMessage = "Item Updated Successfully ...";
          setTimeout(() => {
            this.$router.push({
              name: "Menu",
              params: { id: this.locationId },
            });
          }, 2000);
          //show success message
          console.log("Item Updated Successfully ...");
        } else {
          //show error message
          this.successMessage = "";
          this.errorMessage = "Something went wrong, please try again!";
          console.log("Failed Updating this Item");
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "You must fill in all required fields!";
      }
    },
  },
};
</script>

<style>
.mb {
  margin-bottom: 0;
}
.w250 {
  min-width: 250px;
}
.h100 {
  min-height: 100px !important;
}
.form-group-error {
  color: red;
}
.form-group-error input,
.form-group-error select,
.form-group-error textarea {
  border-color: red;
}
</style>
