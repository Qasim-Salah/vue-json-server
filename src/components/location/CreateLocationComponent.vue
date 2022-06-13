<template>
  <!-- Button trigger modal -->
  <button
    type="button"
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
  >
    Add New Restaurant
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-center" id="exampleModalLabel">
            Add New Restaurant
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @click.prevent>
            <div class="row g-3 align-items-center">
              <div class="col-auto d-block mx-auto">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter your name"
                  v-model.trim="state.name"
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
                  type="number"
                  class="form-control"
                  placeholder="Enter your phone"
                  v-model.trim="state.phone"
                />
                <span class="error-feedback" v-if="v$.phone.$error">{{
                  v$.phone.$errors[0].$message
                }}</span>
              </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
              <div class="col-auto d-block mx-auto">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter your address"
                  v-model.trim="state.address"
                />
                <span class="error-feedback" v-if="v$.address.$error">{{
                  v$.address.$errors[0].$message
                }}</span>
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
            </div>
            <div class="row g-3 align-items-center">
              <div
                class="col-auto d-block mx-auto alert alert-danger"
                v-if="errorMessage.length > 0"
              >
                {{ errorMessage }}
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" @click="addLocation()" class="btn btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { mapActions } from "vuex";
import uesValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";

export default {
  name: "CreateLocationComponent",
  // Composition API

  setup() {
    const state = reactive({
      name: "",
      phone: "",
      address: "",
      userId: "",
    });
    // Validations
    const roles = computed(() => {
      return {
        name: { required, minLength: minLength(8) },
        phone: { required, minLength: minLength(8) },
        address: { required, minLength: minLength(8) },
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
      userNotfound: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "Register" });
    } else {
      this.state.userId = JSON.parse(user).id;
    }
  },
  methods: {
    // منادات actions بطريقة مختصرة
    ...mapActions(["redirectTo"]),

    async addLocation() {
      this.v$.$validate();

      if (!this.v$.$error) {
        let result = await axios.post(`http://localhost:3000/locations`, {
          name: this.state.name,
          phone: this.state.phone,
          address: this.state.address,
          userId: this.state.userId,
        });

        if (result.status == 201) {
          this.errorMessage = "";
          this.successMessage = "Add New";

          setTimeout(() => {
            this.successMessage = "";
            this.errorMessage = "";
            this.state.name = "";
            this.state.phone = "";
            this.state.address = "";
            this.v$.address.$errors[0].$message = "";
            this.v$.name.$errors[0].$message = "";
            this.v$.phone.$errors[0].$message = "";
          }, 2000);
        }
        this.userNotfound = "Something Went Wrong";
      } else {
        this.successMessage = "";
        this.errorMessage = "Fill in all required fields";
      }
    },
  },
};
</script>

<style scoped></style>
