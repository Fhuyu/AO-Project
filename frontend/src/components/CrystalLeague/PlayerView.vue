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
                            Level {{ battle.level }}
                            
                            
                        </td>
                        <!-- <td>{{ playerStats(battle) }}</td> -->
                        <td><img width="60" v-if="playerStats(battle).MainHand" :uk-tooltip="playerStats(battle).MainHand" :src="imageWeaponUri(playerStats(battle).MainHand)"></td>

                        <td>{{ playerStats(battle).Kills }} / {{ playerStats(battle).Deaths }} / {{ playerStats(battle).Assistance ? playerStats(battle).Assistance : '-' }}</td>
                        <td>
                            <span class="result" :class="battle.team1Tickets > battle.team2Tickets ? 'win' : 'lose'">{{battle.team1Tickets}}</span> -
                            <span class="result" :class="battle.team2Tickets > battle.team1Tickets ? 'win' : 'lose'">{{battle.team2Tickets}}</span><br/>
                            <div style="padding-top:8px;"><img src="https://render.albiononline.com/v1/item/UNIQUE_GVGTOKEN_GENERIC" width="30">
                            {{playerSeasonPoints(battle.team1Tickets, battle.team2Tickets, battle.level, battle)}}</div>

                        </td>
                        <td>
                            <img width="40" v-if="playerStats(battle).OffHand" :uk-tooltip="playerStats(battle).OffHand" :src="imageWeaponUri(playerStats(battle).OffHand)">
                            <img width="40" v-if="playerStats(battle).Head" :uk-tooltip="playerStats(battle).Head" :src="imageWeaponUri(playerStats(battle).Head)">
                            <img width="40" v-if="playerStats(battle).Armor" :uk-tooltip="playerStats(battle).Armor" :src="imageWeaponUri(playerStats(battle).Armor)"><br/>
                            <img width="40" v-if="playerStats(battle).Shoes" :uk-tooltip="playerStats(battle).Shoes" :src="imageWeaponUri(playerStats(battle).Shoes)">
                            <img width="40" v-if="playerStats(battle).Cape" :uk-tooltip="playerStats(battle).Cape" :src="imageWeaponUri(playerStats(battle).Cape)">
                            <img width="40" v-if="playerStats(battle).Potion" :uk-tooltip="playerStats(battle).Potion" :src="imageWeaponUri(playerStats(battle).Potion)">
                        </td>
                        <td class="players" style="text-align:left;">
                            <li v-for="(player, i) in team1Results(battle)" :key='i' :id="player.PlayerId">
                                <img v-if="player.MainHand" :uk-tooltip="player.MainHand" :src="imageWeaponUri(player.MainHand)">
                                <a @click="$emit('playerSearch', player.Name)" style="color: lightgray;padding-left: 5px;">{{player.Name}}</a>

                                <img style="width:11px;" v-if="battle.team1Leader === player.id" src="../../assets/crown.png" /> 
                            </li>
                        </td>
                        <td class="players" style="text-align:right;">
                            <li v-for="(player, i) in team2Results(battle)" :key='i'>
                                <img style="width:11px;" v-if="battle.team2Leader === player.id" src="../../assets/crown.png" /> 
                                <a @click="$emit('playerSearch', player.Name)" style="color: lightgray;padding-right: 5px;">{{player.Name}}</a>
                                <img v-if="player.MainHand" :uk-tooltip="player.MainHand" :src="imageWeaponUri(player.MainHand)">

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
                    <Deaths :events="battle.events" v-if="grade === 2"></Deaths>
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
import Stats from "@/components/CrystalLeague/details/Stats";

