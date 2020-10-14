<template>
    <div class="crystal-league">
        <div class="uk-width-4-5@m uk-margin-auto">
            ola
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import seasonPoints from '@/components/CrystalLeague/seasonPoints.js'

export default {
    name: 'CrystalLeaguePlayer',
    props: ['data', 'player'],
    data: function () {
        return {
            seasonPoints : seasonPoints,
        }
    },
    components: {
    },
    methods: {
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

</style>
