<template>
  <div class="model-selection bg-white">
    <LoadingSpinner v-if="loading"/>
    <form-wizard
      title="Seleccionar modelo de producto a clasificar"
      ref="wizard"
      nextButtonText="Siguiente"
      backButtonText="Atrás"
      finishButtonText="Finalizar"
      color="#3498db"
      class="form-wizard"
      @on-complete="onComplete"
    >
      <tab-content title="Familia de Producto" :beforeChange="loadProductModels">
        <div class="row">
          <div class="col-5 text-center">
            <h4>Seleccione la familia de producto</h4>
          </div>
          <div class="col-7">
            <div class="row grid" :class="{ 'error': hasFamilyError }">
              <div
                class="col-3 grid-item"
                v-for="fam in productFamilies"
                :key="fam.id"
                :class="{ 'selected': selectedFamily === fam }"
                @click="familySelect(fam)"
              >
                <p>{{ fam.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </tab-content>
      <tab-content title="Modelo de Producto">
        <div class="row">
          <div class="col-5 text-center">
            <h4>Seleccione el modelo de producto</h4>
          </div>
          <div class="col-7">
            <div class="row grid" :class="{ 'error': hasModelError }">
              <div
                class="col-3 grid-item"
                v-for="mod in familyModels"
                :key="mod.id"
                :class="{ 'selected': selectedModel === mod }"
                @click="modelSelect(mod)"
              >
                <p>{{ mod.name }}</p>
              </div>
              <h4
                v-if="!familyModels.length"
              >Esta familia de productos no tiene productos disponibles</h4>
            </div>
          </div>
        </div>
      </tab-content>

      <template slot="footer" slot-scope="props">
        <div class="wizard-footer-left">
          <wizard-button
            @click.native="backHandler(props.activeTabIndex, props.prevTab, props)"
            class="btn btn-default"
          >{{ prevButtonText(props.activeTabIndex) }}</wizard-button>
        </div>
        <!-- <div class="wizard-footer-right">
          <wizard-button
            v-if="!props.isLastStep"
            @click.native="props.nextTab()"
            class="wizard-footer-right btn btn-default"
          >Siguiente</wizard-button>

          <wizard-button
            v-else
            @click.native="onComplete"
            class="wizard-footer-right finish-button btn btn-default"
          >{{props.isLastStep ? 'Finalizar' : 'Siguiente'}}</wizard-button>
        </div> -->
      </template>
    </form-wizard>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  components: {
    LoadingSpinner
  },
  data() {
    return {
      selectedFamily: null,
      selectedModel: null,
      wizard: null,
    };
  },
  computed: {
    ...mapState([
      "productFamilies",
      "productModels",
      "loading",
      "operationError",
      "operationSuccessful"
    ]),
    familyModels() {
      if (
        this.selectedFamily === null ||
        !this.productModels[this.selectedFamily.id]
      ) {
        return [];
      }
      return this.productModels[this.selectedFamily.id];
    },
    hasFamilyError() {
      return this.selectedFamily == null;
    },
    hasModelError() {
      return this.selectedModel == null;
    }
  },
  methods: {
    ...mapActions([
      "loadProductFamilies",
      "loadModelsForFamily",
      "selectModel",
    ]),
    familySelect(fam) {
      this.selectedFamily = fam;
      this.wizard.nextTab();
    },
    modelSelect(mod) {
      this.selectedModel = mod;
      this.onComplete();
    },
    loadProductModels() {
      if (this.hasFamilyError) {
        return false;
      }

      if (!this.familyModels.length) {
        this.loadModelsForFamily(this.selectedFamily);
      }
      return true;
    },
    onComplete() {
      if (this.hasModelError) {
        return false;
      }
      this.selectModel(this.selectedModel);
      this.$router.push("quality-check");
      return true;
    },
    prevButtonText(index) {
      if (index > 0) {
        return "Atrás";
      }
      return "Volver";
    },
    backHandler(index, prevTab) {
      if (index == 0) {
        this.$router.back();
        return;
      }
      prevTab();
    }
  },
  mounted() {
    if (Object.keys(this.productFamilies).length === 0) {
      this.loadProductFamilies();
    }
    this.wizard = this.$refs['wizard'];
  },
};
</script>

<style lang="scss" scoped>
.grid {
  max-height: 50vh;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  margin-right: 15px;

  &.error {
    border: 1px solid red;
    box-shadow: 0px 0px 5px 2px red;
  }
}

.grid-item {
  border: 1px solid black;

  margin: 5px;
  padding: 20px;
  display: flex;
  align-content: center;
  justify-content: center;

  &.selected {
    border: 3px solid #3498db;
  }

  &:hover {
    background-color: #ccc7;
    cursor: pointer;
  }

  p {
    margin: 0;
    max-width: 100%;
    text-overflow: ellipsis;
  }
}

.model-selection {
  .vue-form-wizard .wizard-btn {
    margin-top: 10px;
    padding-top: 15px;
    padding-bottom: 15px;
    background-color: #66615b;
  }
}
</style>
