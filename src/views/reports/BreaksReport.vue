<template>
  <div class="report-breaks row bg-white flex-column align-items-center pb-4">
    <h4>Reporte de Piezas</h4>
    <div class="selection-container col-8 pb-4">
      <div class="row justify-content-center">
        <h4>Seleccione el tipo de reporte a generar</h4>
      </div>
      <div class="row justify-content-center">
        <div
          v-for="report in reports"
          :key="report.name"
          class="bg-nude btn-report mx-3"
          @click="$router.push(report.route)"
        >{{ report.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reports: [
        {
          name: "CLASIFICADO",
          route: "/reports/classification"
        },
        {
          name: "ROTURAS",
          route: "/reports/breaks"
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.report-breaks {
  .selection-container {
    border: 1px solid black;
  }
  .btn-report {
    font-size: 2rem;
    border: 1px solid black;
    padding: 1rem 50px;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
