<template>
  <div class="wrapper">
    <side-bar backgroundColor="darkblue" activeColor="success">
      <template slot="links">
        <sidebar-link to="/home" name="Clasificación" icon="ti-panel"/>
        <sidebar-link to="/rules" name="Mant. de Reglas" icon="ti-ruler"/>
        <sidebar-link to="/reports" name="Reportes" icon="ti-bar-chart" />
        <!-- <sidebar-link to="/table-list" name="Table List" icon="ti-view-list-alt"/>
        <sidebar-link to="/typography" name="Typography" icon="ti-text"/>
        <sidebar-link to="/icons" name="Icons" icon="ti-pencil-alt2"/>
        <sidebar-link to="/maps" name="Map" icon="ti-map"/>
        <sidebar-link to="/notifications" name="Notifications" icon="ti-bell"/> -->
      </template>
      <mobile-menu>
        <li class="nav-item">
          <a class="nav-link">
            <i class="ti-panel"></i>
            <p>Stats</p>
          </a>
        </li>
        <!-- <drop-down class="nav-item"
                   title="5 Notifications"
                   title-classes="nav-link"
                   icon="ti-bell">
          <a class="dropdown-item">Notification 1</a>
          <a class="dropdown-item">Notification 2</a>
          <a class="dropdown-item">Notification 3</a>
          <a class="dropdown-item">Notification 4</a>
          <a class="dropdown-item">Another notification</a>
        </drop-down> -->
        <li class="nav-item">
          <a class="nav-link">
            <i class="ti-settings"></i>
            <p>Settings</p>
          </a>
        </li>
        <li class="divider"></li>
      </mobile-menu>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script lang="js">
import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    TopNavbar,
    DashboardContent,
    MobileMenu
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>
