<template>
    <div class="form_global_search uk-text-center uk-width-auto@m m-4">
            <form class="form_search" @submit.prevent="playerSearch(searchName)" style="float:left;margin-left:1%;">
                <div class="select_div" uk-form-custom="target: > * > span:first-child">
                    <select v-model="searchType"  class="uk-select">
                        <option value="player">Player</option>
                    </select>
                    <button class="" type="button" tabindex="-1">
                        <span></span>
                        <span uk-icon="icon: chevron-down" style="padding-left:5px"></span>
                    </button>
                </div>
                <input v-model="searchName" placeholder="Name with capital letter">
                <span class="icon right" @click="playerSearch(searchName)" uk-icon="icon: search; ratio: 1.5"></span>
            </form>
    </div>
</template>

<script>

export default {
    name: 'PlayerSearch',
    props: ['player'],
    data: function () {
        return {
            searchType : 'player',
            searchName : '',
        }
    },
    components: {
        
    },
    methods: {
        playerSearch: function () {
            this.$emit('playerSearch', this.searchName)
        },
    },
    computed: {
        
    },
    mounted () {

    },
    watch: {
        player : function () {
            this.searchName = this.player
        }

    }
}
</script>

<style scoped>
@import '../../assets/css/battleboard.css';
</style>
