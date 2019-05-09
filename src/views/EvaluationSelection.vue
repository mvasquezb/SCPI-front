<template>
  <div class="row bg-white evaluation-selection">
    <LoadingSpinner v-if="loading"/>
    <h4 class="col-12 text-center form-title">Tipo de Resane</h4>
    <div class="grid-container row col-12">
      <div class="col-5 text-center">
        <h4>Seleccione el tipo de resane</h4>
      </div>
      <div class="col-7">
        <div class="row grid" :class="{ 'error': hasError }">
          <div
            class="col-3 grid-item d-flex justify-content-center align-items-center bg-nude"
            v-for="evaluation in evaluationTypes"
            :key="evaluation.id"
            :class="{ 'selected': selectedEvaluation === evaluation }"
            @click="() => selectedEvaluation = evaluation"
          >
            <p>{{ evaluation.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row w-100 mx-1 my-2">
      <div class="col-12 footer">
        <button class="btn btn-default btn-back" @click="() => $router.back()">Volver</button>
        <button class="btn btn-default btn-next" @click="onSubmit">Aceptar</button>
      </div>
    </div>
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
      selectedEvaluation: null
    };
  },
  computed: {
    ...mapState([
      "evaluationTypes",
      "loading",
      "operationError",
      "operationSuccessful"
    ]),
    hasError() {
      return this.selectedEvaluation == null;
    }
  },
  methods: {
    ...mapActions(["loadEvaluationTypes", "selectEvaluationType"]),
    onSubmit() {
      if (this.hasError) {
        return;
      }
      this.selectEvaluationType(this.selectedEvaluation);
      this.nextPage();
    },
    nextPage() {
      this.$router.push('quality-check');
    }
  },
  mounted() {
    if (Object.keys(this.evaluationTypes).length === 0) {
      this.loadEvaluationTypes();
    }
  }
};
</script>

<style lang="scss" scoped>
.wizard-title {
  color: #252422;
  font-weight: 300;
  margin: 0;
  text-align: center;
}

.grid {
  max-height: 60vh;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  margin-right: 15px;
  padding: 15px 0;
  border: 1px solid black;

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
  flex-direction: column-reverse;

  &.selected {
    border: 3px solid #3498db;
  }

  &:hover {
    background-color: #ccc;
    cursor: pointer;
  }

  p {
    margin: 0;
    padding: 5px 0;
    text-align: center;
    width: 100%;
    text-overflow: ellipsis;
  }
}

.form-title {
  color: #252422;
  font-weight: 300;
  margin: 0;
  text-align: center;
  margin-bottom: 2rem;
  padding: 15px;
}

.footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;

  .btn {
    margin-top: 10px;
    padding-top: 15px;
    padding-bottom: 15px;
    box-sizing: border-box;
    border-width: 2px;
    font-size: 14px;
    font-weight: 600;
    min-width: 140px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    white-space: nowrap;
    border-radius: 4px;
  }
}
</style>
