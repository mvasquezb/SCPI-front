<template>
  <div class="bg-white classification-data">
    <div class="classification-item col-2">
      <p>Calidad</p>
    </div>
    <div class="data-container col-10 d-flex justify-content-between">
      <DataIndicator
        v-for="(item, index) in visibleInfoItems"
        :key="index"
        class="bg-nude classification-item"
        :title="item.title"
        :value="item.value.repr"
        size="small"
      />
    </div>
  </div>
</template>

<script>
import DataIndicator from "@/components/DataIndicator.vue";

export default {
  components: {
    DataIndicator
  },
  props: {
    classification: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      quantity: this.classification.quantity,
      defect: this.classification.defect,
      location: this.classification.defect.affectedZone,
      wagon: this.classification.wagon,
      date: Date.now()
    };
  },
  computed: {
    visibleInfoItems() {
      return [
        {
          title: "Cantidad",
          value: { repr: this.quantity || '-' }
        },
        {
          title: "Defecto",
          value: { ...this.defect, repr: this.defect && this.defect.defectType ? this.defect.defectType.code : '-' }
        },
        {
          title: "Ubicación",
          value: { ...this.location, repr: this.location ? this.location.code.padStart(2, "0") : '-' }
        },
        {
          title: "Vagoneta",
          value: { ...this.wagon, repr: this.wagon ? this.wagon.code : '-' }
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.classification-data {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.classification-item {
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
