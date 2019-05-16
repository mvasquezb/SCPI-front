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
            <div class="row justify-content-end actions">
              <div class="col-4 d-flex justify-content-end">
                <b-button v-if="!isNewRule" variant="danger" @click="confirmDelete">
                  <i class="ti-trash"></i> Eliminar
                </b-button>
                <b-button variant="success">
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
          <div class="col-1 offset-1 pr-0 d-flex align-items-center" v-if="index != 0">
            <div class="row">
              <b-form-select v-model="item.connector" class="pl-1 connector" required :options="connectors"></b-form-select>
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
              ></fg-input>
              <b-form-select v-model="item.operator" class="col-2" required :options="operators"/>
              <fg-input
                v-model="item.value"
                class="col-4 pr-0"
                required
                placeholder="Valor"
                maxlength="50"
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
              <fg-input v-model="ruleModel.consequentName" class="col-4 my-0" required placeholder="Consecuente" maxlength="20"></fg-input>
              <h5 class="col-4 text-center my-0">=</h5>
              <fg-input v-model="ruleModel.consequentValue" class="col-4 my-0" required placeholder="Valor" maxlength="20"></fg-input>
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
      ruleModel: {
        className: "com.pmvb.scpiback.data.models.Rule",
        clauses: [{ ...this.defaultClause }]
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
        "=",
        "<>",
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
    ...mapState(["loading", "allRules"])
  },
  methods: {
    ...mapActions(["loadAllRules", "deleteRuleById"]),
    refreshPage(ruleId) {
      this.isNewRule = ruleId == "new";
      if (this.isNewRule) {
        this.ruleModel = {
          className: "com.pmvb.scpiback.data.models.Rule",
          clauses: [{ ...this.defaultClause }]
        };
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
    validate() {
      if (!this.ruleModel.name) {
        this.$notify({ message: 'Ingrese el nombre de la regla', type: 'danger' });
        return false;
      }
      if (!this.validateClauses()) {
        this.$notify({ message: 'Corrija los errores en los términos de la regla', type: 'danger'});
        return false;
      }
      if (!this.consequentName || !this.consequentValue) {
        this.$notify({ message: 'Ingrese los datos del consecuente', type: 'danger'});
        return false;
      }
      return true;
    },
    validateClauses() {
      return true;
    }
  },
  mounted() {
    this.refreshPage(this.$route.params.ruleId);
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
        margin-top: -5px;
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
