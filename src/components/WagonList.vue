<template>
  <div class="wagon-container">
    <p v-for="wagon in wagons" class="wagon bg-nude" :key="wagon.id">
      {{ wagon.code }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    wagons: {
      type: Array,
      default: () => []
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
}
</style>
