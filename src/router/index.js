import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import ProfileView from "@/views/profile/ProfileView";
import ErrorView from "@/views/ErrorView";
import MenuView from "@/views/menu/MenuView";
import DeleteLocationView from "@/views/location/DeleteLocationView";
import DeleteAllLocationView from "@/views/location/DeleteAllLocationView";
import UpdateLocationView from "@/views/location/UpdateLocationView";
import CreateCategoryView from "@/views/menu/category/CreateCategoryView";
import CategoriesView from "@/views/menu/category/CategoriesView";
import UpdateCategoryView from "@/views/menu/category/UpdateCategoryView";
import DeleteCategoryView from "@/views/menu/category/DeleteCategoryView";
import DeleteAllCategoriesView from "@/views/menu/category/DeleteAllCategoriesView";
import CreateItemView from "@/views/menu/item/CreateItemView";
import UpdateItemView from "@/views/menu/item/UpdateItemView";
import DeleteItemView from "@/views/menu/item/DeleteItemView";
import DeleteAllItemsView from "@/views/menu/item/DeleteAllItemsView";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  /* Start Auth */
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  /* End Auth */
  /* Start Profile */
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
  },
  /* end Profile */
  /* Start Location */
  {
    path: "/location/update/:id",
    name: "UpdateLocation",
    component: UpdateLocationView,
  },
  {
    path: "/location/delete/:id",
    name: "DeleteLocation",
    component: DeleteLocationView,
  },
  {
    path: "/locations/delete-all",
    name: "DeleteAllLocations",
    component: DeleteAllLocationView,
  },
  /* End Location */
  /* Start menu */
  {
    path: "/menu/:id",
    name: "Menu",
    component: MenuView,
  },
  /* Start Category */
  {
    path: "/menu/categories/:locationId",
    name: "Categories",
    component: CategoriesView,
  },
  {
    path: "/menu/categories/create/:locationId",
    name: "CreateCategory",
    component: CreateCategoryView,
  },
  {
    path: "/menu/categories/update/:locationId/:categoryId",
    name: "UpdateCategory",
    component: UpdateCategoryView,
  },
  {
    path: "/menu/categories/delete/:categoryId/location/:locationId",
    name: "DeleteCategory",
    component: DeleteCategoryView,
  },
  {
    path: "/menu/categories/delete/all/:locationId",
    name: "DeleteAllCategories",
    component: DeleteAllCategoriesView,
  },
  /* End Category */
  /* Start Item */
  {
    path: "/menu/items/create/location/:locationId",
    name: "CreateItem",
    component: CreateItemView,
  },
  {
    path: "/menu/item/update/:itemId/location/:locationId",
    name: "UpdateItem",
    component: UpdateItemView,
  },
  {
    path: "/menu/item/:itemId/delete/location/:locationId",
    name: "DeleteItem",
    component: DeleteItemView,
  },
  {
    path: "/menu/items/delete-all/location/:locationId",
    name: "DeleteAllItems",
    component: DeleteAllItemsView,
  },
  /* End Item */

  /* End menu */
  {
    path: "/:catchAll(.*)",
    name: "ErrorPage",
    component: ErrorView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.params.pageTitle !== undefined) {
    document.title = `${to.params.name}`;
  }
  if (to.name == null) {
    document.title = `${process.env.VUE_APP_TITLE}`;
  }
  document.title = `${to.name}`;

  next();
});
export default router;
