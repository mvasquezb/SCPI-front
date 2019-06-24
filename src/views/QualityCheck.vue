<template>
  <div class="q-check bg-white d-flex flex-column align-items-center">
    <h4>Evaluación de Calidad</h4>
    <div class="row w-90 classification-summary bg-nude">
      <div class="col-7 d-flex flex-column">
        <div
          v-for="(item, index) in summaryData"
          :key="index"
          class="summary-item d-flex justify-content-between"
        >
          <div class="d-flex flex-shrink align-items-center">
            <p class="label">{{ item.label }}:</p>
            <p class="value">{{ item.value }}</p>
          </div>
          <router-link
            class="btn btn-default q-edit"
            v-if="item.route && !item.btn"
            :to="item.route"
          >
            <i class="ti-pencil"></i>
          </router-link>
          <b-btn
            variant="default"
            class="q-edit"
            v-if="item.route && item.btn"
            @click="handleEditBtn(item.route)"
          >
            <i class="ti-pencil"></i>
          </b-btn>
          <button
            class="btn btn-default"
            v-b-modal.wagon-info-modal
            v-if="item.label == 'Vagoneta'"
          >Ver detalle</button>
          <!-- <button class="btn btn-default" v-if="item.action" @click="item.action">Editar</button> -->
        </div>
      </div>
      <div class="col-5 d-flex flex-column">
        <div
          v-for="(item, index) in wagonOperators"
          :key="index"
          class="summary-item d-flex justify-content-between"
        >
          <div class="d-flex flex-shrink align-items-center">
            <p class="label" :class="{ 'invisible': !item.label }">{{ item.label }}:</p>
            <p class="value">{{ item.value }}</p>
          </div>
          <router-link class="btn btn-default q-edit" v-if="item.route" :to="item.route">
            <i class="ti-pencil"></i>
          </router-link>
          <!-- <button class="btn btn-default" v-if="item.action" @click="item.action">Editar</button> -->
        </div>
      </div>
      <div class="summary-item d-flex flex-column col-12">
        <div class="defect-list-header d-flex justify-content-between align-items-center pb-2">
          <p class="label m-0">Defectos</p>
          <button
            class="btn btn-info btn-add-defect align-self-center m-0"
            @click="goToAddDefect"
          >Registrar Defecto</button>
        </div>
        <ul class="defect-list">
          <li v-for="(defect, index) in defects" :key="index" class="defect-item">
            <p class="defect-description">{{ defect.text }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="row w-90 mx-1 my-2">
      <div class="col-12 footer">
        <button class="btn btn-default btn-back" @click="$router.push('home')">Volver</button>
        <button class="btn btn-success btn-next" @click="onSubmit">Finalizar</button>
      </div>
    </div>
    <b-modal id="confirm-modal" size="lg" title="Confirmar Clasificación" @ok="onFinish">
      <template slot="default">
        <p>{{ systemQualityText }}</p>
        <p>¿ Confirma el nivel de calidad determinado ?</p>
      </template>

      <template slot="modal-footer" slot-scope="{ ok, hide }">
        <b-button variant="danger" @click="hide()">Cancelar</b-button>
        <b-button variant="info" @click="$router.push('quality-selection')">Seleccionar otro</b-button>
        <b-button v-if="systemQualityLevel" variant="success" @click="ok()">Confirmar</b-button>
        <!-- Button with custom close trigger value -->
      </template>
    </b-modal>

    <b-modal id="wagon-info-modal" size="lg" title="Detalle de Vagoneta">
      <template slot="modal-title">Detalle de Vagoneta {{ wagon.code.padStart(2, "0") }}</template>
      <template slot="default">
        <div class="row">
          <div class="col-6 text-center">
            <h4>Pieza</h4>
          </div>
          <div class="col-6 text-center">
            <h4>Cantidad Clasificada</h4>
          </div>
        </div>
        <div
          class="row"
          v-for="product in wagonProducts"
          :key="`${product.productModel.id}:${product.color.id}`"
        >
          <div class="col-6">
            <p>{{ product.productModel.name }} - {{ product.color.name }}</p>
          </div>
          <div class="col-6 text-center">
            <p>{{ product.classifiedPieces }} / {{ product.quantity ? product.quantity : '-' }}</p>
          </div>
        </div>
      </template>

      <template slot="modal-footer" slot-scope="{ hide }">
        <b-button variant="default" @click="hide()">Aceptar</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState(["currentClassification", "loading", "productsPerWagon"]),
    summaryData() {
      return [
        {
          label: "Horno",
          value: this.currentClassification.currentOven.code
        },
        {
          label: "Vagoneta",
          value: "Vagoneta " + this.currentClassification.currentWagon.code
        },
        {
          label: "Modelo",
          value: this.currentClassification.productModel
            ? this.currentClassification.productModel.name
            : "No seleccionado",
          route: "model-selection",
          btn: true
        },
        {
          label: "Color",
          value: this.currentClassification.color
            ? this.currentClassification.color.name
            : "No seleccionado",
          route: "color-selection"
        }
      ];
    },
    wagonProducts() {
      let key = `${this.currentClassification.currentOven.id}:${
        this.currentClassification.currentWagon.id
      }`;
      return this.productsPerWagon[key];
    },
    wagonOperators() {
      return [
        {
          label: "",
          value: "",
          route: ""
        },
        {
          label: "Pulidor",
          value: this.currentClassification.polishOperator.code,
          route: "polish-selection"
        },
        {
          label: "Barnizador",
          value: this.currentClassification.coatOperator.code,
          route: "coat-selection"
        },
        {
          label: "Colador",
          value: this.currentClassification.castOperator.code,
          route: "cast-selection"
        }
      ];
    },
    defects() {
      return (this.currentClassification.defects || []).map(d => {
        return {
          ...d,
          text: `${d.defectType.name} en ${d.affectedZone.name} por ${
            d.defectType.defectArea.name
          }`
        };
      });
    },
    assignedQualityLevel() {
      return this.currentClassification.assignedQualityLevel;
    },
    systemQualityLevel() {
      return this.currentClassification.systemQualityLevel;
    },
    assignedQualityText() {
      if (!this.assignedQualityLevel) {
        return "No definido";
      }
      let text = this.assignedQualityLevel.name;
      if (this.assignedQualityLevel.code == "S") {
        return `${text} - ${this.currentClassification.repair.repairType.name}`;
      }
      if (this.assignedQualityLevel.code == "V") {
        return `${text} - ${
          this.currentClassification.evaluation.evaluationType.name
        }`;
      }
      return text;
    },
    systemQualityText() {
      if (!this.systemQualityLevel) {
        return "No se pudo llegar a una conclusión sobre el nivel de calidad del producto";
      }
      let text = `Se ha determinado el nivel de calidad: ${
        this.systemQualityLevel.name
      }`;
      if (this.systemQualityLevel.code == "S") {
        return `${text} ${
          this.currentClassification.repair
            ? "- " + this.currentClassification.repair.repairType.name
            : ""
        }`;
      }
      if (this.systemQualityLevel.code == "V") {
        return `${text} ${
          this.currentClassification.evaluation
            ? "- " + this.currentClassification.evaluation.evaluationType.name
            : ""
        }`;
      }
      return text;
    },
    wagon() {
      return this.currentClassification.currentWagon;
    }
  },
  methods: {
    ...mapActions([
      "saveClassification",
      "systemEvaluate",
      "createClassification",
      "startModelSelection"
    ]),
    onSubmit() {
      if (!this.validate()) {
        return;
      }
      this.systemEvaluate(this.currentClassification.defects).then(() =>
        this.$bvModal.show("confirm-modal")
      );
    },
    onFinish() {
      let qLevels = {
        system: this.systemQualityLevel,
        assigned: this.assignedQualityLevel
      };
      if (qLevels.system.code == "R") {
        // Si es rotura
        if ([64, 65].includes(this.currentClassification.productFamily.id)) {
          // Si es tapa o accesorios
          this.$router.push("quantity-selection");
        } else {
          this.$router.push("castDate-selection");
        }
      } else {
        if (qLevels.system.code == "E" || qLevels.system.code == "C") {
          this.$router.push("quantity-selection");
        } else {
          this.saveClassification(this.currentClassification).then(cls => {
            this.$notify({
              message: "Se guardó la clasificación exitosamente",
              type: "info"
            });
            let productsInWagon = this.productsPerWagon[
              `${cls.currentOven.id}:${cls.productionWagon.id}`
            ];
            productsInWagon = productsInWagon.filter(p => {
              return p.quantity > p.classifiedPieces;
            });
            if (productsInWagon.length == 0) {
              this.$notify({
                message: "Se clasificaron todos los productos de esta vagoneta",
                type: "info"
              });
              this.$router.push("home");
            } else {
              this.createClassification({
                oven: cls.currentOven,
                wagon: cls.productionWagon
              });
              this.$router.push("quality-check");
            }
          });
        }
      }
    },
    goToAddDefect() {
      if (!this.currentClassification.productModel) {
        this.$notify({
          message: "Seleccione el producto a clasificar",
          type: "danger"
        });
        return;
      }
      this.tmpDefect = {
        className: "com.pmvb.scpiback.data.models.Defect"
      };
      this.$router.push("defect-area-selection");
    },
    goToQualitySelect() {
      this.$router.push("quality-selection");
    },
    validate() {
      if (!this.currentClassification.productModel) {
        this.$notify({
          message: "Seleccione el producto a clasificar",
          type: "danger"
        });
        return false;
      }
      if (!this.currentClassification.color) {
        this.$notify({
          message: "Seleccione el color del producto",
          type: "danger"
        });
        return false;
      }
      if (!this.currentClassification.castOperator) {
        this.$notify({ message: "Seleccione el colador", type: "danger" });
        return false;
      }
      if (!this.currentClassification.coatOperator) {
        this.$notify({ message: "Seleccione el barnizador", type: "danger" });
        return false;
      }
      if (!this.currentClassification.polishOperator) {
        this.$notify({ message: "Seleccione el pulidor", type: "danger" });
        return false;
      }
      return true;
    },
    handleEditBtn(route) {
      if (route == "model-selection") {
        this.startModelSelection();
        this.$router.push(route);
      }
    }
  }
};
</script>

<style lang="scss">
.q-check {
  .btn {
    box-sizing: border-box;
    border-width: 2px;
    font-size: 14px;
    font-weight: 600;
    min-width: 140px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    white-space: nowrap;
    border-radius: 4px;
  }

  .q-edit {
    min-width: 60px;
  }

  .classification-summary {
    padding: 10px 20px;
    margin: 0 20px;
  }
}

.defect-list {
  padding-left: 0px;
}

.summary-item {
  margin-top: 5px;
  margin-bottom: 5px;

  p {
    margin: 0;
  }

  p.label {
    margin-right: 5px;
    font-weight: bold;
  }

  a {
    margin: 0;
  }
}

.footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
}

.btn-add-defect {
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 600;
}

.w-90 {
  width: 90% !important;
}
</style>
