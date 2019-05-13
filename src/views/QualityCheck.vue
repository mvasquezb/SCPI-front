<template>
  <div class="q-check bg-white d-flex flex-column align-items-center">
    <h4>Evaluación de Calidad</h4>
    <div class="row classification-summary bg-nude">
      <div class="col-6 d-flex flex-column">
        <div
          v-for="(item, index) in summaryData"
          :key="index"
          class="summary-item d-flex justify-content-between"
        >
          <div class="d-flex flex-shrink align-items-center">
            <p class="label">{{ item.label }}:</p>
            <p class="value">{{ item.value }}</p>
          </div>
          <router-link class="btn btn-default" :to="item.route">Editar</router-link>
          <!-- <button class="btn btn-default" v-if="item.action" @click="item.action">Editar</button> -->
        </div>
      </div>
      <div class="col-6 d-flex flex-column">
        <div
          v-for="(item, index) in wagonOperators"
          :key="index"
          class="summary-item d-flex justify-content-between"
        >
          <div class="d-flex flex-shrink align-items-center">
            <p class="label">{{ item.label }}:</p>
            <p class="value">{{ item.value }}</p>
          </div>
          <router-link class="btn btn-default" :to="item.route">Editar</router-link>
          <!-- <button class="btn btn-default" v-if="item.action" @click="item.action">Editar</button> -->
        </div>
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
        <button class="btn btn-default btn-back" @click="$router.push('home')">Volver</button>
        <button class="btn btn-default btn-next" @click="onSubmit">Finalizar</button>
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
        <b-button variant="success" @click="ok()">Confirmar</b-button>
        <!-- Button with custom close trigger value -->
      </template>
    </b-modal>
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
          value: this.currentClassification.productModel.name,
          route: "model-selection"
        },
        {
          label: "Color",
          value: this.currentClassification.color.name,
          route: "color-selection"
        }
      ];
    },
    wagonOperators() {
      return [
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
        return "Se requiere más información";
      }
      let text = this.systemQualityLevel.name;
      if (this.systemQualityLevel.code == "S") {
        return `${text} - ${this.currentClassification.repair.repairType.name}`;
      }
      if (this.systemQualityLevel.code == "V") {
        return `${text} - ${
          this.currentClassification.evaluation.evaluationType.name
        }`;
      }
      return text;
    }
  },
  methods: {
    ...mapActions(["saveClassification"]),
    onSubmit() {
      this.$bvModal.show("confirm-modal");
    },
    onFinish() {
      this.saveClassification(this.currentClassification);
      this.$router.push("home");
    },
    goToAddDefect() {
      this.tmpDefect = {};
      this.$router.push("defect-area-selection");
    },
    goToQualitySelect() {
      this.$router.push("quality-selection");
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
</style>
