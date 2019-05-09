<template>
  <div class="wagon-container">
    <p
      v-for="wagon in wagons"
      class="wagon bg-nude"
      :class="{ 'selected': selectedWagon == wagon }"
      :key="wagon.id"
      @click="selectCurrentWagon(wagon)"
    >Vagoneta {{ wagon.code }}</p>
  </div>
</template>

<script>
export default {
  props: {
    wagons: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      selectedWagon: null,
    };
  },
  methods: {
    selectCurrentWagon(wagon) {
      this.selectedWagon = wagon;
      this.$emit('wagonSelect', wagon);
    }
  }
};
</script>

<style lang="scss">
.wagon {
  text-align: center;
  padding: 20px;
  font-weight: bold;
  font-size: 1.1rem;

  &.selected {
    border: 3px solid #3498db;
  }

  &:hover {
    background-color: #ccc;
    cursor: pointer;
  }
}
</style>
