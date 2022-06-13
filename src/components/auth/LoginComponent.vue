<template>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1>Login</h1>
        <div
          class="form-floating mb-3"
          :class="{ 'form-group-error': v$.email.$error }"
        >
          <input
            type="email"
            class="w250 form-control"
            id="floatEmailIs"
            placeholder="Your Email Is"
            v-model.trim="state.email"
          />
          <label for="floatEmailIs">Your Email Is</label>
          <span class="error-feedback" v-if="v$.email.$error">{{
            v$.email.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <div
          class="form-floating mb-3"
          :class="{ 'form-group-error': v$.password.$error }"
        >
          <input
            type="password"
            class="w250 form-control"
            id="floatPassIs"
            placeholder="Your Password Is"
            v-model.trim="state.password"
          />
          <label for="floatPassIs">Your Password Is</label>
          <span class="error-feedback" v-if="v$.password.$error">{{
            v$.password.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto d-block mx-auto">
        <button type="submit" @click="login()" class="w250 btn btn-success">
          Login
        </button>
      </div>
    </div>
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto d-block mx-auto">
        <button
          type="button"
          @click="redirectTo({ value: 'Register' })"
          class="w250 btn btn-primary"
        >
          Don't Have Account, Sign Up
        </button>
      </div>
    </div>
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
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import uesValidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { reactive, computed } from "vue";

export default {
  name: "LoginComponent",
  // Composition API
  setup() {
    const state = reactive({
      email: "",
      password: "",
    });
    // Validations
    const roles = computed(() => {
      return {
        email: { required, email },
        password: { required },
      };
    });

    const v$ = uesValidate(roles, state);
    return {
      state,
      v$,
    };
  },
  data() {
    return {
      successMessage: "",
      errorMessage: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.redirectTo({ value: "Home" });
    }
  },
  methods: {
    // منادات actions بطريقة مختصرة
    ...mapActions(["redirectTo"]),

    async login() {
      this.v$.$validate();

      if (!this.v$.$error) {
        let result = await axios.get(
          `http://localhost:3000/users?email=${this.state.email}&password=${this.state.password}`
        );

        if (result.status == 200 && result.data.length > 0) {
          localStorage.setItem("user-info", JSON.stringify(result.data[0]));
          this.redirectTo({ value: "Home" });
        } else {
          this.successMessage = "";
          this.errorMessage = "User Is Invalid!";
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "Must Enter Email and Pass!";
      }
    },
  },
};
</script>

<style scoped>
.error-feedback {
  color: red;
  font-size: 0.85em;
}
</style>
