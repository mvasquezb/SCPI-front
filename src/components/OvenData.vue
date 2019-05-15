<template>
  <div class="bg-white oven-data">
    <div class="oven-item col-2">
      <p>Última clasificación</p>
    </div>
    <div class="bg-nude oven-item">
      <p>Modelo</p>
      <p v-if="data.productModel">{{ data.productModel.code }}</p>
    </div>
    <div class="bg-nude oven-item">
      <p>Color</p>
      <p v-if="data.color">{{ data.color.name }}</p>
    </div>
    <DataIndicator
      v-for="(item, index) in visibleInfoItems"
      :key="index"
      class="bg-nude oven-item"
      :title="item.title"
      :value="item.value ? item.value.code : String.fromCharCode(160)"
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
  computed: {
    visibleInfoItems() {
      return [
        {
          title: "Horno",
          value: this.data.currentOven,
        },
        {
          title: "Colador",
          value: this.data.castOperator,
        },
        {
          title: "Barnizador",
          value: this.data.coatOperator,
        },
        {
          title: "Pulidor",
          value: this.data.polishOperator,
        }
      ];
    }
  },
  methods: {
    // runItemAction(item) {
    //   if (item.action) {
    //     this.$router.push(item.action);
    //   }
    // }
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
  padding: 5px 10px;
  text-align: center;

  p {
    margin: 0;
    font-weight: bold;
  }
}
</style>
