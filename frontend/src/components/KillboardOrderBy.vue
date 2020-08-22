<template>
<div class="orderby uk-margin">
  <div style="position: absolute;
    right: 0;
    margin-right: 5%;">
    <img @click="changeColumn()" :style="!columnClass ? 'background-color:#14b2b8' : 'background-color:#FF7A4D'" style="padding:5px;" src="../assets/tree-column.png" />
    <img @click="changeColumn()" :style="columnClass ? 'background-color:#14b2b8' : 'background-color:#FF7A4D'" style="padding:5px;"  src="../assets/two-column.png" />
  </div>
    <div class="uk-button-group">
        <button @click="sort('guildName')" class="uk-button uk-button-secondary">GUILDNAME
            <span v-if="currentSort === 'guildName' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
            <span v-if="currentSort === 'guildName' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
        </button>
        <button @click="sort('name')" class="uk-button uk-button-secondary">NAME
            <span v-if="currentSort === 'name' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
            <span v-if="currentSort === 'name' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
        </button>
        <button @click="sort('kills')" class="uk-button uk-button-secondary">KILLS
            <span v-if="currentSort === 'kills' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
            <span v-if="currentSort === 'kills' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
        </button>
        <button v-if="showStats" @click="sort('assistance')" class="uk-button uk-button-secondary">ASSISTANCE
            <span v-if="currentSort === 'assistance' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
            <span v-if="currentSort === 'assistance' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
        </button>
        <button v-else class="uk-button uk-button-secondary" disabled>ASSISTANCE</button>

        <button v-if="showStats" @click="sort('itempower')" class="uk-button uk-button-secondary">ITEM POWER
            <span v-if="currentSort === 'itempower' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
            <span v-if="currentSort === 'itempower' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
        </button>
        <button v-else class="uk-button uk-button-secondary" disabled>ITEM POWER</button>

        <button @click="sort('killFame')" class="uk-button uk-button-secondary">KILLFAME
            <span v-if="currentSort === 'killFame' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
            <span v-if="currentSort === 'killFame' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
        </button>
        <button v-if="showStats" @click="sort('deathFame')" class="uk-button uk-button-secondary">DEATHFAME
            <span v-if="currentSort === 'deathFame' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
            <span v-if="currentSort === 'deathFame' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
        </button>
        <button v-else class="uk-button uk-button-secondary" disabled>DEATHFAME</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderBy',
  props: ['showStats', 'columnClass'],
  data: function () {
    return {
      currentSort: 'killFame',
      currentSortDir: 'desc',
      treeColumn: false,
    }
  },
  methods: {
    sort: function (column) {
      if (column === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = column
      this.$emit('clicked', this.currentSort, this.currentSortDir)
    },
    changeColumn: function () {
      this.treeColumn = this.treeColumn ? false : true
      this.$emit('changecolumn')
      this.$emit('clicked', this.currentSort, this.currentSortDir)

  },
  },

  watch: {
    treeColumn: function () {
      
    }
  }
}
</script>

<style scoped>
</style>
