<template>
    <div class="crystal-league">
        <div class="uk-width-4-5@m uk-margin-auto">
            <div uk-accordion="multiple: true">
            <li class="uk-card uk-card-default uk-margin-small" v-for="(battle, index) in data" :key="index">
                <a class="uk-accordion-title cgvg-detail" href="#" :style=" playerWon(battle) ? 'border-color:green;' : 'border-color:red;'">
                <table class="uk-table result" style="margin-bottom:0px;bottom: 12px;position: relative;">
                    <tbody>
                    <tr>
                        <td width="180" style="max-width:180px!important;">{{readableDate(battle.startTime)}}<br />
                            <div style="padding-top:8px;"><img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC" width="30">
                            
                            {{playerSeasonPoints(battle.team1Tickets, battle.team2Tickets, battle.level, battle)}}</div>
                            
                        </td>
                        <td><img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC" width="50"></td>
                        <td>K / D / A</td>
                        <td>Level {{ battle.level }} <br/>
                            <span class="result" :class="battle.team1Tickets > battle.team2Tickets ? 'win' : 'lose'">{{battle.team1Tickets}}</span> -
                            <span class="result" :class="battle.team2Tickets > battle.team1Tickets ? 'win' : 'lose'">{{battle.team2Tickets}}</span><br/>

                        </td>
                        <td>
                            <img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC" width="30">
                            <img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC" width="30">
                            <img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC" width="30"><br/>
                            <img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC" width="30">
                            <img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC" width="30">
                            <img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC" width="30">
                        </td>
                        <td class="players" style="text-align:left;">
                            <li v-for="(player, i) in team1Results(battle)" :key='i' :id="player.PlayerId">
                                <img src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1"/> 
                                <!-- <img v-if="player.MainHand" :uk-tooltip="player.MainHand" :src="imageWeaponUri(player.MainHand)"> -->
                                {{player.Name}}
                                <img style="width:11px;" v-if="battle.team1Leader === player.id" src="../../assets/crown.png" /> 
                            </li>
                        </td>
                        <td class="players" style="text-align:right;">
                            <li v-for="(player, i) in team2Results(battle)" :key='i'>
                                <img style="width:11px;" v-if="battle.team2Leader === player.id" src="../../assets/crown.png" /> 
                                {{player.Name}}
                                <!-- <img v-if="player.MainHand" :uk-tooltip="player.MainHand" :src="imageWeaponUri(player.MainHand)"> -->
                                <img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC" width="30">

                            </li>
                        </td>
                    </tr>
                    </tbody>
                    
                </table>
                </a>
                <div class="uk-accordion-content">
                    <div>
                        <ul class="uk-child-width-expand" uk-tab>
                            <li @click="grade = 1" :class="grade === 1 &&'uk-active'"><a>GENERAL</a></li>
                            <li @click="grade = 2" :class="grade === 2 &&'uk-active'"><a>DEATHS</a></li>
                            <li @click="grade = 3" :class="grade === 3 &&'uk-active'"><a>STATISTICS</a></li>
                        </ul>
                    </div>
                    <General :players="battle.players" v-if="grade === 1"></General>
                    <Deaths v-if="grade === 2"></Deaths>
                    <!-- <Stats v-if="grade === 3"></Stats> -->
                </div>
            </li>
        </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import seasonPoints from '@/components/CrystalLeague/seasonPoints.js'
import General from "@/components/CrystalLeague/details/General";
import Deaths from "@/components/CrystalLeague/details/Deaths";

export default {
    name: 'CrystalLeaguePlayer',
    props: ['data', 'player'],
    data: function () {
        return {
            seasonPoints : seasonPoints,
            grade : 1,
        }
    },
    components: {
        General,
        Deaths,
    },
    methods: {
        readableDate: function (date) {
            return `${date.slice(0, 10)} ${date.slice(11, 16)}`
        },
        playerTeam1 (cgvg) {
            let player = cgvg.players.find(p => p.Name.toLowerCase() === this.player.toLowerCase())
            return player && player.Team === "ATTACKER" ? true : false
        },
        playerWon : function (cgvg) {
            return (this.playerTeam1(cgvg) && cgvg.team1Tickets) || (!this.playerTeam1(cgvg) && cgvg.team2Tickets) ? true : false
        },
        playerSeasonPoints (team1, team2, crystalLevel, cgvg) {

            let player = cgvg.players.find(p => p.Name.toLowerCase() === this.player.toLowerCase())

            let myTeamPoint = player && player.Team === "ATTACKER" ? team1 : team2
            let ennemyPoint = myTeamPoint === team1 ? team2 : team1

            if (myTeamPoint > ennemyPoint) {
                if(crystalLevel === 1) return this.seasonPoints.points[crystalLevel]
                if (myTeamPoint > 109) return this.seasonPoints.points[crystalLevel]
                if (myTeamPoint > 39) return this.seasonPoints.points[crystalLevel] * 0.8
                if (40 > myTeamPoint) return this.seasonPoints.points[crystalLevel] * 0.6
            } else {
                if(crystalLevel === 1) return 0
                if (ennemyPoint > 109) return 0
                if (ennemyPoint > 39) return this.seasonPoints.points[crystalLevel] * 0.2 
                if (40 > ennemyPoint) return this.seasonPoints.points[crystalLevel] * 0.4
            }
        },
        team1Results: function (battle) {
            return battle.players.filter( p => p.Team === "ATTACKER")
        },
        team2Results: function (battle) {
            return battle.players.filter( p => p.Team === "DEFENDER")
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
.result.win {
    color:#a7f2a9;
}
.result.lose {
    color:red;
}
tr > td {
    vertical-align: middle;
}
.cgvg-detail {
    font-size: 16px;
    margin-right: 20px; 
    border-left: 8px solid green;
}
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
.uk-tab {
    margin-left: 0px!important;
}
.uk-tab > .uk-active > a  {
    color: #FF6933!important;
    border-color: #FF6933!important;
}
</style>
