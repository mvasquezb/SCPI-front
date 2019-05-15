<template>
  <div class="bg-white oven">
    <div class="row">
      <div class="col-3">
        <h4>{{ oven.code }}</h4>
      </div>
      <div class="col-7 text-center d-flex align-items-center">
        <p class="text-dark m-0">Seleccione la vagoneta a clasificar</p>
      </div>
      <div class="col-2 text-right">
        <h4>*Prod</h4>
      </div>
    </div>
    <div class="row">
      <WagonList class="col-9 wagons" :wagons="oven.wagons" @wagonSelect="selectWagon" />
      <div class="col-3 wagon-indicators">
        <DataIndicator title="Vagoneta Inicial" :value="startWagon" />
        <DataIndicator title="Vagoneta Actual" :value="currentWagon" />
      </div>
    </div>
    <!-- <div class="row d-flex justify-content-center oven-actions">
      <button class="btn btn-main" @click="startQualityCheck">Empezar Clasificación</button>
    </div> -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import WagonList from '@/components/WagonList.vue';
import DataIndicator from '@/components/DataIndicator.vue';

export default {
  props: {
    oven: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedWagon: null,
    };
  },
  components: {
    WagonList,
    DataIndicator
  },
  computed: {
    ...mapState(['currentClassification', 'startWagonsPerOven']),
    startWagon() {
      return this.startWagonsPerOven[this.oven.id].code;
    },
    currentWagon() {
      return this.currentClassification.currentWagon ? this.currentClassification.currentWagon.code : '';
    }
  },
  methods: {
    ...mapActions(['createClassification']),
    selectWagon(wagon) {
      this.selectedWagon = wagon;
    },
    startQualityCheck() {
      // if (!this.validateRequiredQualityCheck()) {
      //   return;
      // }
      this.createClassification({ oven: this.oven, wagon: this.selectedWagon });
      this.$router.push('quality-check');
    },
    // validateRequiredQualityCheck() {
    //   if (!this.currentClassification.productModel) {
    //     this.$notify({ message: 'Seleccione el modelo de producto', type: 'danger' });
    //     return false;
    //   }
    //   if (!this.currentClassification.color) {
    //     this.$notify({ message: 'Seleccione el color de producto', type: 'danger' });
    //     return false;
    //   }
    //   if (!this.selectedWagon) {
    //     this.$notify({ message: 'Seleccione la vagoneta a clasificar', type: 'danger' });
    //     return false;
    //   }
    //   return true;
    // }
  },
  watch: {
    selectedWagon() {
      if (this.selectedWagon == null) {
        return;
      }
      this.startQualityCheck();
    }
  }
};
</script>

<style lang="scss">
.wagons {
  height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
}

.wagon-indicators {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.oven {
  padding: 10px;
}

.oven-actions {
  button {
    padding-top: 10px;
    padding-bottom: 10px;
    width: 100%;
  }
}
</style>
