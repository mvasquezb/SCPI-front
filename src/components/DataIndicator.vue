<template>
  <div class="indicator-container">
    <p class="title">{{ title }}</p>
    <p class="value">{{ value }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    value: {
      default: ""
    }
  }
};
</script>

<style lang="scss">
.indicator-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.title {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.value {
  align-self: center;
  background-color: white;
  padding: 10px 25px;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 1.5em;
  border: 3px solid grey;
}
</style>
