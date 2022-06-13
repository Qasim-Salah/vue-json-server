<template>
  <div class="container">
    <LoginComponent />
  </div>
</template>

<script>
import LoginComponent from "@/components/auth/LoginComponent";

export default {
  name: "LoginView",
  components: {
    LoginComponent,
  },
};
</script>

<style scoped></style>
