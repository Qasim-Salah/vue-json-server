<template>
  <NavbarComponent />
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1>Update Restaurant</h1>
        <hr />
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
            id="floatRestNameIs"
            placeholder="Restaurant Name Is"
            v-model.trim="state.name"
          />
          <label for="floatRestNameIs">Restaurant Name Is</label>
          <span class="error-feedback" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <div
          class="form-floating mb-3"
          :class="{ 'form-group-error': v$.phone.$error }"
        >
          <input
            type="text"
            class="w250 form-control"
            id="floatRestPhoneIs"
            placeholder="Restaurant Phone No. Is"
            v-model.trim="state.phone"
          />
          <label for="floatRestPhoneIs">Restaurant Phone No. Is</label>
          <span class="error-feedback" v-if="v$.phone.$error">{{
            v$.phone.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <div
          class="form-floating mb-3"
          :class="{ 'form-group-error': v$.address.$error }"
        >
          <input
            type="text"
            class="w250 form-control"
            id="floatRestAddressIs"
            placeholder="Restaurant Address Is"
            v-model.trim="state.address"
          />
          <label for="floatRestAddressIs">Restaurant Address Is</label>
          <span class="error-feedback" v-if="v$.address.$error">{{
            v$.address.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto d-block mx-auto">
        <button
          type="button"
          @click="updateLocation()"
          class="w250 btn btn-warning"
        >
          Update Now
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
        class="col-auto d-block mx-auto alert alert-danger"
        v-if="errorMessage.length > 0"
      >
        {{ errorMessage }}
      </div>
    </div>
  </form>
</template>

<script>
import NavbarComponent from "@/components/layouts/NavbarComponent.vue";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import { mapActions } from "vuex";
import axios from "axios";

export default {
  name: "UpdateLocationComponent",
  components: {
    NavbarComponent,
  },
  setup() {
    const state = reactive({
      name: "",
      phone: "",
      address: "",
    });
    const rules = computed(() => {
      return {
        name: { required, minLength: minLength(8) },
        phone: { required, minLength: minLength(8) },
        address: { required, minLength: minLength(8) },
      };
    });
    const v$ = useValidate(rules, state);
    return {
      state,
      v$,
    };
  },
  data() {
    return {
      id: "",
      data: [],
      userId: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "Register" });
    } else {
      this.userId = JSON.parse(user).id;
      this.id = this.$route.params.id;
      this.canCurrentUserAccessThisLocation();
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.id}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.data = result.data;
        this.state.name = this.data[0].name;
        this.state.address = this.data[0].address;
        this.state.phone = this.data[0].phone;
      } else {
        this.redirectTo({ value: "Home" });
      }
    },
    async updateLocation() {
      this.v$.$validate(); //activate my validations
      if (!this.v$.$error) {
        console.log("Validated");
        let results = await axios.put(
          `http://localhost:3000/locations/${this.id}`,
          {
            name: this.state.name,
            phone: this.state.phone,
            address: this.state.address,
            userId: this.userId,
          }
        );
        if (results.status == 200) {
          this.errorMessage = "";
          this.successMessage = "Location is updated ...";
          setTimeout(() => {
            this.redirectTo({ value: "Home" });
          }, 2000);
          //show success message
          console.log("Updated This Location Successfully");
        } else {
          //show error message
          this.successMessage = "";
          this.errorMessage = "Something went wrong, please try again!";
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "You must fill in all required fields!";
      }
    },
  },
};
</script>

<style></style>
