<template>
    <div class="crystal-league">
        <div class="uk-width-4-5@m uk-margin-auto">
            <li class="uk-card uk-card-default uk-margin-small" v-for="(battle, index) in data" :key="index">
                <table class="uk-table result" style="margin-bottom:0px;bottom: 12px;position: relative;">
                    <tbody>
                    <tr>
                        <td width="180" style="max-width:180px!important;">WIN <br/>
                            <span class="result" :class="battle.team1Tickets > battle.team2Tickets ? 'win' : 'lose'">{{battle.team1Tickets}} </span> 
                            <span class="result" :class="battle.team2Tickets > battle.team1Tickets ? 'win' : 'lose'"> {{battle.team2Tickets}}</span><br/>
                        
                        </td>
                        <td><img src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1" width="50"/> </td>
                        <td>K / D / A </td>
                        <td>{{readableDate(battle.startTime)}}<br/>
                            Level {{ battle.crystalLeagueLevel}}
                        </td>
                        <td class="uk-grid-column-small uk-grid-row-large uk-child-width-1-3@s" width="200">
                            <img class="player-gear" src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1"/> 
                            <img class="player-gear" src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1"/> 
                            <img class="player-gear" src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1"/> 
                            <img class="player-gear" src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1"/> 
                            <img class="player-gear" src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1"/> 
                            <img class="player-gear" src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1"/> 
                        </td>
                        <td class="players">
                            <li v-for="(player, i) in battle.team1Results" :key='i' :id="player.PlayerId">
                                <img src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1"/> 
                                {{player.Name}}
                                <img style="width:11px;" v-if="battle.team1LeaderId === player.id" src="../assets/crown.png" /> 
                            </li>
                        </td>
                        <td class="players" style="text-align:right;">
                            <li v-for="(player, i) in battle.team2Results" :key='i'>
                                <img style="width:11px;" v-if="battle.team2LeaderId === player.id" src="../assets/crown.png" /> 
                                {{player.Name}} <img src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1"/>
                            </li>
                        </td>

                
                        <td><span class="icon right" uk-icon="icon: search; ratio: 1.5"></span></td>
                    </tr>
                    </tbody>
                </table>
            </li>
        </div>
    </div>
</template>

<script>
// import PlayerSearch from '@/components/CrystalLeague/PlayerSearch';
import GlobalOverview from '@/components/CrystalLeague/GlobalOverview';
// import BestWeeklyFame from '@/components/CrystalLeague/BestWeeklyFame';
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
        GlobalOverview,
    },
    methods: {
        playersArray(playerObj) {
            let playersID = Object.keys(playerObj)
            let players = Object.values(playerObj)
            return players.map((player, i) => ({...player, id: playersID[i]}))
        },
        readableDate: function (date) {
            return `${date.slice(0, 10)} ${date.slice(11, 19)}`
        },
    },
    computed: {
        
    },
    async mounted () {
    },
    watch: {

    }
}
</script>

<style scoped>
.night .crystal-league {
    background-color: #05081c;
}
.player-gear {
    width:60px;
}
.night .crystal-detail {
    background:#24212f;
}
.players {
    font-size: 14px;
    width:160px;
    background:black;
}
.players img {
    width: 20px;
}
</style>
