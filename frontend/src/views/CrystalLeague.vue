<template>
    <div class="crystal-league uk-width-4-5@m uk-margin-auto" >
        <table class="uk-table header_result" style="margin-bottom:0px;bottom: 12px;position: relative;">
            <thead>
            <th style="width:12%">DATE</th>
            <th style="width:6%">LEVEL</th>
            <th style="width:5%">KILLS</th>
            <th style="width:15%">WINNING GUILD</th>
            <th style="width:15%">LOSING GUILD</th>
            <th></th>
            </thead>
        </table>

        <div class="uk-child-width-1-2@m" uk-grid>
            <div class="uk-card uk-card-default uk-margin-small crystal-detail m-2" v-for="(battle, index) in data" :key="index">
                <table class="uk-table result" style="margin-bottom:0px;bottom: 12px;position: relative;">
                    <tbody>
                    <tr>
                        <td width="" style="max-width:180px!important;">{{readableDate(battle.startTime)}}</td>
                        <td width="">Level {{ battle.crystalLeagueLevel}}</td>
                        <td class="players">
                            <li v-for="(player, i) in Object.values(battle.team1Results)" :key='i'>
                                {{player.Name}}
                            </li>
                        </td>
                        <td width="" class="winner">{{battle.team1Tickets}}</td>
                        <td width="" class="loser">{{battle.team2Tickets}}</td>
                        <td class="players">
                            <li v-for="(player, i) in Object.values(battle.team2Results)" :key='i'>
                                {{player.Name}}
                            </li>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'CrystalLeague',
    props: [],
    data: function () {
        return {
            data : null,
        }
    },
    components: {
    },
    methods: {
        readableDate: function (date) {
            return `${date.slice(0, 10)} ${date.slice(11, 19)}`
        },
    },
    computed: {
    },
    async mounted () {
        await axios.get(`http://localhost:5000/crystalLeague`) //https://handholdreport.com/api/
        .then( res => {
            this.data = res.data
        })
    },
    watch: {

    }
}
</script>

<style scoped>
.crystal-detail {
    width: 45%;
    margin: 2%;
    margin-bottom:0px!important;
}
.night .crystal-detail {
    background:#24212f;
}
/* .night .crystal-detail:nth-child(2n) {
    background: #131218;
} */
.players {
    font-size: 14px;
}
</style>
