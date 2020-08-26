<template>
<div class="killboard">
  <div v-if="totalPlayer > 1" class="before_basic_load">
    <!-- POUR CACHER LE PREMIER CHARGEMENT -->
  
    <div class="uk-container-xlarge uk-margin-auto" style="position:relative;">
      <div class="uk-margin" style="text-align: right;">
      <button class="uk-button uk-button-primary" v-if="headerView !== 'handholdReview' && headerView !== 'handholdTable'" @click="headerView = 'handholdReview'" >HANDHOLD MODE</button>
      <button class="uk-button uk-button-primary" v-if="headerView === 'handholdTable'" @click="headerView = 'handholdReview'" >EDIT HANDHOLD MODE</button>
      <button class="uk-button uk-button-primary" style="margin-left: 20px; " v-if="headerView !== 'allianceTable'" @click="headerView = 'allianceTable'">GLOBAL STATS</button>
    </div>
      <Handhold v-show="headerView === 'handholdReview'" :alliances="battle.sortedTopTableAlliances" v-on:changeHeaderView="changeHeaderViewToHandHoldTable" :bestAlliance="bestAlliance">
      </Handhold>

      <HandholdTable v-if="headerView === 'handholdTable'" :handhold="handhold" :winnerHandhold="handhold.winner" :loserHandhold="handhold.loser" :othersHandhold="handhold.others">
      </HandholdTable>
      
    <div style="text-align:center" v-if="headerView === 'allianceTable'">
      <h1 style="color:white;"><span style="color:rgb(25, 96, 12)">{{versus[0]}}</span> <span style="color:#666">vs</span> <span style="color:rgb(109, 40, 13)">{{versus[1]}} </span> 
      <span v-if="versus.length > 2"> <span style="color:#666"> vs</span> {{versus[2]}}</span></h1>
      <span style="color:#f1f1f1">{{battle.KillArea.replace(/_/g, " ")}} | {{readableDate(battle.startTime)}}</span>
    </div>
      
        <table v-if="headerView === 'allianceTable'" class="uk-table stat_battle uk-container-small uk-margin-auto" style="margin-bottom:0px;bottom: 12px;position: relative;box-shadow: 0px 0px 4px 0px rgba(235,235,235,1);">

            <thead>
                <th style="font-weight: bold;">ALLIANCE</th>
                <th @click="allianceOrderBy(battle.sortedTopTableAlliances, 'players', 'desc', 'sortedTopTableAlliances')" style="cursor:pointer;font-weight: bold;">PLAYERS
                    <span v-if="currentTopTableSort === 'players' && currentTopTableSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'players' && currentTopTableSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
                <th @click="allianceOrderBy(battle.sortedTopTableAlliances, 'kills', 'desc', 'sortedTopTableAlliances')" style="cursor:pointer;font-weight: bold;">KILLS
                    <span v-if="currentTopTableSort === 'kills' && currentTopTableSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'kills' && currentTopTableSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
                <th @click="allianceOrderBy(battle.sortedTopTableAlliances, 'deaths', 'desc', 'sortedTopTableAlliances')" style="cursor:pointer;font-weight: bold;">DEATHS
                    <span v-if="currentTopTableSort === 'deaths' && currentTopTableSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'deaths' && currentTopTableSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
                <th @click="allianceOrderBy(battle.sortedTopTableAlliances, 'killFame', 'desc', 'sortedTopTableAlliances')" style="cursor:pointer;font-weight: bold;">KILLFAME
                    <span v-if="currentTopTableSort === 'killFame' && currentTopTableSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'killFame' && currentTopTableSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
                <th @click="allianceOrderBy(battle.sortedTopTableAlliances, 'itempower', 'desc', 'sortedTopTableAlliances')" style="cursor:pointer;font-weight: bold;">AVERAGE IP
                    <span v-if="currentTopTableSort === 'itempower' && currentTopTableSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'itempower' && currentTopTableSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
            </thead>
            <tbody>
                <tr class="global_battle">
                    <td></td>
                    <td>{{ totalPlayer }}</td>
                    <td>{{ battle.totalKills }}</td>
                    <td></td>
                    <td>{{ formatNumber(battle.totalFame) }}</td>
                    <td></td>
                </tr>

                <tr class="global" v-for="(alliance, index) in battle.sortedTopTableAlliances" :key="index" :class=" alliance.id === bestAlliance ? 'win' : alliance.id === loserAlliance ? 'lose' : ''">
                    <td v-if="battleTableMax > index">{{ alliance.name }}</td>
                    <td v-if="battleTableMax > index" :uk-tooltip="(alliance.players.length *100 / totalPlayer).toFixed(1) +' % players'">{{ alliance.players.length }}</td>
                    <td v-if="battleTableMax > index" :uk-tooltip="(alliance.kills *100 / battle.totalKills).toFixed(1) +' % kills done'">{{ alliance.kills }}</td>
                    <td v-if="battleTableMax > index">{{ alliance.deaths }}</td>
                    <td v-if="battleTableMax > index" :uk-tooltip="(alliance.killFame *100 / battle.totalFame).toFixed(1) +' % killfame'">{{ formatNumber(alliance.killFame) }}</td>
                    <td v-if="showStats && alliance.itempower && battleTableMax > index">{{alliance.itempower.toFixed(0)}}</td>
                    <td v-else></td>
                </tr>
            </tbody>
        </table>
        <div class="loadmore">
            <p v-if="battleTableMax < 9" @click="battleTableMax = 30">LOAD MORE <span uk-icon="chevron-down"></span></p>
            <p v-if="battleTableMax > 9" @click="battleTableMax = 8">SHOW LESS<span uk-icon="chevron-up"></span></p>
        </div>

        <!-- PLAYER SEARCH -->
        <!-- <div class="uk-margin">
            <form class="uk-search uk-search-default" v-on:submit.prevent>
                <span uk-search-icon></span>
                <input class="uk-search-input" type="search" v-model="searchPlayerName" placeholder="Highlight player">
            </form>
            <a v-if="searchPlayerName" :href="searchPlayerAnchor" class="uk-button uk-button-primary"> GO</a>
            <button v-else class="uk-button uk-button-primary" disabled> GO</button>
        </div> -->

        <RequestFailed v-if="error404" :killboardID="battle.id">
        </RequestFailed>

        <KillboardOrderBy style="text-align: center;" :showStats="showStats" :columnClass="columnClass" @clicked="onClickOrderBy" @changecolumn="onChangeColumn">
        </KillboardOrderBy>

    </div>
  </div>
  <div v-else class="uk-margin-auto" style="text-align:center;"> <!--  -->
      <h1 style="color:white;">Loading initial statistics</h1>
      <span uk-spinner="ratio: 3"></span>
  </div>
  
    <ul uk-grid="masonry: true"  :uk-accordion="` multiple: true ${isCollapse}`" class="uk-grid-collapse killboard_guilds">
        <li style="padding-right:20px; margin: 0 0.5%;" class="uk-open uk-card uk-card-default uk-margin-small-bottom" :class="NbColumn()"
          v-for="(alliance, indexa) in battle.sortedalliances" :key="indexa">
            <a class="uk-accordion-title guild_header" href="#">
              <h3 class="alliance_table_header" style="color:#dddddd">{{ alliance.name }}</h3>

            <table class="uk-table" style="margin-bottom:0px;bottom: 12px;position: relative;">
            <thead>
              <th>GUILDS</th>
              <th>PLAYERS</th>
              <th>KDA</th>
              <th>KILLFAME</th>
              <th>DEATHFAME</th>
              <th>AVERAGE IP</th>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span v-for="(guild, indexg) in alliance.guilds" :key="indexg">
                    {{guild}} <br />
                  </span>
                </td>
                <td> {{ alliance.players.length }} </td>
                <td>{{ alliance.kills }} / {{ alliance.deaths }}</td>
                <td>{{ formatNumber(alliance.killFame) }}</td>
                <td> {{formatNumber(sumArray(allianceTotalDeathfame(alliance)))}}</td>
                <td v-if="showStats && alliance.listItemPower.length">{{(sumArray(alliance.listItemPower) / alliance.listItemPower.length).toFixed(0)}}</td>
              </tr>
            </tbody>
          </table>
            
            </a>
            <div class="uk-accordion-content">
            <table class="uk-table uk-table-divider uk-table-striped" style="position:relative;margin:10px">
              <thead>
                <tr>
                    <td></td> <!-- Badge -->
                    <td>Guild</td>
                    <td></td>
                    <td>Name</td>
                    <td>Kills</td>
                    <td>Deaths</td>
                    <td>Assist</td>
                    <td v-if="showHeal" uk-tooltip="Heal applied on assistance, consider it as offensive healing">Heal*</td>
                    <td> Item Power </td>
                    <td> Kill Fame </td>
                    <td uk-tooltip="Total death fame / Link on first death" v-if="showDeathFame"> Death Fame* </td>
                </tr>
              </thead>
            <tbody>
              <KillboardPlayersList
                v-for="player in alliance.sortedPlayers"
                :key="player.id"
                :showStats="showStats"
                :showHeal="showHeal"
                :showDeathFame="showDeathFame"
                :searchPlayerName="searchPlayerName"
                :bestPlayerKillfame="bestPlayerKillfame"
                :bestPlayerKill="bestPlayerKill"
                :bestPlayerAssistance="bestPlayerAssistance"
                :bestPlayerIP="bestPlayerIP"
                :player="player">
              </KillboardPlayersList>

                  </tbody>
                </table>
            </div>
        </li>
    </ul>
    <a href="#" uk-totop uk-scroll></a>
