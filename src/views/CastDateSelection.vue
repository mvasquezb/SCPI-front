<template>
  <div class="row bg-white color-selection">
    <h4 class="col-12 text-center form-title">Fecha de colaje</h4>
    <div class="grid-container row col-12">
      <div class="col-5 text-center">
        <h4>Seleccione la fecha de colaje</h4>
      </div>
      <div class="col-7">
        <datepicker
          :inline="true"
          v-model="selectedDate"
          :monday-first="true"
          :language="attrs.lang"
          :bootstrap-styling="false"
          calendar-class="calendar"
          :disabled-dates="attrs.disabledDates"
          @selected="onSubmit"
          :full-month-name="true"
        ></datepicker>
      </div>
    </div>
    <div class="row w-100 mx-1 my-2">
      <div class="col-12 footer">
        <button class="btn btn-default btn-back" @click="$router.back()">Volver</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Datepicker from "vuejs-datepicker";
import { es } from "vuejs-datepicker/dist/locale";
import * as moment from 'moment';

export default {
  components: {
    Datepicker
  },
  data() {
    return {
      selectedDate: null,
      attrs: {
        disabledDates: {
          from: new Date(),
          to: moment().subtract(1, 'months').toDate()
        },
        lang: es
      }
    };
  },
  computed: {
    ...mapState([]),
    hasError() {
      return this.selectedDate == null;
    },
  },
  methods: {
    ...mapActions(["selectCastDate"]),
    onSubmit(date) {
      this.selectedDate = date;
      if (this.hasError) {
        this.$notify({ message: 'Seleccione la fecha de colaje', type: 'danger' });
        return;
      }
      this.selectCastDate(this.selectedDate);
      this.$router.push("wagon-position-selection");
    }
  },
};
</script>

<style lang="scss">
.col-7 .calendar {
  width: 100%;
  font-size: 1.2rem;

  .cell {
    padding-top: 5px;
    padding-bottom: 5px;
    height: auto;
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
</style>
