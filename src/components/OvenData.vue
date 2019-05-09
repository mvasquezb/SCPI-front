<template>
  <div class="bg-white oven-data">
    <div class="bg-nude oven-item btn-action" @click="() => $router.push('model-selection')">
      <p>Modelo</p>
      <p v-if="data.productModel">{{ data.productModel.code }}</p>
      <button v-else class="btn btn-default">Seleccionar</button>
    </div>
    <div class="bg-nude oven-item btn-action" @click="() => $router.push('color-selection')">
      <p>Color</p>
      <p v-if="data.color">{{ data.color.name }}</p>
      <button v-else class="btn btn-default">Seleccionar</button>
    </div>
    <DataIndicator
      v-for="(item, index) in visibleInfoItems"
      :key="index"
      class="bg-nude oven-item"
      :class="{ 'btn-action': item.action }"
      :title="item.title"
      :value="item.value ? item.value.code : String.fromCharCode(160)"
      size="small"
      @click.native="runItemAction(item)"
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
          action: 'cast-selection',
        },
        {
          title: "Barnizador",
          value: this.data.coatOperator,
          action: 'coat-selection',
        },
        {
          title: "Pulidor",
          value: this.data.polishOperator,
          action: 'polish-selection',
        }
      ];
    }
  },
  methods: {
    runItemAction(item) {
      if (item.action) {
        this.$router.push(item.action);
      }
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
  background-color: #ccc;
}
</style>
