<template>
  <div class="counter-container bg-nude">
    <p class="title">{{ title.toUpperCase().slice(0, 3) }}:</p>
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
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss" scoped>
.counter-container {
  padding: 5px 15px;
  display: flex;
  flex-direction: horizontal;

  p {
    margin: 0;
  }

  .title {
    margin-right: 20px;
    color: #F95F62;
  }
}
</style>
