<template>
  <div class="container">
    <NavbarComponent />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <h1>Update Profile</h1>
        <div class="col-auto d-block mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Enter your name"
            v-model="name"
          />
          <span class="error-feedback" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="email"
            class="form-control"
            placeholder="Enter your email"
            v-model="email"
          />
          <span class="error-feedback" v-if="v$.email.$error">{{
            v$.email.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="password"
            class="form-control"
            placeholder="Enter your password"
            v-model="password"
          />
          <span class="error-feedback" v-if="v$.password.$error">{{
            v$.password.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="submit"
            class="btn btn-primary"
            @click="updateProfile()"
          >
            UpdateProfile
          </button>
        </div>
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto error-feedback">
            {{ updateError }}
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import uesValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import NavbarComponent from "@/components/layouts/NavbarComponent";

export default {
  name: "ProfileComponent",
  components: { NavbarComponent },
  data() {
    return {
      v$: uesValidate(),
      id: "",
      name: "",
      email: "",
      password: "",
      updateError: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(8) },
      password: { required, minLength: minLength(8) },
      email: { required, email },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.id = JSON.parse(user).id;
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.password = JSON.parse(user).password;
    } else {
      this.redirectTo({ value: "Home" });
    }
  },
  methods: {
    // منادات actions بطريقة مختصرة
    ...mapActions(["redirectTo"]),

    async updateProfile() {
      this.v$.$validate();

      if (!this.v$.$error) {
        let result = await axios.put(`http://localhost:3000/users/${this.id}`, {
          name: this.name,
          email: this.email,
          password: this.password,
        });

        if (result.status == 200) {
          localStorage.setItem("user-info", JSON.stringify(result.data));
          this.redirectTo({ value: "Home" });
        }
        this.updateError = "Profile Is Not update ";
      }
    },
  },
};
</script>

<style scoped></style>
