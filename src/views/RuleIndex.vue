<template>
  <div class="rule-index bg-white">
    <LoadingSpinner v-if="loading"/>
    <div class="row justify-content-center page-title">
      <h4>Mantenimiento de Reglas</h4>
    </div>
    <div class="row justify-content-center">
      <div class="col-10">
        <div class="row justify-content-between">
          <b-col md="6" class="mx-2">
            <b-form-group label-cols-sm="3" label="Filtrar" class="mb-0">
              <b-input-group>
                <b-form-input v-model="filter" placeholder="Buscar Regla"></b-form-input>
                <b-input-group-append>
                  <button class="btn btn-default" @click="filter = ''">Borrar</button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>

          <div class="col-3 text-right">
            <button class="btn btn-default">Nueva Regla</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-10">
        <b-table
          show-empty
          stacked="md"
          outlined
          hover
          primary-key="id"
          :items="allRules"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          head-variant="light"
          @filtered="onFiltered"
        >
          <template slot="index" slot-scope="row">
            {{ row.index + 1 }}
          </template>

          <template slot="actions" slot-scope="row">
            <div class="d-flex justify-content-between">
              <router-link
                :to="`/rules/${row.item.id}`"
                class="btn btn-sm btn-default"
                title="Editar"
              >
                <i class="ti-pencil"></i>
              </router-link>
              <b-button
                size="sm"
                variant="danger"
                @click="confirmDelete(row.item)"
                class="mr-1"
                title="Eliminar"
              >
                <i class="ti-trash"></i>
              </b-button>
            </div>
          </template>

          <template slot="empty">
            <p class="text-center">Aún no hay registros</p>
          </template>
          <template slot="emptyfiltered">
            <p class="text-center">No hay registros con esas características</p>
          </template>
        </b-table>
        <b-row>
          <b-col md="6" class="my-1">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              class="my-0"
            ></b-pagination>
          </b-col>
        </b-row>
      </div>
    </div>
    <b-modal id="confirm-modal" size="md" title="Borrar Regla?" @ok="deleteRule(selectedRule)">
      <template slot="default">
        <p>¿ Desea borrar la regla "{{ selectedRule.name }}" ?</p>
      </template>

      <template slot="modal-footer" slot-scope="{ ok, hide }">
        <b-button variant="default" @click="hide()">Cancelar</b-button>
        <b-button variant="danger" @click="ok()"><i class="ti-trash"></i> Eliminar</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  components: {
    LoadingSpinner
  },
  data() {
    return {
      fields: [
        { key: "index", label: "#" },
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "consequent", label: "Consecuente" },
        { key: "actions", label: "Acciones" }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      filter: "",
      selectedRule: '',
    };
  },
  computed: {
    ...mapState(["loading", "allRules"])
  },
  methods: {
    ...mapActions(["loadAllRules", "deleteRuleById"]),
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    editRule(rule) {
      this.$router.push(`/rules/${rule.id}`);
    },
    deleteRule(rule) {
      this.deleteRuleById(rule);
      this.$notify({ message: 'Se eliminó la regla exitosamente', type: 'info' });
    },
    confirmDelete(rule) {
      this.selectedRule = rule;
      this.$bvModal.show('confirm-modal');
    }
  },
  mounted() {
    if (this.allRules.length == 0) {
      this.loadAllRules();
    }
    this.totalRows = this.allRules.length;
  },
  watch: {
    allRules() {
      this.totalRows = this.allRules.length;
    }
  }
};
</script>

<style lang="scss">
.rule-index {
  padding-bottom: 20px;
  padding-right: 15px;
  padding-left: 15px;

  .page-title {
    margin-bottom: 15px;
  }
}
</style>
