<template>
    <div class="form_global_search uk-text-center uk-width-auto@m m-4">
            <form class="form_search" @submit.prevent="launchGuildSearch(searchName)">
                <div class="select_div" uk-form-custom="target: > * > span:first-child">
                    <select v-model="searchType"  class="uk-select">
                        <option value="player">Player</option>
                    </select>
                    <button class="" type="button" tabindex="-1">
                        <span></span>
                        <span uk-icon="icon: chevron-down" style="padding-left:5px"></span>
                    </button>
                </div>
                <input v-model="searchName" placeholder="NOT WORKING">
                <span class="icon right" @click="launchGuildSearch(searchName)" uk-icon="icon: search; ratio: 1.5"></span>
            </form>
    </div>
</template>

<script>

export default {
    name: 'PlayerSearch',
    props: [],
    data: function () {
        return {
            searchType : 'player',
            searchName : '',
        }
    },
    components: {
        
    },
    methods: {
        launchGuildSearch: function () {
            // if (this.searchType === 'guild') this.searchGuildName = this.currentGuildSearch[0]
            // this.$router.push({ path: `${this.searchGuildName}`, query: { search: this.searchType } })
            // this.currentOffset = 0
            // this.minBattlePlayers = 0
            // this.launchNewSearch() // fetch new data
        },
    },
    computed: {
        
    },
    mounted () {

    },
    watch: {

    }
}
</script>

<style scoped>
@import '../../assets/css/battleboard.css';
</style>
