<template>
  <div class="q-check bg-white d-flex flex-column align-items-center">
    <h4>Evaluación de Calidad</h4>
    <div class="row classification-summary bg-nude">
      <div class="col-6 d-flex flex-column">
        <div v-for="(item, index) in summaryData" :key="index" class="summary-item d-flex">
          <p class="label">{{ item.label }}:</p>
          <p class="value">{{ item.value }}</p>
        </div>
      </div>
      <div class="col-6 d-flex flex-column">
        <div v-for="(item, index) in wagonOperators" :key="index" class="summary-item d-flex">
          <p class="label">{{ item.label }}:</p>
          <p class="value">{{ item.value }}</p>
        </div>
      </div>
      <div class="summary-item d-flex justify-content-between col-12 my-2">
        <div class="d-flex flex-column justify-items-center">
          <div class="d-flex">
            <p class="label">Nivel de Calidad determinado por el Operario:</p>
            <p
              class="value"
            >{{ assignedQualityText }}</p>
          </div>
          <div class="d-flex">
            <p class="label mb-0">Nivel de Calidad determinado por el Sistema:</p>
            <p
              class="value mb-0"
            >{{ systemQualityText }}</p>
          </div>
        </div>
        <button
            class="btn btn-default btn-add-defect m-0"
            @click="goToQualitySelect"
          >Seleccionar Nivel de Calidad</button>
      </div>
      <div class="summary-item d-flex flex-column col-12">
        <div class="defect-list-header d-flex justify-content-between align-items-center pb-2">
          <p class="label m-0">Defectos</p>
          <button
            class="btn btn-default btn-add-defect align-self-center m-0"
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
    <div class="row w-100 mx-1 my-2">
      <div class="col-12 footer">
        <button class="btn btn-default btn-back" @click="() => $router.back()">Volver</button>
        <button class="btn btn-default btn-next" @click="onSubmit">Finalizar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState(["currentClassification"]),
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
          value: this.currentClassification.productModel.name
        },
        {
          label: "Color",
          value: this.currentClassification.color.name
        }
      ];
    },
    wagonOperators() {
      return [
        {
          label: "Pulidor",
          value: this.currentClassification.polishOperator.code
        },
        {
          label: "Barnizador",
          value: this.currentClassification.coatOperator.code
        },
        {
          label: "Colador",
          value: this.currentClassification.castOperator.code
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
        return 'No definido';
      }
      let text = this.assignedQualityLevel.name;
      if (this.assignedQualityLevel.code == 'S') {
        return `${text} - ${this.currentClassification.repair.repairType.name}`;
      }
      if (this.assignedQualityLevel.code == 'V') {
        return `${text} - ${this.currentClassification.evaluation.evaluationType.name}`;
      }
      return text;
    },
    systemQualityText() {
      if (!this.systemQualityLevel) {
        return 'Se requiere más información';
      }
      let text = this.systemQualityLevel.name;
      if (this.systemQualityLevel.code == 'S') {
        return `${text} - ${this.currentClassification.repair.repairType.name}`;
      }
      if (this.systemQualityLevel.code == 'V') {
        return `${text} - ${this.currentClassification.evaluation.evaluationType.name}`;
      }
      return text;
    }
  },
  methods: {
    ...mapActions(["saveClassification"]),
    onSubmit() {
      this.saveClassification(this.currentClassification);
      this.$router.push("home");
    },
    goToAddDefect() {
      this.tmpDefect = {};
      this.$router.push("defect-area-selection");
    },
    goToQualitySelect() {
      this.$router.push('quality-selection');
    },
  }
};
</script>

<style lang="scss">
.q-check {
  .btn {
    margin-top: 10px;
    padding-top: 15px;
    padding-bottom: 15px;
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
}
.q-check {
  .classification-summary {
    padding: 10px 20px;
    margin: 0 20px;
  }
}

.defect-list {
  padding-left: 0px;
}

.summary-item {
  p.label {
    margin-right: 5px;
    font-weight: bold;
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
</style>
