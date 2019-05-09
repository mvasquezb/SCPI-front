<template>
  <form-wizard
      title="Iniciar turno de clasificación"
      subtitle
      nextButtonText="Siguiente"
      backButtonText="Atrás"
      finishButtonText="Finalizar"
      color="#3498db"
      @on-complete="onComplete"
    >
      <tab-content title="Crear Turno" :beforeChange="() => validateStep('shiftStep')">
        <CreateShift ref="shiftStep" />
      </tab-content>
      <tab-content title="Seleccionar Vagoneta Inicial" :beforeChange="() => validateStep('wagonStep')">
        <SelectWagon ref="wagonStep" v-for="oven in factoryOvens" :oven="oven" :key="oven.id" />
      </tab-content>
    </form-wizard>
</template>

<script>
import { mapState, mapActions } from 'vuex'; 
import CreateShift from '@/components/CreateShift.vue';
import SelectWagon from '@/components/SelectWagon.vue';

export default {
  components: {
    CreateShift,
    SelectWagon,
  },
  data() {     
    return {
      
    }
  },
  computed: {
    ...mapState(['tmpShiftCode', 'tmpStartWagons', 'factoryOvens']),
  },
  methods: {
    ...mapActions(['createShift']),
    validateStep(name) {
      let ref = this.$refs[name];
      if (!ref.validate) {
        return true; 
      }
      return ref.validate();
    },
    onComplete() {
      if (this.tmpStartWagons && (Object.keys(this.tmpStartWagons).length == this.factoryOvens.length)) {
        this.createShift();
      } else {
        this.$notify({ message: 'Debe completar los datos requeridos', type: 'danger' });
      }
    },
  }
}
</script>

