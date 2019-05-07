<template>
  <div class="bg-white oven">
    <div class="row">
      <div class="col-3">
        <h4>{{ oven.code }}</h4>
      </div>
      <div class="col-3 offset-6 text-right">
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
    <div class="row d-flex oven-actions">
      <div class="col-5 text-center">
        <button class="btn btn-main" @click="startQualityCheck">Aceptar</button>
      </div>
      <div class="col-2"></div>
      <div class="col-5 text-center">
        <button class="btn btn-main">Libre</button>
      </div>
    </div>
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
      if (!this.selectedWagon) {
        this.$notify({ message: 'Seleccione la vagoneta a clasificar', type: 'danger' });
        return;
      }
      this.createClassification({ oven: this.oven, wagon: this.selectedWagon });
      this.$router.push('quality-check');
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
