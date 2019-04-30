<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <div class="col-4">
        <p class="p-0 m-0 page-title" href="#">Hola, {{currentUser.name}}</p>
      </div>
      <button
        class="navbar-toggler navbar-burger"
        type="button"
        @click="toggleSidebar"
        :aria-expanded="$sidebar.showSidebar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
      </button>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a href="#" class="btn btn-main" @click="doLogout">
              <i class="ti-shift-left-alt"></i>
              Salir
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script lang="js">
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
    ...mapState(["currentUser"]),
  },
  data() {
    return {
      activeNotifications: false
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    redirectToLogin() {
      if (!this.currentUser) {
        this.$router.replace("login");
      }
    },
    ...mapActions(["doLogout"])
  },
  watch: {
    currentUser() {
      this.redirectToLogin()
    }
  },
  created() {
    this.redirectToLogin();
  }
};
</script>
<style lang="scss">
.page-title {
  color: #66615B;
}
</style>