</div>
</template>

<script>
import axios from 'axios'
import RequestFailed from "@/components/RequestFailed"
import KillboardOrderBy from "@/components/KillboardOrderBy"
import KillboardPlayersList from "@/components/KillboardPlayersList"
import Handhold from "@/components/Handhold"
import HandholdTable from "@/components/HandholdTable"

export default {
  name: 'Battle',
  data: function () {
    return {
      battleTableMax: 8,
      battle: [],
      versus: [],
      totalPlayer: 0,
      bestPlayerKillfame: { id: '', killfame: 0 },
      bestPlayerKill: { id: '', kill: 0 },
      bestPlayerAssistance: { id: '', assistance: 0 },
      bestPlayerIP: { id: '', itempower: 0 },
      bestAlliance: null,
      loserAlliance: null,
      showStats: false,
      showDeathFame: false,
      columnClass: false,
      isCollapse: false,
      searchPlayerName: null,
      error404: false,
      currentTopTableSort: '',
      currentTopTableSortDir: 'desc',
      headerView : 'allianceTable',
      handhold : {
        winner : [],
        loser : [],
        others : []

      }
    }
  },
  components: {
    RequestFailed,
    KillboardOrderBy,
    KillboardPlayersList,
    Handhold,
    HandholdTable,
  },
  computed: {
    searchPlayerAnchor : function () {
      if (this.searchPlayerName) {
        return `#${this.searchPlayerName}`
      }
    },
    fullEventDeath : function () {
      return this.battle.fullEventDeath
    },
  },
  methods: {
    changeHeaderViewToHandHoldTable (winnerHandhold, loserHandhold, othersHandhold, side1, side2, side3) {
      this.headerView = 'handholdTable'
      this.handhold.winner = this.battle.sortedTopTableAlliances.filter( alliance => winnerHandhold.includes(alliance.id))
      this.handhold.loser = this.battle.sortedTopTableAlliances.filter( alliance => loserHandhold.includes(alliance.id))
      this.handhold.others = this.battle.sortedTopTableAlliances.filter( alliance => othersHandhold.includes(alliance.id))
      this.handhold.side1 = side1
      this.handhold.side2 = side2
      this.handhold.side3 = side3
      //add names
    },
    async fetchData () {
      try {
          return await axios.get(`https://handholdreport.com/api/killboard/${this.$route.params.id}`) //https://handholdreport.com/api
      } catch {
          this.error404 = true
      }
    },
    sumArray (array) {
      return array.reduce((accumulator, item) => accumulator + item, 0)
    },
    formatNumber (num) {
      return ("" + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "." });
    },
    onClickOrderBy (currentSortName, currentSortDir) {
      this.showDeathFame = currentSortName === 'deathFame' ? true : false
      this.showHeal = currentSortName === 'assistance' ? true : false

      for (const alliance in this.battle.alliances) {
          this.battle.alliances[alliance].sortedPlayers = this.battle.alliances[alliance].players.sort((a, b) => {
              let modifier = 1
              if (currentSortDir === 'desc') {
                  modifier = -1
              }
              if (a[currentSortName] < b[currentSortName]) return -1 * modifier
              if (a[currentSortName] > b[currentSortName]) return 1 * modifier
              return 0
          })
      } 
    },
    allianceOrderBy (alliance, currentSortName, currentSortDir, allianceChanged) {
        alliance.sort((a, b) => {
            let modifier = 1
            if (currentSortDir === 'desc') {
                modifier = -1
            }
            if (a[currentSortName] < b[currentSortName]) return -1 * modifier
            if (a[currentSortName] > b[currentSortName]) return 1 * modifier
            return 0
        })
          this.currentTopTableSortDir = currentSortDir
          this.currentTopTableSort = currentSortName
    } ,
    onChangeColumn () {
      this.columnClass = !this.columnClass
      this.isCollapse = this.isCollapse ? '' : 'collapsible'
    },
    NbColumn () {
      return this.columnClass ? "uk-width-2-5@m uk-width-1-2@s uk-margin-auto twocolumn" : "uk-width-1-3@l uk-width-2-5@m uk-width-1-2@s"
    },
    readableDate: function (date) {
      return `${date.slice(0, 10)} ${date.slice(11, 19)}`
    },
    allianceTotalDeathfame (alliance) {
      return alliance.players.map( player => player.deathFame);
    },
    treatmentPlayerEventDeath () {       
      // CLEAN PLAYERS IN ALLIANCES TO UPDATED THEM WITH NEW STATS (IP, WEAPON ...)
      for (const alliance in this.battle.alliances) {
        this.battle.alliances[alliance].players = [] //HERE
      }
      for (const playerID in this.battle.players) {
        if (this.battle.players[playerID].allianceId) {
          const playerAlliance = this.battle.players[playerID].allianceId
          this.battle.alliances[playerAlliance].players.push(this.battle.players[playerID]) //HERE
          if (this.battle.players[playerID].itempower) {
            this.battle.alliances[playerAlliance].listItemPower.push(parseInt(this.battle.players[playerID].itempower)) // HERE
          }
        }
        // --- BEST ASSITANCE MEDAL
        if (this.battle.players[playerID].assistance > this.bestPlayerAssistance.assistance) {
          this.bestPlayerAssistance.assistance = this.battle.players[playerID].assistance
          this.bestPlayerAssistance.id = this.battle.players[playerID].id
        } 
        // --- BEST IP MEDAL
        if (this.battle.players[playerID].itempower > 999) {
          if (this.battle.players[playerID].itempower > this.bestPlayerIP.itempower) {
            this.bestPlayerIP.itempower = this.battle.players[playerID].itempower
            this.bestPlayerIP.id = this.battle.players[playerID].id
          } 
        }
        
      }
      // --- TO BE ABLE TO ORDER BY ON TOP TABLE PER IP (moved from template)
      this.battle.sortedTopTableAlliances.forEach( alliance => {
        alliance.itempower = alliance.listItemPower && alliance.listItemPower.length ? alliance.listItemPower.reduce((a, b) => (a + b)) / alliance.listItemPower.length : ''
      })
      this.showStats = true
    },

  },
  mounted () {
    this.fetchData()
      .then(res => {
        this.battle = res.data // EVENT NOT USEFULL
        this.totalPlayer = Object.keys(this.battle.players).length

        for (const player in this.battle.players) {
          // --- BEST KILLFAME MEDAL
          if (this.battle.players[player].killFame > this.bestPlayerKillfame.killfame) {
            this.bestPlayerKillfame.killfame = this.battle.players[player].killFame
            this.bestPlayerKillfame.id = this.battle.players[player].id
          } // --- BEST KILL MEDAL
          if (this.battle.players[player].kills > this.bestPlayerKill.kill) {
            this.bestPlayerKill.kill = this.battle.players[player].kills
            this.bestPlayerKill.id = this.battle.players[player].id
          }
        }
        for (const playerID in this.battle.players) {
          if (this.battle.players[playerID].allianceId) {
            const playerAllianceId = this.battle.players[playerID].allianceId
            this.battle.alliances[playerAllianceId].players.push(this.battle.players[playerID]) // HERE
            //let player = this.battle.alliances.find( alliance => alliance.id = playerAllianceId)
          }
        }
        // -----------------------INIT SORTED ALLIANCES
        this.battle.sortedalliances = []
        this.battle.sortedTopTableAlliances = []
        for (const alliance in this.battle.alliances) {
          // INIT SORTED ALLIANCE LIST TO ORDER
          this.battle.sortedalliances.push(this.battle.alliances[alliance])
          this.battle.sortedTopTableAlliances.push(this.battle.alliances[alliance])
        }
        // LAUNCH ALLIANCES ORDER BY KILLFAME
        this.allianceOrderBy(this.battle.sortedalliances, 'players', 'desc', 'sortedalliances')
        this.allianceOrderBy(this.battle.sortedTopTableAlliances, 'killFame', 'desc', 'sortedTopTableAlliances')
        this.bestAlliance = this.battle.sortedTopTableAlliances[0].id
        this.loserAlliance = this.battle.sortedTopTableAlliances[1].id

        
        this.onClickOrderBy('killFame', 'desc')
        this.versus.push(this.battle.sortedTopTableAlliances[0].name, this.battle.sortedTopTableAlliances[1].name)
        if (this.battle.sortedTopTableAlliances.length > 2) this.versus.push(this.battle.sortedTopTableAlliances[2].name)
        this.treatmentPlayerEventDeath()
        this.battle.sortedTopTableAlliances.forEach( alliance => {
        alliance.itempower = alliance.listItemPower && alliance.listItemPower.length ? alliance.listItemPower.reduce((a, b) => (a + b)) / alliance.listItemPower.length : ''
      })
      })
      
  },
}
</script>

<style scoped>
@import './../assets/css/killboard.css';
</style>
