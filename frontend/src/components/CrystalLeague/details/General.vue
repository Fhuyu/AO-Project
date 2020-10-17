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
                            <th>ip</th>
                            <th>heal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(player, i) in team1Results()" :key="i">
                            <td><img width="40" v-if="player.MainHand" :uk-tooltip="player.MainHand" :src="imageWeaponUri(player.MainHand)"></td>
                            <td>{{ player.Name }} <br /><small style="color:lightgray">{{ player.GuildName }}</small></td>
                            <td>{{ player.Kills }} / {{ player.Deaths }}</td>
                            <td> {{player.Itempower }}</td>
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
                            <th>ip</th>
                            <th>heal</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(player, i) in team2Results()" :key="i">
                        <td><img width="40" v-if="player.MainHand" :uk-tooltip="player.MainHand" :src="imageWeaponUri(player.MainHand)"></td>
                        <td>{{ player.Name }} <br /><small style="color:lightgray">{{ player.GuildName }}</small></td>
                        <td>{{ player.Kills }} / {{ player.Deaths }}</td>
                        <td> {{player.Itempower }}</td>
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
        imageWeaponUri (weaponType) {
            return `https://render.albiononline.com/v1/item/${weaponType}` // https://gameinfo.albiononline.com/api/gameinfo/items/
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
