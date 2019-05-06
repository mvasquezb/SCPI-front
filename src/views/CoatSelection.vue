<template>
  <div class="row bg-white color-selection">
    <h4 class="col-12 text-center form-title">Ingresar código del barnizador</h4>
    <div class="form-container row w-100">
      <div class="col-5 text-center d-flex flex-column">
        <h4 class="w-100">Ingrese el código del barnizador</h4>
        <b-form class="operator-form" novalidate>
          <b-form-group id="operator-code" label="Código Operario" label-for="operator-input">
            <b-input-group :prepend="prefix">
              <b-form-input
                ref="input"
                id="operator-input"
                v-model="operatorCode"
                placeholder="Código Operario"
                required
                :class="{ 'is-invalid': $v.operatorCode.$invalid }"
              ></b-form-input>
              <span
                class="help-block invalid-feedback"
                v-if="!$v.operatorCode.required"
              >Debe ingresar el código del operario</span>
              <span
                class="help-block invalid-feedback"
                v-if="!$v.operatorCode.maxLength"
              >El código del operario debe tener máximo {{ $v.operatorCode.$params.maxLength.max }} caracteres</span>
            </b-input-group>
          </b-form-group>
        </b-form>
      </div>
      <div class="col-7">
        <vue-touch-keyboard :layout="layout" :cancel="clear" :input="input"/>
      </div>
    </div>
    <div class="row w-100 mx-1 my-2">
      <div class="col-12 footer">
        <button class="btn btn-default btn-back" @click="() => $router.back()">Volver</button>
        <button class="btn btn-default btn-next" @click="onSubmit">Finalizar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  data() {
    return {
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
      input: null,
      prefix: "B",
      operatorCode: "",
    };
  },
  computed: {
    ...mapState(["operators"])
  },
  methods: {
    ...mapActions(["loadOperators", "selectCoatOperator"]),
    onSubmit() {
      if (this.validate()) {
        this.selectCoatOperator(this.prefix + this.operatorCode);
        this.$router.push("home");
      }
    },
    clear() {
      this.operatorCode = "";
    },
    validate() {
      this.$v.form.$touch();
      var isValid = !this.$v.form.$invalid;
      this.$emit("on-validate", this.$data, isValid);
      return isValid;
    }
  },
  mounted() {
    if (Object.keys(this.operators).length === 0) {
      this.loadOperators();
    }
    this.input = this.$refs["input"].$refs["input"];
  },
  validations: {
    operatorCode: {
      required,
      maxLength: maxLength(3)
    },
    form: ["operatorCode"]
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  margin-left: 0px;
}

.operator-form {
  align-self: center;
  width: 100%;

  &:parent {
    justify-content: stretch;
  }

  .btn {
    padding: 15px 30px;
  }
}

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

  &.error {
    border: 1px solid red;
    box-shadow: 0px 0px 5px 2px red;
  }
}

.grid-item {
  border: 1px solid black;
  margin: 5px;
  padding: 80px 0 0 0;
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
    border-top: 1px solid black;
    background-color: white;
  }

  .color-container {
    width: 100%;
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
