<template>
    <div class="guild-top-table">
        <!-- GUILD TABLE -->
        <table class="uk-table stat_battle uk-container-small uk-margin-auto" style="position: relative;box-shadow: 0px 0px 2px 0px rgba(235,235,235,1);">
            <thead>
                <th style="font-weight: bold;">GUILD</th>
                <th @click="guildOrderBy( 'playersLength')" style="cursor:pointer;font-weight: bold;">PLAYERS
                    <span v-if="currentTopTableSort === 'players' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'players' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
                <th @click="guildOrderBy( 'kills')" style="cursor:pointer;font-weight: bold;">KILLS
                    <span v-if="currentTopTableSort === 'kills' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'kills' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
                <th @click="guildOrderBy( 'deaths')" style="cursor:pointer;font-weight: bold;">DEATHS
                    <span v-if="currentTopTableSort === 'deaths' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'deaths' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
                <th @click="guildOrderBy( 'killFame')" style="cursor:pointer;font-weight: bold;">KILLFAME
                    <span v-if="currentTopTableSort === 'killFame' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'killFame' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
                <th @click="guildOrderBy( 'itempower')" style="cursor:pointer;font-weight: bold;">AVERAGE IP
                    <span v-if="currentTopTableSort === 'itempower' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'itempower' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
            </thead>
            <tbody>
                <tr class="global_battle">
                    <td></td>
                    <td>{{ Object.keys(battle.players).length }}</td>
                    <td>{{ battle.totalKills }}</td>
                    <td></td>
                    <td>{{ formatNumber(battle.totalFame) }}</td>
                    <td></td>
                </tr>

                <tr class="global" v-for="(guild, index) in guildSorted" :key="index" :class=" guild.allianceId === bestAlliance ? 'win' : guild.allianceId === loserAlliance ? 'lose' : ''"> <!-- :class=" guild.id === winGuild ? 'win' : alliance.id === loseGuild ? 'lose' : ''" -->
                    <td v-if="battleTableMax > index"><span v-if="guild.alliance">[{{guild.alliance}}]</span> {{ guild.name }}</td>
                    <td v-if="battleTableMax > index">{{ guild.players.length }}</td>
                    <td v-if="battleTableMax > index" :uk-tooltip="(guild.kills *100 / battle.totalKills).toFixed(1) +' % kills done'">{{ guild.kills }}</td>
                    <td v-if="battleTableMax > index">{{ guild.deaths }}</td>
                    <td v-if="battleTableMax > index" :uk-tooltip="(guild.killFame *100 / battle.totalFame).toFixed(1) +' % killfame'">{{ formatNumber(guild.killFame) }}</td>
                    <td v-if="battleTableMax > index">{{guild.itempower}}</td>
                </tr>
            </tbody>
        </table>
        <div v-if="battleTableMax < 16 && guildSorted.length > 16" @click="battleTableMax = 100" style="text-align:center;">LOAD MORE <span uk-icon="chevron-down"></span></div>
        <div v-if="battleTableMax > 16" @click="battleTableMax = 15" style="text-align:center;">SHOW LESS<span uk-icon="chevron-up"></span></div>
        
    </div>
</template>

<script>
import axios from 'axios'

/*   */

export default {
    name: 'GuildTopTable',
    props: ['battle', 'bestAlliance', 'loserAlliance'],
    data: function () {
        return {
            battleTableMax: 15,
            guildSorted : [],

            currentSortDir : 'desc',
            currentTopTableSort : 'killFame',
        }
    },
    components: {
    },
    methods: {
        showGuildView () {
            //Object.values(this.battle.guilds).sort
        },
        formatNumber (num) {
            return ("" + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "." });
        },
        guildOrderBy (currentSortName) {
            this.guildSorted = this.guildSorted.sort((a, b) => {

                // if (currentSortName === this.currentTopTableSort) {
                //     console.log('yes')
                //     this.currentSortDir = this.currentSortDir === 'desc' ? 'asc' : 'desc'
                // }

                return this.currentSortDir === 'desc' ? b[currentSortName] - a[currentSortName] : a[currentSortName] - b[currentSortName]

                // let modifier = 1
                // if (currentSortDir === 'desc') {
                //     modifier = -1
                // }
                // if (a[currentSortName] < b[currentSortName]) return -1 * modifier
                // if (a[currentSortName] > b[currentSortName]) return 1 * modifier
                // return 0
            })
            this.currentTopTableSort = currentSortName
        } ,
    },
    computed: {
    },
    mounted () {
        this.guildSorted = Object.values(this.battle.guilds).sort( (a, b) => {
            return b.killFame - a.killFame
        })
        const players = Object.values(this.battle.players)
        this.guildSorted.forEach( guild => {
            guild.players = players.filter( player => player.guildId === guild.id)
            guild.playersLength = guild.players.length
            guild.itempower = guild.players.map(player => parseInt(player.itempower)).filter( ip => ip)
            guild.itempower = (guild.itempower.reduce((a, v) => a + v, 0)/guild.itempower.length).toFixed(0)
            guild.itempower = guild.itempower === "NaN" ? '' : guild.itempower
        })

    },
    watch: {

    }
}
</script>

<style scoped>
</style>
