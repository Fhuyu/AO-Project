<template>
    <div class="battleboard" uk-grid>
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
                        <select class="uk-select playerFilter" v-model="minBattlePlayers">
                        <option value="20">20 + players</option>
                        <option value="50">50 + players</option>
                        <option value="100">100 + players</option>
                        </select>
                    </form>
                </div>
            </div>
        </div>
        <div v-if="attendance" class="uk-width-3-5 uk-margin-auto">
            <h3>{{attendance.battles.length}} battle found</h3>
            <table class="uk-table" style="margin-bottom:0px;bottom: 12px;position: relative;">
                <thead>
                    <th>PLAYER NAME</th>
                    <th>KILLS</th>
                    <th>DEATHS</th>
                    <th>KILLFAME</th>
                    <th>ATTENDANCE</th>
                    <!-- <th>LOSING GUILD</th> -->
                    <th></th>
                </thead>
                <tr class="attendance_data" v-for="(item, index) in attendance.players" :key="index">
                    <td>{{ item.name }}</td>
                    <td>{{ item.kills }}</td>
                    <td>{{ item.deaths}}</td>
                    <td>{{ item.killFame}}</td>
                    <td>{{ item.attendance}}</td>
                </tr>
            </table>
                <!-- {{ item.battleEndDate + item.battleTotalPlayers + item.battleData[0].players}} -->
                <table class="uk-table uk-width-3-5 uk-margin-auto" style="margin-bottom:0px;bottom: 12px;position: relative;">
                <thead>
                    <th>ID</th>
                    <th></th>
                </thead>
                <tr class="attendance_data" v-for="(item, index) in attendance.battles" :key="index">
                    <td><a :href="`https://handholdreport.com/killboard/${item.battleData[0].id}`">{{ item.battleData[0].id }}</a></td>
                </tr>
            </table>
        </div>
        <!-- <div v-if="!attendance" uk-spinner="ratio: 3"></div> -->
    </div>
</template>

<script>
import axios from 'axios'

/*   */

export default {
    name: 'Attendance',
    data: function () {
        return {
            minBattlePlayers: 20,
            searchGuildName: null,
            searchType :'guild',
            error404 : false,
            attendance : null,
        }
    },
    components: {
    },
    methods: {
        launchGuildBattleSearch: function () {
            this.fetchData()
            .then(res => {
                console.log('received', res)
                this.attendance = res.data
            })
        },
        async fetchData () {
            let response = null
            if (this.searchGuildName) {
                response = await axios.get(`https://handholdreport.com/api/attendance/${this.searchGuildName}`, //https://handholdreport.com/api/
                // response = await axios.get(`http://localhost:5000/battles/${this.currentOffset}/${this.searchGuildName}`
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
    },
    computed: {
    },
    mounted () {
    },
    watch: {

    }
}
// DANS LE TABLEAU DES GUILDES, POUR CHAQUE GUILDES (TABLEAU) AVOIR TOUS SES JOUEURS (OBJ)
</script>

<style scoped>
@import './../assets/css/battleboard.css';
.attendance_data td {
    padding: 5px 12px;
}
</style>
