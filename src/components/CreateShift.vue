<template>
  <div>
    <div class="row">
      <h5 class="col-6">Ingreso a la sesión de turno</h5>
    </div>
    <div class="row">
      <div class="col-5 d-flex">
        <b-form class="shift-form" novalidate>
          <b-form-group
            id="shift-code"
            label="Clave Turno"
            label-for="shift-input" 
          >
            <b-form-input
              ref="input"
              id="shift-input"
              v-model="shiftCode"
              placeholder="Turno"
              required
              :class="{ 'is-invalid': $v.shiftCode.$invalid }"
            ></b-form-input>
            <span
              class="help-block invalid-feedback"
              v-if="!$v.shiftCode.required"
            >Debe ingresar el código del turno</span>
            <span
              class="help-block invalid-feedback"
              v-if="!$v.shiftCode.maxLength"
            >El código del turno debe tener máximo 5 caracteres</span>
          </b-form-group>
          <!-- <b-button type="submit" variant="default">Aceptar</b-button> -->
        </b-form>
      </div>
      <div class="col-7">
        <vue-touch-keyboard :layout="layout" :cancel="clear" :input="input"/>
      </div>
    </div>
  </div>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      shiftCode: "",
      layout: {
        _meta: {
          backspace: { func: "backspace", classes: "control" },
          clear: {
            func: "cancel",
            text: "Limpiar",
            classes: "control featured"
          }
        },

        default: ["A O 1 2 3 {backspace}", "E U 4 5 6 {clear}", "I - 7 8 9 0"]
      },
      input: null
    };
  },
  methods: {
    onShiftCreate() {
      this.$store.state.tmpShiftCode = this.shiftCode;
    },
    clear() {
      this.shiftCode = "";
    },
    validate() {
      this.$v.form.$touch();
      var isValid = !this.$v.form.$invalid;
      this.$emit("on-validate", this.$data, isValid);
      if (isValid) {
        this.onShiftCreate();
      }
      return isValid;
    }
  },
  mounted() {
    this.input = this.$refs["input"].$refs["input"];
  },
  watch: {
    shiftCode() {
      this.$store.state.tmpShiftCode = this.shiftCode;
    }
  },
  validations: {
    shiftCode: {
      required,
      maxLength: maxLength(5)
    },
    form: ["shiftCode"]
  }
};
</script>

<style lang="scss">
.shift-form {
  align-self: center;
  width: 100%;

  &:parent {
    justify-content: stretch;
  }

  .btn {
    padding: 15px 30px;
  }
}
.vue-touch-keyboard .keyboard {
  .line .key {
    height: auto;
    padding-top: 15px;
    padding-bottom: 15px;
  }
}
</style>
