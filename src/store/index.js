import { createStore } from "vuex";
import router from "../router/index";
import axios from "axios";

const state = {
  isUserLoggedIn: "",
  loggedInUserId: "",
  numOfCategories: "",
  listOfCategories: [],
  listOfItems: [],
  listOfLocations: [],
};
const getters = {};
const mutations = {
  // state اول برام اجباري الاستدعاء
  redirectTo(state, payload) {
    router.push({ name: payload });
  },

  isLoggedInUser(state) {
    let user = localStorage.getItem("user-info");
    if (user) {
      state.isUserLoggedIn = true;
      state.loggedInUserId = JSON.parse(user).id;
    } else {
      state.isUserLoggedIn = false;
    }
  },

  async displayAllCategories(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/categories?userId=${payload.userId}&locationId=${payload.locationId}`
    );
    if (result.status == 200) {
      state.listOfCategories = result.data;
      state.numOfCategories = state.listOfCategories.length;
    }
  },

  async canUserAccessThisLocation(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${payload.userId}&id=${payload.locationId}`
    );
    if (result.status == 200) {
      state.listOfLocations = result.data;
      if (state.listOfLocations.length !== 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    }
  },

  async canUserAccessThisCategory(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/categories?userId=${payload.userId}&locationId=${payload.locationId}&id=${payload.categoryId}`
    );
    if (result.status == 200) {
      state.listOfCategories = result.data;
      if (state.listOfCategories.length !== 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    }
  },

  async canUserAccessThisItem(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/items?userId=${payload.userId}&locId=${payload.locationId}&id=${payload.itemId}`
    );
    if (result.status == 200) {
      state.listOfItems = result.data;
      if (state.listOfItems.length < 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    }
  },
};
const actions = {
  // منادات mutations
  redirectTo({ commit }, payload) {
    commit("redirectTo", payload.value);
  },
};

export default createStore({
  // state : state لا تحتاج الى هذا طالما الاسم نفسة
  state,
  getters,
  mutations,
  actions,
  modules: {},
});
