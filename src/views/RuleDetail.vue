<template>
  <div class="rule-detail bg-white">
    <div class="row justify-content-center page-title">
      <h4 v-if="!this.isNewRule">Detalle de regla</h4>
      <h4 v-else>Nueva Regla</h4>
    </div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="row justify-content-center">
          <div class="col-10">
            <div class="row justify-content-between actions mb-2">
              <div class="col-2">
                <b-button variant="default" class="ml-0" @click="$router.push('/rules')">
                  <i class="ti-arrow-left"></i> Volver
                </b-button>
              </div>
              <div class="col-4 d-flex justify-content-end">
                <b-button v-if="!isNewRule" variant="danger" @click="confirmDelete">
                  <i class="ti-trash"></i> Eliminar
                </b-button>
                <b-button variant="success" @click="addRule">
                  <i class="ti-save"></i> Guardar
                </b-button>
              </div>
            </div>
            <div class="row">
              <fg-input
                class="col-6"
                maxlength="100"
                placeholder="Nombre"
                v-model="ruleModel.name"
                label="Nombre"
              ></fg-input>
              <fg-input
                tag="textarea"
                class="col-6"
                maxlength="255"
                placeholder="Descripción (Opcional)"
                v-model="ruleModel.description"
                label="Descripción"
              ></fg-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-2 offset-1">
            <h5>SI</h5>
          </div>
        </div>
        <div v-for="(item, index) in ruleModel.clauses" :key="item.id" class="row clause-row">
          <div class="col-1 offset-1 pr-0" v-if="index != 0">
            <div class="row">
              <b-form-select
                v-model="item.connector"
                class="pl-1 connector"
                required
                :options="connectors"
              ></b-form-select>
            </div>
          </div>
          <!-- <div class="col-10 pl-3" :class="{ 'offset-1': index == 0}"> -->
          <div class="col-9" :class="{ 'offset-2': index == 0}">
            <div class="row w-100 justify-content-between">
              <fg-input
                v-model="item.param"
                class="col-4"
                required
                placeholder="Parámetro"
                maxlength="50"
                uppercase
                @input.native="sanitizeParamName($event)"
              >
                <template slot="addonHelp">
                  <button
                    class="form-text text-muted"
                    @click="goToSelectDefect(index)"
                  >Seleccionar Defecto</button>
                </template>
              </fg-input>
              <b-form-select v-model="item.operator" class="col-2" required :options="operators"/>
              <fg-input
                v-model="item.value"
                class="col-4 pr-0"
                required
                placeholder="Valor"
                maxlength="50"
                uppercase
                @input.native="sanitizeParamName($event)"
              ></fg-input>
            </div>
          </div>
          <button v-if="index != 0" class="btn-delete-clause" @click="deleteClause(index)">
            <i class="fa fa-times-circle"></i>
          </button>
        </div>
        <div class="row">
          <div class="col-10 offset-1 d-flex justify-content-end pr-4">
            <button class="btn-add-clause mr-2" @click="addClause">
              <i class="fa fa-plus-circle"></i>
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-2 offset-1">
            <h5>ENTONCES</h5>
          </div>
        </div>
        <div class="row consequent-row">
          <div class="col-9 offset-2">
            <div class="row w-100 align-items-center">
              <fg-input
                v-model="ruleModel.consequentName"
                class="col-4 my-0"
                required
                placeholder="Consecuente"
                maxlength="50"
                uppercase
                @input.native="sanitizeParamName($event)"
              ></fg-input>
              <h5 class="col-4 text-center my-0">=</h5>
              <fg-input
                v-model="ruleModel.consequentValue"
                class="col-4 my-0"
                required
                placeholder="Valor"
                maxlength="50"
                uppercase
              ></fg-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal id="confirm-modal" size="md" title="Borrar Regla?" @ok="deleteRule">
      <template slot="default">
        <p>¿ Desea borrar la regla "{{ ruleModel.name }}" ?</p>
      </template>

      <template slot="modal-footer" slot-scope="{ ok, hide }">
        <b-button variant="default" @click="hide()">Cancelar</b-button>
        <b-button variant="danger" @click="ok()">
          <i class="ti-trash"></i> Eliminar
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      isNewRule: false,
      ruleModel: { ...this.defaultRule },
      defaultRule: {
        id: 0,
        className: "com.pmvb.scpiback.data.models.Rule",
        name: "",
        description: "",
        clauses: [{ ...this.defaultClause }],
        factIndex: null,
      },
      defaultClause: {
        id: 1,
        connector: null,
        param: "",
        operator: null,
        value: ""
      },
      operators: [
        { value: null, text: "Operador" },
        { value: "==", text: "=" },
        { value: "!=", text: "<>" },
        ">",
        ">=",
        "<",
        "<="
      ],
      connectors: [
        { value: null, text: "Conector" },
        { value: "&&", text: "Y" },
        { value: "||", text: "O" }
      ]
    };
  },
  computed: {
    ...mapState(["loading", "allRules", "tmpRuleModel"])
  },
  methods: {
    ...mapActions([
      "loadAllRules",
      "deleteRuleById",
      "saveRule",
      "setTmpRuleModel"
    ]),
    refreshPage(ruleId) {
      if (this.tmpRuleModel) {
        this.ruleModel = { ...this.tmpRuleModel };
        this.isNewRule = (this.tmpRuleModel.id || 0) == 0;
        return;
      }
      this.isNewRule = ruleId == "new";
      if (this.isNewRule) {
        this.ruleModel = { ...this.defaultRule };
        return;
      }
      let rules = this.allRules.filter(r => r.id == ruleId);
      if (rules.length == 0) {
        this.$router.replace("notfound");
        return;
      }
      this.ruleModel = rules[0];
    },
    deleteRule() {
      this.deleteRuleById(this.ruleModel);
      this.$notify({
        message: "Se eliminó la regla exitosamente",
        type: "info"
      });
    },
    confirmDelete() {
      this.$bvModal.show("confirm-modal");
    },
    beforeRouteUpdate(to, from, next) {
      this.refreshPage(this.$route.params.ruleId);
      next();
    },
    addClause() {
      this.ruleModel.clauses.push({
        ...this.defaultClause,
        id: this.ruleModel.clauses.length + 1
      });
    },
    deleteClause(index) {
      this.ruleModel.clauses.splice(index, 1);
    },
    addRule() {
      if (!this.validate()) {
        return;
      }
      this.setTmpRuleModel(null);
      this.saveRule(this.ruleModel).then(() => {
        this.$notify({
          message: "Se guardó la regla exitosamente",
          type: "info"
        });
        this.$router.push("/rules");
      });
    },
    validate() {
      if (!this.ruleModel.name) {
        this.$notify({
          message: "Ingrese el nombre de la regla",
          type: "danger"
        });
        return false;
      }
      if (!this.validateClauses()) {
        this.$notify({
          message: "Corrija los errores en los términos de la regla",
          type: "danger"
        });
        return false;
      }
      if (!this.ruleModel.consequentName || !this.ruleModel.consequentValue) {
        this.$notify({
          message: "Ingrese los datos del consecuente",
          type: "danger"
        });
        return false;
      }
      return true;
    },
    validateClauses() {
      let size = this.ruleModel.clauses.length;
      for (let i = 0; i < size; i++) {
        let clause = this.ruleModel.clauses[i];
        if (!clause.param) {
          this.$notify({
            message: "Ingrese el nombre del parámetro",
            type: "danger"
          });
          return false;
        }
        if (i != 0 && !clause.connector) {
          this.$notify({
            message: "Seleccione el conector del parámetro",
            type: "danger"
          });
          return false;
        }
        if (!clause.operator) {
          this.$notify({
            message: "Seleccione el operador del parámetro",
            type: "danger"
          });
          return false;
        }
        if (!clause.value) {
          this.$notify({
            message: "Ingrese el valor del parámetro",
            type: "danger"
          });
          return false;
        }
      }
      return true;
    },
    sanitizeParamName($e) {
      if ($e.target.value.match(/\s+/)) {
        this.$notify({
          message: "No se permiten espacios para los nombres de parámetros",
          type: "danger"
        });
      }
      $e.target.value = $e.target.value.replace(/\s+/g, "_");
    },
    goToSelectDefect(index) {
      this.ruleModel.factIndex = index;
      this.setTmpRuleModel(this.ruleModel);
      this.$router.push("/rules/defect-area-selection");
    }
  },
  mounted() {
    this.refreshPage(this.$route.params.ruleId);
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == "/rules") {
      this.setTmpRuleModel(null);
    }
    next();
  }
};
</script>

<style lang="scss">
.rule-detail {
  padding-bottom: 20px;
  padding-right: 15px;
  padding-left: 15px;

  ::placeholder {
    color: black;
    opacity: 1;
  }

  .row {
    margin-right: 0;
  }

  .page-title {
    margin-bottom: 15px;
  }

  .form-control {
    border: 1px solid gray;
  }

  .consequent-row {
    margin-bottom: 1rem;

    .form-group {
      margin-bottom: 0;
    }
  }

  .clause-row {
    margin-bottom: 1rem;

    .form-group {
      margin-bottom: 0;
    }

    button {
      &.btn-delete-clause {
        color: red;
        font-size: 2rem;
        margin-top: -25px;
      }
    }
  }

  .connector {
    width: auto;
  }

  button.btn-add-clause {
    color: green;
    font-size: 2rem;

    &:parent {
      padding-right: 20px;
    }
  }

  .actions button {
    margin: 0 10px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
