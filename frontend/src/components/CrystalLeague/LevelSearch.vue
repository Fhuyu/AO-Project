<template>
    <div class="form_global_search uk-text-center uk-width-auto@m m-4">
        <form class="uk-form-horizontal">
            <select class="uk-select playerFilter" v-model="searchLevel" @change="levelSearch">
                <option value="0">Show All</option>
                <option value="1">Show Level 2 +</option>
                <option value="2">Show Level 3 +</option>
                <option value="3">Show Level 4 +</option>
                <option value="4">Show Level 5 +</option>
                <option value="5">Show Level 6 +</option>
                <option value="6">Show Level 7 +</option>
            </select>
        </form>
    </div>
</template>

<script>

export default {
    name: 'PlayerSearch',
    props: ['level'],
    data: function () {
        return {
            searchLevel : '1',
        }
    },
    components: {
        
    },
    methods: {
        levelSearch: function () {
            this.$emit('levelSearch', this.searchLevel)
        },
    },
    computed: {
        
    },
    mounted () {

    },
    watch: {
        level : function () {
            this.searchLevel = this.level
        }
    }
}
</script>

<style scoped>
@import '../../assets/css/battleboard.css';
</style>
