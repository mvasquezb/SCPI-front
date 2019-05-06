<template>
  <div class="bg-white oven-data">
    <div class="bg-nude oven-item btn-action" @click="() => $router.push('model-selection')">
      <p>Modelo</p>
      <p>{{ data.productModel.code }}</p>
    </div>
    <div class="bg-nude oven-item btn-action" @click="() => $router.push('color-selection')">
      <p>Color</p>
      <p>{{ data.color.name }}</p>
    </div>
    <DataIndicator
      v-for="(item, index) in visibleInfoItems"
      :key="index"
      class="bg-nude oven-item"
      :title="item.title"
      :value="item.value.code"
      size="small"
    />
  </div>
</template>

<script>
import DataIndicator from "@/components/DataIndicator.vue";

export default {
  components: {
    DataIndicator
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      oven: this.data.currentOven,
      castOp: this.data.currentOven.wagons[0].castOperator,
      coatOp: this.data.currentOven.wagons[0].coatOperator,
      polishOp: this.data.currentOven.wagons[0].polishOperator
    };
  },
  computed: {
    visibleInfoItems() {
      return [
        {
          title: "Horno",
          value: this.oven
        },
        {
          title: "Colador",
          value: this.castOp
        },
        {
          title: "Barnizador",
          value: this.coatOp
        },
        {
          title: "Pulidor",
          value: this.polishOp
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.oven-data {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}
.oven-item {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin: 5px;
  padding: 5px 15px;
  text-align: center;

  p {
    margin: 0;
    font-weight: bold;
  }
}

.btn-action:hover {
  cursor: pointer;
}
</style>
