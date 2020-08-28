<template>
    <div class="attendance" uk-grid>
        <div class="uk-width-4-5@m uk-margin-auto" style="z-index:1;">
            <div class="uk-child-width-1-2 uk-text-center uk-margin" uk-grid>
                <div class="form_global_search">
                    <form class="form_search" @submit.prevent="launchGuildBattleSearch()"> <!-- @submit.prevent="launchGuildSearch(searchGuildName)" -->
                        <div class="select_div" uk-form-custom="target: > * > span:first-child">
                            <select v-model="searchType" class="uk-select">
                                <option value="guild">Guild</option>
                            </select>
                            <button class="" type="button" tabindex="-1">
                                <span></span>
                                <span uk-icon="icon: chevron-down"></span>
                            </button>
                        </div>
                        <input class="" v-model="searchGuildName"  placeholder="Guild Name">
                        <span class="icon right" @click="launchGuildBattleSearch()" uk-icon="icon: search; ratio: 1.5"></span> <!-- @click="launchGuildSearch(searchGuildName)" -->
                    </form>
                </div>
                <div>
                    <form class="uk-form-horizontal">
                        <select class="uk-select playerFilter" v-model="minBattlePlayers" style="min-width: 250px;">
                        <option value="10">10 + players from your guild</option>
                        <option value="20">20 + players from your guild</option>
                        <option value="30">30 + players from your guild</option>
                        <option value="50">50 + players from your guild</option>
                        <option value="80">80 + players from your guild</option>
                        <option value="100">100 + players from your guild</option>
                        </select>
                    </form>
                </div>
            </div>
        </div>
        <div v-if="attendance" class="uk-width-3-5 uk-margin-auto">
            <div v-if="loading" style="text-align:center;">
                <span uk-spinner="ratio: 3"></span>
            </div>
            <h3 style="text-align:center;">Total battles this week : {{attendance.battles.length}}</h3>
            <table class="uk-table" style="margin-bottom:0px;bottom: 12px;position: relative;">
                <thead>
                    <th></th>
                    <th @click.prevent="onClickOrderBy('name', 'desc')">PLAYER NAME
                        <span v-if="currentSort === 'name' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
                        <span v-if="currentSort === 'name' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
                    </th>
                    <th>MAIN WEAPON</th>
                    <th @click.prevent="onClickOrderBy('kills', 'desc')">KILLS
                        <span v-if="currentSort === 'kills' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
                        <span v-if="currentSort === 'kills' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
                    </th>
                        
                    <th @click.prevent="onClickOrderBy('deaths', 'desc')">DEATHS
                        <span v-if="currentSort === 'deaths' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
                        <span v-if="currentSort === 'deaths' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
                    </th>
                    <th @click.prevent="onClickOrderBy('assistance', 'desc')">ASSISTANCE
                        <span v-if="currentSort === 'assistance' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
                        <span v-if="currentSort === 'assistance' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
                    </th>
                    <th @click.prevent="onClickOrderBy('itempower', 'desc')">AVG IP
                        <span v-if="currentSort === 'itempower' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
                        <span v-if="currentSort === 'itempower' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
                    </th>
                    <th @click.prevent="onClickOrderBy('killFame', 'desc')">KILLFAME
                        <span v-if="currentSort === 'killFame' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
                        <span v-if="currentSort === 'killFame' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
                    </th>
                    <th @click.prevent="onClickOrderBy('attendance', 'desc')">ATTENDANCE
                        <span v-if="currentSort === 'attendance' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
                        <span v-if="currentSort === 'attendance' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
                    </th>
                </thead>
                <tr class="attendance_data" :class="highlight(item)" v-for="(item, index) in attendance.players" :key="index">
                    <td style="max-width: 80px;position: absolute;left: -70px;">
                        <span v-if="item.name === bestPlayerKillfame.name" class="uk-label uk-label-warning">KILLFAME</span>
                        <span v-if="item.name === bestPlayerKill.name" class="uk-label uk-label-danger">KILLS</span>
                        <span v-if="item.name === bestPlayerAssistance.name" class="uk-label uk-label-success">ASSIST</span>
                        <!-- <span v-if="item.name === bestPlayerIP.name" class="uk-label bestIp">IP</span> -->
                    </td>
                    <td>{{ item.name }}</td>
                    <td>
                        <img :uk-tooltip="weaponTooltip(item.weapon)" style="height:35px" :src="imageWeaponUri(item.weapon)">
                    </td>
                    <td>{{ item.kills }}</td>
                    <td>{{ item.deaths}}</td>
                    <td>{{ item.assistance}}</td>
                    <!-- <td>{{item.itempower}}</td> -->
                    <td v-if="item.itempower.length">{{ (item.itempower.reduce((accumulator, currentValue) => accumulator + currentValue) / item.itempower.length).toFixed(0)}}</td>
                    <td v-else></td>
                    <td>{{ formatNumber(item.killFame)}}</td>
                    <td>{{ item.attendance}}</td>
                </tr>
            </table>
                <h3 style="text-align:center;">Battles found</h3>

                <table class="uk-table uk-width-3-5 uk-margin-auto" style="margin-bottom:0px;bottom: 12px;position: relative;">
                <thead>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL PLAYERS</th>
                    <th></th>
                </thead>
                <tr class="attendance_data" v-for="(item, index) in attendance.battles" :key="index">
                    <td><a :href="`https://handholdreport.com/#/killboard/${item.battleData[0].id}`">{{ item.battleData[0].id }}</a></td>
                    <td>{{readableDate(item.battleData[0].startTime)}}</td>
                    <td>{{item.battleTotalPlayers}}</td>
                    <td style="padding: 0; text-align: right;">
                        <a :href="`https://handholdreport.com/#/killboard/${item.battleData[0].id}`" target="_blank">
                            <button class="uk-button uk-button-primary" style=" background:#FF7A4D;">
                                <span class="icon right" uk-icon="icon: search; ratio: 1.5"></span>
                            </button>
                        </a>
                    </td>
                </tr>
            </table>
        </div>
        <div v-else class="uk-width-3-5 uk-margin-auto informations">
            <div v-if="loading" style="text-align:center;">
                <span uk-spinner="ratio: 3"></span>
            </div>
            <p>
                <h3>Informations - V.1.0 - Zerg attendance</h3>
                It allows you to :<br/>
                <ul class="uk-list uk-list-hyphen">
                    <li>
                        Search your battles with your guild minimum player.<br/>
                        Why ? If one goes to rat a zerg, it will not count as an attendance, because your zerg is not at least 20 members.
                    </li>
                    <li>
                        Check attendance on 1 week. <br/>
                        If you ask the attendance September 7, it shows you from September 1 to September 7. <br/>
                        You'd like it to be from Monday to match with the server stat reset ? Join HandHoldReport discord and we'll discuss!
                    </li>
                    <li>
                        If a member is cluster queued, and he never joined the battle, his attendance won't count.
                    </li>
                    <li>
                        It doesn't show a member if he never joined a battle.
                    </li>
                </ul>
            </p>
        </div>

    </div>