export default {
    name: 'CrystalLeaguePlayer',
    props: ['data', 'player'],
    data: function () {
        return {
            seasonPoints : seasonPoints,
            grade : 1,
            // playerData : this.playerStats(),
        }
    },
    components: {
        General,
        Deaths,
        Stats,
    },
    methods: {
        playerStats (battle) {
            return battle.players.find(p => p.Name === this.player)
        },
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
        // teamSeasonPoints (team1, team2, crystalLevel, cgvg) {
        //     let player = cgvg.players.find(p => p.Name.toLowerCase() === this.player.toLowerCase())

        //     let myTeamPoint = player && player.Team === "ATTACKER" ? team1 : team2
        //     let ennemyPoint = myTeamPoint === team1 ? team2 : team1

        //     if (myTeamPoint > ennemyPoint) {
        //         if(crystalLevel === 1) return this.seasonPoints.points[crystalLevel] * 5
        //         if (myTeamPoint > 109) return this.seasonPoints.points[crystalLevel] * 5
        //         if (myTeamPoint > 39) return this.seasonPoints.points[crystalLevel] * 0.8 * 5
        //         if (40 > myTeamPoint) return this.seasonPoints.points[crystalLevel] * 0.6 * 5
        //     } else {
        //         if(crystalLevel === 1) return 0
        //         if (ennemyPoint > 109) return 0
        //         if (ennemyPoint > 39) return this.seasonPoints.points[crystalLevel] * 0.2 * 5
        //         if (40 > ennemyPoint) return this.seasonPoints.points[crystalLevel] * 0.4 * 5
        //     }
        // },
        team1Results: function (battle) {
            return battle.players.filter( p => p.Team === "ATTACKER")
        },
        team2Results: function (battle) {
            return battle.players.filter( p => p.Team === "DEFENDER")
        },
        imageWeaponUri (weaponType) {
            return `https://render.albiononline.com/v1/item/${weaponType}` // https://gameinfo.albiononline.com/api/gameinfo/items/
        },
        setPlayersData (player, e) {
            // console.log(e)
            return {...player, 
                    MainHand : e.MainHand && e.MainHand, 
                    Armor : e.Armor && e.Armor, 
                    GuildName : e.GuildName && e.GuildName, 
                    Itempower : e.Itempower && parseInt(e.Itempower,10), 
                    OffHand: e.OffHand && e.OffHand, 
                    Head : e.Head && e.Head, 
                    Shoes : e.Shoes && e.Shoes, 
                    Cape : e.Cape && e.Cape, 
                    Potion : e.Potion && e.Potion
            } //, KillFame : player.KillFame ? e.Killer.KillFame + player.KillFame : e.Killer.KillFame    
        },
        getAssistance(participants, name) {
            let count = 0;
            participants.forEach(p => (p.Name === name && count++));
            return count;
        },
    },
    computed: {
        
    },
    mounted () {
        console.log('hello')
        setTimeout( () => {

            this.data && this.data.forEach( battle => {
                battle.events.forEach( e => {
                    //"GuildName":"Black 0rder","GuildId":"noSyqo_MT72CrfPgQedI1A","AllianceName":"","AllianceId":"","AllianceTag":"","KillFame":42357,"Itempower":1441.53333,"MainHand":"T8_2H_DUALSICKLE_UNDEAD@3?quality=2","OffHand":null,"Head":"T8_HEAD_LEATHER_MORGANA@3?quality=2","Armor":"T8_ARMOR_LEATHER_MORGANA@3?quality=2","Shoes":"T8_SHOES_CLOTH_SET2@3?quality=1","Cape":"T5_CAPEITEM_FW_LYMHURST@3?quality=undefined","Potion":"T7_POTION_STONESKIN@1"}
                    battle.players = battle.players.map( player => {
                        if (player.id === e.Killer.Id) return this.setPlayersData(player, e.Killer)
                        if (player.id === e.Victim.Id) return this.setPlayersData(player, e.Victim)
                        // console.log(e.Participants)
                        // e.Participants.forEach( p => {
                        //     console.log (p)
                        //     if (player.id === p.Id) return this.setPlayersData(player, p)
                        // })
                        return {...player}
                    }) 
                    // battle.players = battle.players.map( player => {
                    //     player.Assistance = this.getAssistance()
                    // })
                    e.Participants.forEach( p => {
                        console.log('participants', p)
                        let playerId = battle.players.findIndex( player => player.Name === p.Name)
                        battle.players[playerId].Assistance = battle.players[playerId].Assistance ? battle.players[playerId].Assistance + 1 : 1
                        battle.players[playerId].MainHand = battle.players[playerId].MainHand ? battle.players[playerId].MainHand : p.MainHand
                        battle.players[playerId].Itempower = battle.players[playerId].Itempower ? battle.players[playerId].Itempower : parseInt(p.Itempower,10)
                        console.log(battle.players.findIndex( player => player.Name === p.Name))
                    })
                })
            })
        }, 500);


    },
    watch: {

    }
}
</script>

<style scoped>
.players a:hover {
    color: #FF6933!important;
}
.result.win {
    color:green;
    font-weight : bold;
}
.result.lose {
    color:red;
    font-weight : bold;

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
