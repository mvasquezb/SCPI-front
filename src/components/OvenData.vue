<template>
  <div class="bg-white oven-data">
    <div class="bg-nude oven-item">
      <p>Modelo</p>
      <p>{{ shift.productModel.code }}</p>
    </div>
    <div class="bg-nude oven-item">
      <p>Color</p>
      <p>{{ shift.productModel.color.name }}</p>
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
    shift: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      oven: this.shift.currentOven,
      castOp: this.shift.currentOven.wagons[0].castOperator,
      coatOp: this.shift.currentOven.wagons[0].coatOperator,
      polishOp: this.shift.currentOven.wagons[0].polishOperator
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
</style>
