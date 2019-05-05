<template>
  <div>
    <div class="row">
      <h5 class="col-6">Seleccionar Vagoneta Inicial</h5>
    </div>
    <div class="row">
      <div class="col-5 d-flex">
        <b-form @submit.prevent="onWagonSelected" class="wagon-form" novalidate>
          <p class="d-inline-block font-weight-bold">Horno: </p>
          <p class="d-inline-block">{{oven.code}}</p>
          <b-form-group id="wagon-code" label="Vagoneta Inicial" label-for="wagon-input">
            <b-form-input
              ref="input"
              id="wagon-input"
              v-model="startWagon"
              placeholder="Vagoneta"
              required
              :class="{ 'is-invalid': $v.startWagon.$invalid }"
            ></b-form-input>
            <span
              class="help-block error"
              v-if="!$v.startWagon.positiveInteger"
            >El número de vagoneta debe ser un número entero positivo.</span>
          </b-form-group>
          <!-- <b-button type="submit" variant="default">Aceptar</b-button> -->
        </b-form>
      </div>
      <div class="col-7 w-100">
        <div class="row">
          <vue-touch-keyboard :layout="layout" :cancel="clear" :input="input" class="w-100"/>
        </div>
        <div class="row">
          <button
            class="btn btn-default w-100 btn-oven-unavailable"
            @click="ovenUnavailable"
          >Horno no Disponible</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const positiveInteger = (value) => !isNaN(parseInt(value)) && parseInt(value) >= 0;

export default {
  props: {
    oven: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      startWagon: "",
      layout: {
        _meta: {
          backspace: { func: "backspace", classes: "control" },
          clear: {
            func: "cancel",
            text: "Limpiar",
            classes: "control featured"
          }
        },
        default: ["1 2 3 {backspace}", "4 5 6 {clear}", "7 8 9 0"]
      },
      input: null
    };
  },
  methods: {
    onWagonSelected() {
      this.$store.dispatch('addStartingWagon', {
        ovenId: this.oven.id,
        wagon: this.startWagon
      });
    },
    clear() {
      this.startWagon = "";
    },
    validate() {
      this.$v.form.$touch();
      let isValid = !this.$v.form.$invalid;
      this.$emit("on-validate", this.$data, isValid);
      if (isValid) {
        this.onWagonSelected();
      }
      return isValid;
    },
    ovenUnavailable() {
      console.log("Oven unavailable");
    }
  },
  mounted() {
    this.input = this.$refs["input"].$refs["input"];
  },
  validations: {
    startWagon: {
      positiveInteger
    },
    form: ["startWagon"]
  }
};
</script>

<style lang="scss">
.wagon-form {
  align-self: center;
  width: 100%;

  &:parent {
    justify-content: stretch;
  }

  .btn {
    padding: 15px 30px;
  }
}
.vue-touch-keyboard {
  margin-bottom: 1rem;

  .keyboard {
    .line .key {
      height: auto;
      padding-top: 15px;
      padding-bottom: 15px;
    }
  }
}
</style>
