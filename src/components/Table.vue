<template lang="pug">
  table
    thead
      tr
        th #
        th(v-for='(header, h) in headers', :key='h') {{ header }}
    tbody
      tr(v-for='(agent, a) in data',
        :key='a', @click='selectRow')
        td {{ a+1 }}
        td(v-for='(field, f) in agent', :key='f') {{ field }}
</template>

<script>
/**
 * Set the size of the headers and data columns based on it's content
 * to align the columns on thead and tbody.
 */
function resizeColumns() {
  let table          = document.querySelector('table')
  let header_row     = table.querySelector('thead tr:last-child')
  let first_data_row = table.querySelector('tbody tr')
  // List of elements.
  let data_els   = Array.from(first_data_row.children)
  let header_els = Array.from(header_row.children)

  data_els.forEach((el, i) => {
    let elWidth   = el.getBoundingClientRect().width
    let headWidth = header_els[i].getBoundingClientRect().width
    let width     = elWidth > headWidth ? elWidth : headWidth

    header_els[i].style.width = `${width}px`
    el.style.width = `${width}px`
  })
}

export default {
  props: {
    headers: {type: Array, required: true},
    data:    {type: Array, required: true}
  },
  mounted() {
    resizeColumns()
  },
  methods: {
    selectRow: function (ev) {
      let selectedRows = document.querySelectorAll('table tr.row-selected')

      if(selectedRows && !ev.ctrlKey) {
        selectedRows.forEach(row => {
          row.classList.remove('row-selected')
        })
      }

      ev.target.parentElement.classList.add('row-selected')
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
  color: #34495e;
  user-select: none;
}
thead,
tbody {
  display: block;
  background: white;
}
th, td {
  border: 1px solid #ccc;
  padding: .3em;
  font-weight: normal;
}
thead {
  position: sticky;
  top: 0;
  tr {
    th:first-child {
      font-size: 0.7em;
      text-align: center;
    }
  }
}
tbody {
  tr {
    transition: 200ms;
    &:hover {
      background-color: #eee;
    }

    td:first-child {
      font-size: 0.7em;
      text-align: center;
    }
  }
}

tr.row-selected {
  transition: 0;
  td:first-child {
    font-weight: bold;
    background-color: hsla(0, 0%, 65%, 1);
    color: white;
  }
  td {
    background-color: hsla(0, 0%, 90%, 1);
  }
}
</style>
