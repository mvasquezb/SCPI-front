<template>
  <div class="indicator-container" :class="size">
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
    },
    size: {
      type: String,
      default: "regular"
    }
  }
};
</script>

<style lang="scss" scoped>
.indicator-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

p {
  margin: 0;
}

.title {
  font-weight: bold;
}

.value {
  align-self: center;
  background-color: white;
  margin: 0;
  border-color: grey;
  border-style: solid;
}

.regular {
  .title {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .value {
    padding: 10px 25px;
    font-size: 1.5em;
    border-width: 3px;
  }
}

.small {
  .title {
    font-weight: bold;
  }

  .value {
    align-self: center;
    background-color: white;
    padding: 2px 15px;
    // font-size: 1.5em;
    border-width: 2px;
  }
}
</style>
