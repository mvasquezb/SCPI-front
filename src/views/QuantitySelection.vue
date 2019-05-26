<template>
  <div class="row bg-white quantity-selection">
    <h4 class="col-12 text-center form-title">Cantidad de piezas clasificadas</h4>
    <div class="form-container row w-100">
      <div class="col-5 text-center d-flex flex-column">
        <h4 class="w-100">Ingrese la cantidad de piezas clasificadas</h4>
        <b-form class="quantity-form" novalidate>
          <b-form-group id="quantity" label="Cantidad" label-for="quantity-input">
            <b-input-group>
              <b-form-input
                ref="input"
                id="quantity-input"
                v-model="quantity"
                placeholder="Cantidad de Piezas"
                required
                type="number"
                :max="$v.quantity.$params.maxValue.max"
                :min="$v.quantity.$params.minValue.min"
                :class="{ 'is-invalid': $v.quantity.$invalid }"
              ></b-form-input>
              <span
                class="help-block invalid-feedback"
                v-if="!$v.quantity.required"
              >Debe ingresar la cantidad de piezas clasificadas</span>
              <span
                class="help-block invalid-feedback"
                v-if="!$v.quantity.maxValue"
              >La cantidad máxima de piezas es {{ $v.quantity.$params.maxValue.max }}</span>
              <span
                class="help-block invalid-feedback"
                v-if="!$v.quantity.minValue"
              >La cantidad de piezas debe ser al menos {{ $v.quantity.$params.minValue.min }}</span>
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
        <button class="btn btn-default btn-next" @click="onSubmit">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { required, maxValue, minValue } from "vuelidate/lib/validators";

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
      quantity: ""
    };
  },
  computed: {
    ...mapState(["currentClassification", "productsPerWagon"]),
    assignedQualityLevel() {
      return this.currentClassification.assignedQualityLevel;
    },
    systemQualityLevel() {
      return this.currentClassification.systemQualityLevel;
    }
  },
  methods: {
    ...mapActions([
      "selectClassifiedQuantity",
      "saveClassification",
      "createClassification"
    ]),
    onSubmit() {
      if (this.validate()) {
        this.selectClassifiedQuantity(this.quantity);
        let qLevels = {
          system: this.systemQualityLevel,
          assigned: this.assignedQualityLevel
        };
        if (
          qLevels.system &&
          qLevels.system.code == "R" &&
          [64, 65].includes(this.currentClassification.productFamily.id)
        ) {
          // Si es tapa o accesorios y es rotura
          this.$router.push("castDate-selection");
        } else {
          this.saveClassification(this.currentClassification).then(cls => {
            this.$notify({
              message: "Se guardó la clasificación exitosamente",
              type: "info"
            });
            console.log("cls: " + cls);
            let productsInWagon = this.productsPerWagon[
              `${cls.currentOven.id}:${cls.productionWagon.id}`
            ];
            productsInWagon = productsInWagon.filter(p => {
              return p.quantity > p.classifiedPieces;
            });
            if (productsInWagon.length == 0) {
              this.$notify({
                message: "Se clasificaron todos los productos de esta vagoneta",
                type: "info"
              });
              this.$router.push("home");
            } else {
              this.createClassification({
                oven: cls.currentOven,
                wagon: cls.productionWagon
              });
              this.$router.push("quality-check");
            }
          });
        }
      }
    },
    clear() {
      this.quantity = "";
    },
    validate() {
      this.$v.form.$touch();
      var isValid = !this.$v.form.$invalid;
      this.$emit("on-validate", this.$data, isValid);
      return isValid;
    }
  },
  mounted() {
    this.input = this.$refs["input"].$refs["input"];
    this.quantity = this.currentClassification.quantity;
  },
  validations: {
    quantity: {
      required,
      maxValue: maxValue(255),
      minValue: minValue(1)
    },
    form: ["quantity"]
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  margin-left: 0px;
}

.quantity-form {
  align-self: center;
  width: 100%;

  &:parent {
    justify-content: stretch;
  }

  .btn {
    padding: 15px 30px;
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
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    white-space: nowrap;
    border-radius: 4px;
  }
}
</style>
