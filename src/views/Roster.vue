<template lang="pug">
  .roster-container
    .filters-box
      pagination
    Table.data(:headers='tableHeaders', :data='tableData')
</template>

<script>
import Table from '../components/Table.vue'
import Pagination from '../components/Pagination.vue'

export default {
  components: {Table, Pagination},
  data() {
    return {
      tableHeaders: ['ID', 'Active', 'Agent Name', 'Campaign', 'Position'],
      tableData: [
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'},
        {id: 12345, active: 'Active', name: 'Agent Name 1', campaign: 'Account Name', position: 'Agent'}
      ]
    }
  }
}
</script>


<style lang="postcss" scoped>

</style>

