<template>
        <div class="uk-width-4-5@m uk-margin-auto" uk-grid>
            <div class="uk-width-1-2@m">
                <table class="uk-table">
                    <caption class="uk-text-center">TEAM 1</caption>
                    <thead>
                        <tr>
                            <th> </th>
                            <th>name</th>
                            <th>k/d/a</th>
                            <th>heal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(player, i) in team1Results()" :key="i">
                            <td><img src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1" width="40" /> </td>
                            <td>{{ player.Name }}</td>
                            <td>{{ player.Kills }} / {{ player.Deaths }}</td>
                            <td> {{ player.Healing }}</td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <div class="uk-width-1-2@m" style="border-left: 1px solid #423e51">
                <table class="uk-table">
                    <caption class="uk-text-center">TEAM 2</caption>
                    <thead>
                        <tr>
                            <th> </th>
                            <th>name</th>
                            <th>k/d/a</th>
                            <th>heal</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(player, i) in team2Results()" :key="i">
                        <td><img src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1" width="40" /> </td>
                        <td>{{ player.Name }}</td>
                        <td>{{ player.Kills }} / {{ player.Deaths }}</td>
                        <td> {{ player.Healing }}</td>
                    </tr>

                    </tbody>
                </table>
            </div>
        </div>
</template>

<script>
import seasonPoints from '@/components/CrystalLeague/seasonPoints.js'

export default {
    name: 'General',
    props: ['players'],
    data: function () {
        return {
            seasonPoints : seasonPoints,
        }
    },
    components: {
    },
    methods: {
        team1Results: function () {
            return this.players.filter( p => p.Team === "ATTACKER")
        },
        team2Results: function () {
            return this.players.filter( p => p.Team === "DEFENDER")
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
tr > td {
    padding : 5px;
}
</style>
