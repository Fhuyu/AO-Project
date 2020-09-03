<template>
    <div class="crystal-league" >

        <div class="uk-child-width-1-2@m uk-width-4-5@m uk-margin-auto" uk-grid>
            <div class="uk-card uk-card-default uk-margin-small crystal-detail m-2" v-for="(battle, index) in data" :key="index">
                <table class="uk-table" style="">
                    <tbody v-if="data">
                    <tr>
                        <td width="110" style="text-align:center;">
                            {{readableDate(battle.startTime)}}<br/>
                            Level {{ battle.crystalLeagueLevel}}
                        </td>
                        <td class="players">
                            <li v-for="(player, i) in battle.team1Results" :key='i' :id="player.PlayerId">
                                <img src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1"/> 
                                {{player.Name}}
                                <img style="width:11px;" v-if="battle.team1LeaderId === player.id" src="../assets/crown.png" /> 
                            </li>
                        </td>
                        <td style="position:relative;width:30px;"><span class="result" :class="battle.team1Tickets > battle.team2Tickets ? 'win' : 'lose'">{{battle.team1Tickets}}</span><br/>
                            <span style="position:absolute;bottom: 10px;left: -10px;color:#3a85ad;font-weight:bold;">
                                <img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC"> 
                                {{teamSeasonPoints(battle.team1Tickets, battle.team2Tickets, battle.crystalLeagueLevel)}}
                            </span>
                        </td>
                        <td style="position:relative;width:30px;"><span class="result" :class="battle.team2Tickets > battle.team1Tickets ? 'win' : 'lose'">{{battle.team2Tickets}}</span><br/>
                            <span style="position:absolute;bottom: 10px;left: 10px;color:#3a85ad;font-weight:bold;">
                            {{teamSeasonPoints(battle.team2Tickets, battle.team1Tickets, battle.crystalLeagueLevel)}}
                            <img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC"></span>
                        </td>
                        <td class="players" style="text-align:right;">
                            <li v-for="(player, i) in battle.team2Results" :key='i'>
                                <img style="width:11px;" v-if="battle.team2LeaderId === player.id" src="../assets/crown.png" /> 
                                {{player.Name}} <img src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1"/>
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
import seasonPoints from '@/components/CrystalLeague/seasonPoints.js'
import axios from 'axios'

export default {
    name: 'CrystalLeague',
    props: [],
    data: function () {
        return {
            data : null,
            seasonPoints : seasonPoints,
        }
    },
    components: {
    },
    methods: {
        readableDate: function (date) {
            return `${date.slice(0, 10)} ${date.slice(11, 19)}`
        },
        teamSeasonPoints (myTeamPoint, ennemyPoint, crystalLevel) {
            if (myTeamPoint > ennemyPoint) {
                if(crystalLevel === 1) return this.seasonPoints.points[crystalLevel] * 5
                if (myTeamPoint > 109) return this.seasonPoints.points[crystalLevel] * 5
                if (myTeamPoint > 39) return this.seasonPoints.points[crystalLevel] * 0.8 * 5
                if (40 > myTeamPoint) return this.seasonPoints.points[crystalLevel] * 0.6 * 5
            } else {
                if(crystalLevel === 1) return 0
                if (ennemyPoint > 109) return 0
                if (ennemyPoint > 39) return this.seasonPoints.points[crystalLevel] * 0.2 * 5
                if (40 > ennemyPoint) return this.seasonPoints.points[crystalLevel] * 0.4 * 5
            }
        },
        playersArray(playerObj) {
            let playersID = Object.keys(playerObj)
            let players = Object.values(playerObj)
            return players.map((player, i) => ({...player, id: playersID[i]}))
            
            
        }
    },
    computed: {
        
    },
    async mounted () {
        await axios.get(`http://localhost:5000/crystalLeague`) //https://handholdreport.com/api/
        .then( res => {
            this.data = res.data
            this.data.forEach(battle => {
                battle.team1Results = this.playersArray(battle.team1Results)
                battle.team2Results = this.playersArray(battle.team2Results)
            })
        })
        console.log(this.playersArray(this.data[0].team2Results))
    },
    watch: {

    }
}
</script>

<style scoped>
.night .crystal-league {
    background-color: #05081c;
}
.crystal-detail .result {
    font-size:24px;
}
.crystal-detail {
    width: 45%;
    margin: 1% 2%!important;
    padding-left: 0;
}
.crystal-detail td {
    vertical-align: middle;
}
.crystal-detail img {
    width: 20px;
}
.crystal-detail .result.win {
    color:green;
}
.crystal-detail .result.lose {
    color:red;
}
.night .crystal-detail {
    background:#24212f;
}
/* .night .crystal-detail:nth-child(2n) {
    background: #131218;
} */
.players {
    font-size: 14px;
    width:160px;
}
</style>
