<template>
  <div class="report-classification row bg-white flex-column align-items-center pb-4">
    <div class="selection-container col-12" :class="{ 'pb-4': reportData == null }">
      <div class="row justify-content-center">
        <h4>Reporte de Clasificado de Piezas</h4>
      </div>
      <div class="row">
        <b-form-select class="col-2 ml-5" v-model="config.oven" :options="ovenList"></b-form-select>
        <b-form-select class="col-2 offset-1" v-model="config.shift" :options="shiftList"></b-form-select>
        <b-form-select class="col-2 offset-1" v-model="config.product" :options="productList"></b-form-select>
        <b-button class="offset-1" variant="info" @click="generateReport">Generar Reporte</b-button>
      </div>
      <div v-if="reportData" class="row justify-content-center mt-3">
        <div class="col-12">
          <b-table
            show-empty
            responsive
            stacked="md"
            outlined
            hover
            primary-key="id"
            :items="reportData"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            head-variant="light"
            @filtered="onFiltered"
          >
            <template
              slot="index"
              slot-scope="row"
            >{{ (currentPage - 1) * perPage + row.index + 1 }}</template>

            <template slot="actions" slot-scope="row">
              <div class="d-flex justify-content-between row-actions">
                <router-link
                  :to="`/rules/${row.item.id}`"
                  class="btn btn-sm btn-default"
                  title="Editar"
                >
                  <i class="ti-pencil"></i>
                </router-link>
                <b-button
                  size="sm"
                  variant="danger"
                  @click="confirmDelete(row.item)"
                  title="Eliminar"
                >
                  <i class="ti-trash"></i>
                </b-button>
              </div>
            </template>

            <template slot="empty">
              <p class="text-center">Aún no hay registros</p>
            </template>
            <template slot="emptyfiltered">
              <p class="text-center">No hay registros con esas características</p>
            </template>
          </b-table>
          <b-row>
            <b-col md="6" class="my-1">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                class="my-0"
              ></b-pagination>
            </b-col>
            <b-col md="3" class="offset-md-3 text-right">
              <b-button variant="info">Exportar Reporte</b-button>
            </b-col>
          </b-row>
        </div>
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
      },
      reportData: null,
      fields: [
        { key: "index", label: "#" },
        {
          key: "productCode",
          label: "Producto"
          // tdClass: "w-20 text-truncate"
        },
        {
          key: "colorId",
          label: "Color"
          // tdClass: "w-25 text-truncate"
        },
        { key: "ovenId", label: "Horno" /*tdClass: "w-25"*/ },
        { key: "assignedQCode", label: "Calidad Operario" /*tdClass: "w-25"*/ },
        { key: "systemQCode", label: "Calidad Sistema" /*tdClass: "w-25"*/ },
        { key: "quantity", label: "Cantidad" /*tdClass: "w-25"*/ },
        { key: "defectCode", label: "Defecto" /*tdClass: "w-25"*/ },
        { key: "zoneCode", label: "Zona" /*tdClass: "w-25"*/ },
        { key: "wagonCode", label: "Vagoneta" /*tdClass: "w-25"*/ },
        { key: "castOp", label: "Colador" /*tdClass: "w-25"*/ },
        { key: "polishOp", label: "Pulidor" /*tdClass: "w-25"*/ },
        { key: "coatOp", label: "Barnizador" /*tdClass: "w-25"*/ }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      filter: ""
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
    ...mapActions(["loadShiftTypes", "getClassificationReport"]),
    generateReport() {
      console.log("generar reporte");
      if (!this.validate()) {
        return;
      }
      this.getClassificationReport({
        shiftId: this.config.shift,
        ovenId: this.config.oven,
        productId: this.config.product
      }).then(reportData => (this.reportData = reportData));
    },
    validate() {
      if (this.config.oven == "Horno") {
        this.$notify({ message: "Seleccione el horno", type: "danger" });
        return false;
      }
      if (this.config.shift == "Turno") {
        this.$notify({ message: "Seleccione el turno", type: "danger" });
        return false;
      }
      if (this.config.product == "Tipo Pieza") {
        this.$notify({
          message: "Seleccione el tipo de pieza",
          type: "danger"
        });
        return false;
      }
      return true;
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  mounted() {
    if (Object.keys(this.shiftTypes).length == 0) {
      this.loadShiftTypes();
    }
  },
  watch: {
    reportData() {
      this.totalRows = this.reportData.length;
    }
  }
};
</script>

<style lang="scss">
.report-classification {
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
