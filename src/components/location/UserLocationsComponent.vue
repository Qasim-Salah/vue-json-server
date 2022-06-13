<template>
  <table class="table caption-top" v-if="locations.length > 0">
    <caption>
      <span> List of Locations ({{ locations.length }}) </span>
      <span class="float-end">
        <router-link :to="{ name: 'DeleteAllLocations' }">
          <button class="btn btn-danger">Delete All</button>
        </router-link>
      </span>
    </caption>
    <thead class="table-dark">
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Phone</th>
        <th scope="col">Address</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(location, index) in locations" :key="index">
        <th scope="row">{{ location.name }}</th>
        <td>{{ location.phone }}</td>
        <td>{{ location.address }}</td>
        <td>
          <router-link
            :to="{
              name: 'DeleteLocation',
              params: { id: location.id },
            }"
          >
            <button class="btn btn-danger">Delete</button>
          </router-link>
          &nbsp;
          <router-link
            :to="{ name: 'UpdateLocation', params: { id: location.id } }"
          >
            <button class="btn btn-info">Update</button>
          </router-link>
          &nbsp;
          <router-link :to="{ name: 'Menu', params: { id: location.id } }">
            <button class="btn btn-success">Menu</button>
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else class="alert alert-warning mt15" role="alert">
    No Locations Added Yet
  </div>
</template>

<script>
export default {
  name: "UserLocationsComponent",
  props: ["locations"],
};
</script>

<style>
.mt15 {
  margin-top: 15px;
}
</style>
