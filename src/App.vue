<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications></notifications>
    <LoadingSpinner v-if="loading" />
    <router-view></router-view>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { mapState } from 'vuex';
import http from './http';

export default {
  components: {
    LoadingSpinner,
  },
  computed: {
    ...mapState(["loading", "operationError", "operationSuccessful"]),
  },
  watch: {
    operationError() {
      if (this.operationError) {
        this.$notify({ message: this.operationError, type: "danger" });
      }
    }
  },
  mounted() {
    http.head("probe").then((r) => console.log(r));
  }
};
</script>

<style lang="scss">
.vue-notifyjs.notifications {
  .alert {
    z-index: 10000;
  }
  .list-move {
    transition: transform 0.3s, opacity 0.4s;
  }
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active {
    transition: transform 0.2s ease-in, opacity 0.4s ease-in;
  }
  .list-leave-active {
    transition: transform 1s ease-out, opacity 0.4s ease-out;
  }

  .list-enter {
    opacity: 0;
    transform: scale(1.1);
  }
  .list-leave-to {
    opacity: 0;
    transform: scale(1.2, 0.7);
  }
}
</style>
