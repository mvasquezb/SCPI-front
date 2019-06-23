<template>
  <div>
    <LoadingSpinner v-if="loading"/>
    <div v-if="hasOpenShift" class="home bg-white">
      <div class="row">
        <div class="col-12 text-center">
          <h4>Turno {{ shift.code }}</h4>
        </div>
      </div>
      <div class="row top-content">
        <div class="col-10 bg-nude general-info">
          <div class="row bg-white general-info-tools">
            <OvenData :data="ovenData"/>
          </div>
          <div class="row bg-white general-info-tools">
            <ClassificationData :classification="currentClassData"/>
          </div>
        </div>
        <div class="col-2 bg-nude pieces-indicator">
          <DataIndicactor title="Nro. Piezas" :value="totalClassifiedPieces"/>
        </div>
      </div>
      <div class="row bottom-container">
        <div class="col-12">
          <div class="row bg-nude overflow-hidden">
            <Oven v-for="oven in visibleOvens" class="col-md-6 oven" :oven="oven" :key="oven.id"/>
          </div>
          <div class="row bg-nude shift-info-actions">
            <div class="col-md-9 bg-white d-flex piece-counters">
              <ClassifiedCounter
                v-for="(value, name, index) in shift.pieceClassifications"
                :key="index"
                :title="name"
                :value="value"
              />
            </div>
            <div class="col-md-3 text-center">
              <button class="btn btn-end-shift btn-danger-custom" @click="endShift">Terminar Turno</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!creatingShift" class="text-center">
      <h4>Por favor, inicie un turno para poder acceder a esta sección</h4>
      <button class="btn btn-info" @click="createShiftStart">Iniciar Turno</button>
    </div>
    <CreateShiftForm v-if="creatingShift" class="form-wizard"/>
  </div>
</template>

<script lang="js">
import { mapState, mapActions } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import Oven from '@/components/Oven.vue';
import DataIndicactor from '@/components/DataIndicator.vue';
import ClassifiedCounter from '@/components/ClassifiedCounter.vue';
import OvenData from '@/components/OvenData.vue';
import ClassificationData from '@/components/ClassificationData.vue';
import CreateShiftForm from '@/components/CreateShiftForm.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

@Component({
  components: {
    Oven,
    DataIndicactor,
    ClassifiedCounter,
    OvenData,
    ClassificationData,
    CreateShiftForm,
    LoadingSpinner,
  },
  computed: {
    ...mapState(['factoryOvens', 'creatingShift', 'currentClassification', 'startWagonsPerOven', 'loading', 'classifications']),
    shift: mapState(['currentShift']).currentShift,
  },
  methods: {
    ...mapActions(['loadFactoryOvens', 'setCurrentWagon', "endShift"]),
  },
})
export default class Home extends Vue {
  created() {
    if (!Object.keys(this.factoryOvens).length) {
      this.loadFactoryOvens();
    }
  }

  createShiftStart() {
    this.$store.state.creatingShift = true;
  }

  get visibleOvens() {
    return this.factoryOvens;
  }
  
  get currentClassData() {
    return {
      quantity: this.classificationData.quantity,
      wagon: this.currentWagon,
      defect: this.classificationData.defect,
      location: this.classificationData.location,
    };
  }

  get hasOpenShift() {
    return this.shift != null;
  }

  get currentWagon() {
    return this.currentClassification.currentWagon;
  }

  get ovenData() {
    return {
      productModel: this.currentClassification.productModel,
      color: this.currentClassification.color,
      currentOven: this.currentClassification.currentOven,
      coatOperator: (this.currentWagon || {}).coatOperator,
      castOperator: (this.currentWagon || {}).castOperator,
      polishOperator: (this.currentWagon || {}).polishOperator,
    };
  }

  get totalClassifiedPieces() {
    return Object.values(this.shift.pieceClassifications).reduce((acc, val) => acc + val);
  }

  get latestClassification() {
    if (!this.classifications.length) {
      return null;
    }
    return this.classifications[this.classifications.length - 1];
  }

  get classificationData() {
    if (!this.latestClassification) {
      return {};
    }
    let defects = this.latestClassification.defects[1];
    let defect = (!defects.length) ? {} : defects[defects.length - 1];
    return {
      defect,
      ...this.latestClassification,
    };
  }
}
</script>

<style lang="scss">
.home {
  padding-bottom: 20px;
  padding-right: 15px;
  padding-left: 15px;

  .top-content {
    margin-bottom: 10px;
  }

  .general-info-tools {
    margin-top: 10px;

    &:last-child {
      margin-bottom: 10px;
    }
  }

  .pieces-indicator {
    border-left: 10px white solid;
    display: flex;
    justify-content: center;
    padding: 10px;
  }

  h4 {
    margin-top: 10px;
  }

  .row {
    margin-right: 0;
    margin-left: 0;
  }

  .class-pieces-container {
    margin-left: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .bottom-container > [class^="col-"] {
    padding: 0;
  }

  .oven {
    margin: 15px;
  }

  .shift-info-actions {
    padding: 10px;

    .piece-counters {
      padding: 10px;
      justify-content: space-evenly;
    }

    .btn-end-shift {
      font-size: 1.2em;
      width: 100%;
    }
  }
}

.form-wizard {
  background-color: white;
}
</style>
