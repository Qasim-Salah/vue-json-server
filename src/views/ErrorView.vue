<template>
  <div>
    <img
      src="../assets/funny-404-page.jpg"
      class="rounded mx-auto d-block h400"
    />
    <div class="text-center">
      <router-link :to="{ name: 'Home' }">
        <button class="btn btn-info">Visit Home Page</button></router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorView",
};
</script>

<style scoped>
.h400 {
  height: 400px;
}
</style>
