<template>
  <div class="spinner-container d-flex justify-content-center align-items-center">
    <div class="spinner-border text-dark" role="status">
      <span class="sr-only">Cargando...</span>
    </div>
  </div>
</template>

<style lang="scss">
.spinner-container {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(192, 192, 192, 0.363);
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  z-index: 100;
}
</style>
