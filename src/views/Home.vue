<template>
  <div v-if="hasOpenShift" class="home bg-white">
    <div class="row">
      <div class="col-12 text-center">
        <h4>Turno {{ shift.code }}</h4>
      </div>
    </div>
    <div class="row top-content">
      <div class="col-10 bg-nude general-info">
        <div class="row bg-white general-info-tools">
          <OvenData :shift="shift"/>
        </div>
        <div class="row bg-white general-info-tools">
          <ClassificationData :classification="currentData"/>
        </div>
      </div>
      <div class="col-2 bg-nude pieces-indicator">
        <DataIndicactor title="Nro. Piezas" :value="43"/>
      </div>
    </div>
    <div class="row bottom-container">
      <div class="col-12">
        <div class="row bg-nude">
          <Oven v-for="oven in visibleOvens" class="col-md-6 oven" :oven="oven" :key="oven.id"/>
        </div>
        <div class="row bg-nude shift-info-actions">
          <div class="col-md-9 bg-white d-flex piece-counters">
            <ClassifiedCounter
              v-for="(value, name, index) in classifiedPieces"
              :key="index"
              :title="name"
              :value="value"
            />
          </div>
          <div class="col-md-3 text-center">
            <button class="btn btn-end-shift btn-danger-custom">Terminar Turno</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center">
    <h4>Por favor, inicie un turno para poder acceder a esta sección</h4>
    <button class="btn btn-info">Iniciar Turno</button>
  </div>
</template>

<script lang="js">
import { Component, Vue } from 'vue-property-decorator';
import Oven from '@/components/Oven.vue';
import DataIndicactor from '@/components/DataIndicator.vue';
import ClassifiedCounter from '@/components/ClassifiedCounter.vue';
import OvenData from '@/components/OvenData.vue';
import ClassificationData from '@/components/ClassificationData.vue';
// import http from '@/http';

@Component({
  components: {
    Oven,
    DataIndicactor,
    ClassifiedCounter,
    OvenData,
    ClassificationData
  },
  computed: {
    visibleOvens() {
      return this.ovens.slice(0, 1);
    },
    currentData() {
      return {
        quantity: this.classificationData.quantity,
        wagon: this.classificationData.productionWagon,
        defect: this.classificationData.currentDefect,
        location: this.classificationData.location,
      };
    },
    hasOpenShift() {
      return !!this.shift;
    }
  },
  mounted() {
    // Check open shfit
    this.checkHasOpenShift();
  },
  methods: {
    checkHasOpenShift() {
      this.shift = null;
    }
  }
})
export default class Home extends Vue {
  shift = {}
  ovens = []
  classifiedPieces = {}

  created() {
    // http.get(`/shift/${shift.id}/ovens`).then((res) => this.ovens = res.data);
    this.shift = {
      id: 1,
      code: "CAS12",
      productModel: {
        id: 1,
        code: "MOD12",
        color: {
          id: 1,
          name: "Blanco",
          hex: "#fff"
        },
      },
    };

    this.ovens = [
      {
        id: 1,
        code: "SITI",
        wagons: [
          {
            id: 1,
            code: "Vagoneta 44"
          },
          {
            id: 2,
            code: "Vagoneta 45"
          },
          {
            id: 3,
            code: "Vagoneta 46"
          },
          {
            id: 4,
            code: "Vagoneta 47"
          },
        ],
        castOperator: {
          id: 1,
          code: "EMP1"
        },
        coatOperator: {
          id: 2,
          code: "EMP2"
        },
        polishOperator: {
          id: 3,
          code: "EMP3"
        }
      }
    ];

    this.classifiedPieces = {
      "estandar": 21,
      "comercial": 11,
      "rotura": 7,
      "resane": 1,
      "evaluacion": 3
    };

    this.shift.currentOven = this.ovens[0];

    this.classificationData = {
      id: 1,
      quantity: 2,
      productionWagon: this.shift.currentOven.wagons[0],
      currentDefect: {
        id: 1,
        type: {
          id: 1,
          code: 'QE',
        },
        location: {
          id: 1,
          code: '001',
          name: 'Aleta'
        }
      },
      defects: [
        {
          id: 1,
          type: {
            id: 1,
            code: 'QE',
          },
          location: {
            id: 1,
            code: '001',
            name: 'Aleta'
          }
        }
      ],
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
</style>
