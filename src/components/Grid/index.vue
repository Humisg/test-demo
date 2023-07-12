<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Grid',
  props: {
    cols: {
      type: Number,
      default: 24
    },
  },
}
</script>

<style scoped>

</style>
