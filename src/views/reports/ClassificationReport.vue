<template>
  <div class="report-classification row bg-white flex-column align-items-center pb-4">
    <h4>Reporte de Piezas</h4>
    <div class="selection-container col-12 pb-4">
      <div class="row justify-content-center">
        <h4>Reporte de Clasificado de Piezas</h4>
      </div>
      <div class="row">
        <b-form-select class="col-2 offset-1" v-model="config.oven" :options="ovenList"></b-form-select>
        <b-form-select class="col-2 offset-1" v-model="config.shift" :options="shiftList"></b-form-select>
        <b-form-select class="col-2 offset-1" v-model="config.product" :options="productList"></b-form-select>
        <b-button class="offset-1" variant="info" @click="generateReport">Generar Reporte</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      config: {
        oven: "Horno",
        shift: "Turno",
        product: "Tipo Pieza"
      }
    };
  },
  computed: {
    ...mapState(["factoryOvens", "shiftTypes", "productModels"]),
    ovenList() {
      return [
        "Horno",
        "TODOS",
        ...this.factoryOvens.map(o => {
          return {
            value: o.id,
            text: o.code,
            oven: o
          };
        })
      ];
    },
    productList() {
      return [
        "Tipo Pieza",
        "TODOS",
        ...Object.values(this.productModels)
          .reduce((a, b) => a.concat(b), [])
          .map(p => {
            return {
              value: p.id,
              text: p.name,
              product: p
            };
          })
      ];
    },
    shiftList() {
      return [
        "Turno",
        "TODOS",
        ...this.shiftTypes.map(t => {
          return {
            value: t.id,
            text: t.code,
            shift: t
          };
        })
      ];
    }
  },
  methods: {
    ...mapActions(["loadShiftTypes"]),
    generateReport() {
      console.log("generar reporte");
    }
  },
  mounted() {
    if (Object.keys(this.shiftTypes).length == 0) {
      this.loadShiftTypes();
    }
  }
};
</script>

<style lang="scss">
.report-classification {
  .selection-container {
    border: 1px solid black;
  }
  .btn-report {
    font-size: 2rem;
    border: 1px solid black;
    padding: 1rem 50px;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
