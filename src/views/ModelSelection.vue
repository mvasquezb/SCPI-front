<template>
  <div class="model-selection bg-white">
    <LoadingSpinner v-if="loading"/>
    <form-wizard
      title="Seleccionar modelo de Producto a clasificar"
      subtitle
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
                @click="() => selectedFamily = fam"
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
                @click="() => selectedModel = mod"
              >
                <p>{{ mod.name }}</p>
              </div>
              <h4 v-if="!familyModels.length">Esta familia de productos no tiene productos disponibles</h4>
            </div>
          </div>
        </div>
      </tab-content>
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
      console.log(this.selectedFamily);
      if (this.selectedFamily === null || !this.productModels[this.selectedFamily.id]) {
        return [];
      }
      console.log (this.productModels[this.selectedFamily.id]);
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
    ...mapActions(["loadProductFamilies", "loadModelsForFamily", "selectModel"]),
    loadProductModels() {
      if (this.hasFamilyError) {
        return false;
      }

      if (!this.familyModels) {
        this.loadModelsForFamily(this.selectedFamily);
      }
      return true;
    },
    onComplete() {
      if (this.hasModelError) {
        return false;
      }
      this.selectModel(this.selectedModel);
      this.$router.push('home');
      return true;
    }
  },
  mounted() {
    this.$store.state.loading = false;
    if (Object.keys(this.productFamilies).length === 0) {
      this.loadProductFamilies();
    }
  }
};
</script>

<style lang="scss" scoped>
.grid {
  max-height: 50vh;
  display: flex;
  justify-content: center;
  overflow-y: auto;

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
    background-color: #ccc;
    cursor: pointer;
  }

  p {
    margin: 0;
    max-width: 100%;
    text-overflow: ellipsis;
  }
}
</style>