</template>

<script>
import axios from 'axios'
import store from '../components/store.js'


export default {
    name: 'Attendance',
    data: function () {
        return {
            minBattlePlayers: 20,
            searchGuildName: null,
            searchType :'guild',
            error404 : false,
            attendance : null,
            currentSort: 'attendance',
            currentSortDir: 'desc',
            loading : false,

            bestPlayerKillfame: { name: '', killfame: 0 },
            bestPlayerKill: { name: '', kill: 0 },
            bestPlayerAssistance: { name: '', assistance: 0 },
            bestPlayerIP: { name: '', itempower: 0 },
        }
    },
    components: {
    },
    methods: {
        readableDate: function (date) {
            return `${date.slice(0, 10)} ${date.slice(11, 19)}`
        },
        formatNumber (num) {
            return ("" + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "." });
        },
        highlight (player) {
            if (player.name === this.bestPlayerKillfame.name) return "bestKillfame"
            if (player.name === this.bestPlayerKill.name) return "bestKill"
            if (player.name === this.bestPlayerAssistance.name) return "bestAssistance"
            // if (player.name === this.bestPlayerIP.name) return "bestIp"
        },
        launchGuildBattleSearch: function () {
            this.loading = true
            this.fetchData()
            .then(res => {
                this.attendance = res.data
                this.onClickOrderBy('attendance', 'desc')
                this.loading = false
                
                this.attendance.players.forEach( player => {
                    if (player.killFame > this.bestPlayerKillfame.killfame) {
                        this.bestPlayerKillfame.killfame = player.killFame
                        this.bestPlayerKillfame.name = player.name
                    }
                    if (player.kills > this.bestPlayerKill.kill) {
                        this.bestPlayerKill.kill = player.kills
                        this.bestPlayerKill.name = player.name
                    }
                    if (player.assistance > this.bestPlayerAssistance.assistance) {
                        this.bestPlayerAssistance.assistance = player.assistance
                        this.bestPlayerAssistance.name = player.name
                    }

                    let mainWeapon = {}
                    player.weapon.forEach( weapon => {
                        let currentWeapon = weapon.split(/_(.+)/)[1].split('@')[0].split('?')[0]
                        // console.log(weapon.split(/_(.+)/)[1].split('@')[0].split('?')[0])
                        mainWeapon[currentWeapon] = mainWeapon[currentWeapon] ? mainWeapon[currentWeapon] + 1 : 1
                    })
                    player.weapon = Object.keys(mainWeapon).reduce((a, b) => mainWeapon[a] > mainWeapon[b] ? a : b);
                })
            })
        },
        async fetchData () {
            let response = null
            if (this.searchGuildName) {
                response = await axios.get(`https://handholdreport.com/api/attendance/${this.searchGuildName}`, //https://handholdreport.com/api/
                // response = await axios.get(`http://localhost:5000/attendance/${this.searchGuildName}`,
                    { params: {
                        minBattlePlayers : this.minBattlePlayers,
                        searchType : this.searchType,
                        page : 'attendance',
                        }
                    }
                ) 
                .catch((error) => {
                    this.error404 = true
                });
            }
            return response
        },
        onClickOrderBy (currentSortName, currentSortDir) {

            // if (currentSortName === this.currentSort) {
            //     this.currentSortDir = this.currentSortDir === 'desc' ? 'asc' : 'desc'
            // }

            this.attendance.players = this.attendance.players.sort((a, b) => {
                let modifier = 1
                if (currentSortDir === 'desc') {
                    modifier = -1
                }
                if (a[currentSortName] < b[currentSortName]) return -1 * modifier
                if (a[currentSortName] > b[currentSortName]) return 1 * modifier
                return 0
            })
            this.currentSort = currentSortName

            // for (const alliance in this.battle.alliances) {
            //     this.battle.alliances[alliance].sortedPlayers = this.battle.alliances[alliance].players.sort((a, b) => {
            //         let modifier = 1
            //         if (currentSortDir === 'desc') {
            //             modifier = -1
            //         }
            //         if (a[currentSortName] < b[currentSortName]) return -1 * modifier
            //         if (a[currentSortName] > b[currentSortName]) return 1 * modifier
            //         return 0
            //     })
            // } 
        },
        weaponTooltip (weapon) {
            // FROM "T4_2H_TWINSCYTHE_HELL@2?quality=3" TO T4.2 2H WINSCYTHE HELL OUTSTANDING
            const regex = '^[^?]+'
            const quality = '[^=]*$'
            return `${store.quality[weapon.match(quality)[0]]} ${weapon.match(regex)[0]}`
        },
        imageWeaponUri (weapon) {
            return `https://render.albiononline.com/v1/item/T8_${weapon}` // https://gameinfo.albiononline.com/api/gameinfo/items/
        },
    },
    computed: {
    },
    mounted () {
    },
    watch: {
        minBattlePlayers () {
            this.launchGuildBattleSearch()
        }

    }
}
// DANS LE TABLEAU DES GUILDES, POUR CHAQUE GUILDES (TABLEAU) AVOIR TOUS SES JOUEURS (OBJ)
</script>

<style scoped>
@import './../assets/css/battleboard.css';
.attendance .informations {
    color: #f2f2f2;
}
.attendance .informations li {
    background: none;
}
.attendance_data td {
    padding: 5px 12px;
}
.night .attendance {
    background: #05081c;
}
.night .attendance table {
    background: #24212f;
}
.attendance_data:nth-of-type(odd) {
    background: #f2f2f2;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
}
.night .attendance_data:nth-of-type(odd) {
    background: #3c3d44;
    border-top: 1px solid #969696;
    border-bottom: 1px solid #969696;
}
/* ---- HIGHTLIGHTS --- */
.night .bestKillfame {
    background: #af731f!important;
}
.bestKillfame {
    background: orange!important;
}
.night .bestKill {
    background: #af6679!important;
}
.bestKill {
    background: lightcoral!important;
}
.bestAssistance {
    background: #a6e0bd!important;
}
.night .bestAssistance {
    background: #72a084!important;
}
.bestIp {
    background: #fcc349!important;
}
.night .bestIp {
    background: #a57e29!important;
}

</style>
