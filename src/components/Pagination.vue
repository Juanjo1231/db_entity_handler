<template lang="pug">
  .pagination
    .nav Prev
    .page(v-for='n in pagesLimit') {{ n }}
    .nav Next
</template>

<script>
export default {
  data() {
    return {
      selectedPage: 1,
      pagesLimit: 5,
      totalPages: 15
    }
  },
  computed: {
    renderingPages: function () {
      let limit = Math.ceil(this.pagesLimit / 2)
      

    }
  }
}
</script>


<style lang="scss" scoped>
.pagination {
  display: flex;
  font-size: 0.8em;
  align-items: center;
  padding: .5em;
  background: white;
}
.page {
  width: 2em;
  height: 2em;
  border-radius: 50%;
  text-align: center;
  line-height: 2em;
  margin: 0 .2em;
  cursor: pointer;
  transition: 200ms;

  &:hover {
    background: #eee;
  }
}
.nav {
  margin: 0 .5em;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>

