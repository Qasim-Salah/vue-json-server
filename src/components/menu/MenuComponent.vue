<template>
  <NavbarComponent />
  <div class="container">
    <div>
      <router-link
        :to="{ name: 'Categories', params: { locationId: locationId } }"
      >
        <button type="button" class="float-start btn btn-success">
          Categories
        </button>
      </router-link>
      <router-link
        :to="{ name: 'CreateItem', params: { locationId: locationId } }"
        v-if="numOfCategories > 0"
      >
        <button type="button" class="float-end btn btn-success">
          Add New Items
        </button>
      </router-link>
    </div>
    <div class="clearfix"></div>
    <div class="text-center">
      <h1 class="mb0">{{ locationName }}</h1>
      <p class="text-muted">{{ locationAddress }}</p>
    </div>
    <div class="clearfix"></div>
    <router-link
      v-if="listOfUserItems.length > 0"
      :to="{ name: 'DeleteAllItems', params: { locationId: locationId } }"
    >
      <button type="button" class="btn btn-danger">Delete All Items</button>
    </router-link>
    <div class="clearfix"></div>
    <div class="each-category">
      <div
        class=""
        v-for="(category, index) in listOfUserCategories"
        :key="index"
      >
        <div class="row">
          <div class="row col-12 catName">
            <h3 class="text-center bg-light p-1">{{ category.name }}</h3>
          </div>
          <div
            v-for="(item, i) in listOfUserItems"
            :key="i"
            v-show="category.id == item.categoryId"
            :class="{
              'col-xs-12 col-sm-4 px-4': category.id == item.categoryId,
            }"
          >
            <div
              v-if="category.id == item.categoryId"
              :class="{ 'each-item': category.id == item.categoryId }"
            >
              <h4 class="item-name">{{ item.name }}</h4>
              <p class="item-description text-muted">
                {{ item.description }}
              </p>
              <div>
                <div class="available-items float-start text-muted">
                  Available Qty: {{ numberWithCommas(item.qty) }}
                </div>
                <div class="item-price float-end text-muted">
                  Price: {{ numberWithCommas(item.price) }}
                </div>
              </div>
              <div class="clearfix"></div>
              <div class="p-1 mt-2">
                <div class="available-items float-start">
                  <router-link
                    :to="{
                      name: 'UpdateItem',
                      params: { itemId: item.id, locationId: locationId },
                    }"
                  >
                    <button type="button" class="float-end btn btn-info">
                      Update
                    </button>
                  </router-link>
                </div>
                <div class="item-price float-end">
                  <router-link
                    :to="{
                      name: 'DeleteItem',
                      params: { itemId: item.id, locationId: locationId },
                    }"
                  >
                    <button type="button" class="float-end btn btn-danger">
                      Delete
                    </button>
                  </router-link>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
            <hr />
          </div>
        </div>
        <br />
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import NavbarComponent from "@/components/layouts/NavbarComponent.vue";
import { mapActions, mapState, mapMutations } from "vuex";
import axios from "axios";
export default {
  components: { NavbarComponent },
  name: "MenuComponent",
  data() {
    return {
      userId: "",
      userName: "",
      locationId: this.$route.params.id,
      locationName: "",
      locationAddress: "",
      listOfUserCategories: [],
      listOfUserItems: [],
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
      this.canUserAccessThisLocation({
        userId: this.userId,
        locationId: this.locationId,
        redirectToPage: "Home",
      });
      this.getLocationInfo(this.userId, this.locationId);
      this.getCurrentUserCategories(this.userId, this.locationId);
      this.getCurrentUserItems(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
    ]),
    ...mapActions(["redirectTo"]),
    async getCurrentUserCategories(userId, locationId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locationId}`
      );
      if (result.status == 200) {
        this.listOfUserCategories = result.data;
        console.table(this.listOfUserCategories);
      }
    },
    async getCurrentUserItems(userId, locationId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&locId=${locationId}`
      );
      if (result.status == 200) {
        this.listOfUserItems = result.data;
        console.table(this.listOfUserItems);
      }
    },
    numberWithCommas(n) {
      return n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    },
    async getLocationInfo(userId, locationId) {
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
  },
};
</script>

<style>
.mb {
  margin-bottom: 0;
}
.item-description {
  padding-top: 12px;
  min-height: 100px;
}
</style>
