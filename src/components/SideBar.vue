<template lang="pug">
  .container
    .toggle-btn
    router-link.option(v-for="(route, k) in routes", :key='k', :to='route.path') {{ route.name }}
</template>

<script>
export default {
  props: {
    routes: Array
  }
}
</script>

<style lang="scss" scoped>
$background: hsl(0, 0%, 30%);
$hover: hsl(0, 0%, 40%);
$fontColor: hsl(0, 0%, 60%);

.container {
  background-color: $background;
  color: $fontColor;
  padding: .5em;
  min-width: 10em;
}
.option {
  padding: .5em;
  border-bottom: 1px solid $fontColor;
  cursor: pointer;
  transition: 200ms;
  color: $fontColor;
  display: block;

  &:hover {
    background-color: $hover;
    color: hsl(0, 0%, 70%);
  }

  &:visited {
    color: $fontColor;
  }
}
</style>