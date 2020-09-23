<template>
    <table class="uk-table" style="">
        <tbody v-if="battle">
        <tr>
            <td width="110" style="text-align:center;">
                {{readableDate(battle.startTime)}}<br/>
                Level {{ battle.level}}
            </td>
            <td class="players">
                <li v-for="(player, i) in team1Results(battle)" :key='i' :id="player.PlayerId">
                    <!-- <img src="https://render.albiononline.com/v1/item/T6_MAIN_MACE@1"/>  -->
                    <img v-if="player.MainHand" :uk-tooltip="player.MainHand" :src="imageWeaponUri(player.MainHand)">
                    {{player.Name}}
                    <img style="width:11px;" v-if="battle.team1Leader === player.id" src="../../assets/crown.png" /> 
                </li>
            </td>
            <td style="position:relative;width:40px;">
                <span class="result" :class="battle.team1Tickets > battle.team2Tickets ? 'win' : 'lose'">{{battle.team1Tickets}}</span><br/>
                <span style="position:absolute;bottom: 10px;left: -10px;color:#3a85ad;font-weight:bold;">
                    <img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC"> 
                    {{teamSeasonPoints(battle.team1Tickets, battle.team2Tickets, battle.level)}}
                </span>
            </td>
            <td style="position:relative;width:40px;">
                <span class="result" :class="battle.team2Tickets > battle.team1Tickets ? 'win' : 'lose'">{{battle.team2Tickets}}</span><br/>
                <span style="position:absolute;bottom: 10px;left: 10px;color:#3a85ad;font-weight:bold;">
                {{teamSeasonPoints(battle.team2Tickets, battle.team1Tickets, battle.level)}}
                <img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC"></span>
            </td>
            <td class="players" style="text-align:right;">
                <li v-for="(player, i) in team2Results(battle)" :key='i'>
                    <img style="width:11px;" v-if="battle.team2Leader === player.id" src="../../assets/crown.png" /> 
                    {{player.Name}}
                    <img v-if="player.MainHand" :uk-tooltip="player.MainHand" :src="imageWeaponUri(player.MainHand)">
                </li>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
import seasonPoints from '@/components/CrystalLeague/seasonPoints.js'

export default {
    name: 'GlobalOverview',
    props: ['battle'],
    data: function () {
        return {
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
        team1Results: function (battle) {
            return battle.players.filter( p => p.Team === "ATTACKER")
        },
        team2Results: function (battle) {
            return battle.players.filter( p => p.Team === "DEFENDER")
        },
        imageWeaponUri (weaponType) {
            return `https://render.albiononline.com/v1/item/${weaponType}` // https://gameinfo.albiononline.com/api/gameinfo/items/
        },
    },
    computed: {
        
    },
    mounted () {
        this.battle.events.forEach( e => {
            this.battle.players = this.battle.players.map( player => {
                if (player.id === e.Killer.Id) return {...player, MainHand : e.Killer.MainHand}
                if (player.id === e.Victim.Id) return {...player, MainHand : e.Victim.MainHand}
                e.Participants.forEach( p => {
                    if (player.id === p.Id && !player.MainHand) return {...player, MainHand : p.MainHand}
                })
                return {...player}
            }) 
        })
    },
    watch: {
        battle : function () {
            this.battle.events.forEach( e => {
            this.battle.players = this.battle.players.map( player => {
                if (player.id === e.Killer.Id) return {...player, MainHand : e.Killer.MainHand}
                if (player.id === e.Victim.Id) return {...player, MainHand : e.Victim.MainHand}
                e.Participants.forEach( p => {
                    if (player.id === p.Id && !player.MainHand) return {...player, MainHand : p.MainHand}
                })
                return {...player}
            }) 
            })
        }
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
