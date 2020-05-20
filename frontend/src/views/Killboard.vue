<template>
<div class="killboard">
  <div v-if="totalPlayer > 1" class="before_basic_load">
    <!-- POUR CACHER LE PREMIER CHARGEMENT -->
    <div class="uk-container-xlarge uk-margin-auto">

        <h3 style="text-align:center;">BATTLE STATS</h3>
        <table class="uk-table stat_battle uk-container-small uk-margin-auto" style="margin-bottom:0px;bottom: 12px;position: relative;">

            <thead>
                <th>ALLIANCE</th>
                <th @click="allianceOrderBy(battle.sortedTopTableAlliances, 'players', 'desc', 'sortedTopTableAlliances')" style="cursor:pointer;">PLAYERS
                    <span v-if="currentTopTableSort === 'players' && currentTopTableSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'players' && currentTopTableSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
                <th @click="allianceOrderBy(battle.sortedTopTableAlliances, 'kills', 'desc', 'sortedTopTableAlliances')" style="cursor:pointer;">KILLS
                    <span v-if="currentTopTableSort === 'kills' && currentTopTableSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'kills' && currentTopTableSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
                <th @click="allianceOrderBy(battle.sortedTopTableAlliances, 'deaths', 'desc', 'sortedTopTableAlliances')" style="cursor:pointer;">DEATHS
                    <span v-if="currentTopTableSort === 'deaths' && currentTopTableSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'deaths' && currentTopTableSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
                <th @click="allianceOrderBy(battle.sortedTopTableAlliances, 'killFame', 'desc', 'sortedTopTableAlliances')" style="cursor:pointer;">KILLFAME
                    <span v-if="currentTopTableSort === 'killFame' && currentTopTableSortDir === 'desc'" uk-icon="arrow-up"></span>
                    <span v-if="currentTopTableSort === 'killFame' && currentTopTableSortDir === 'asc'" uk-icon="arrow-down"></span>
                </th>
                <th @click="allianceOrderBy(battle.sortedTopTableAlliances, 'itempower', 'desc', 'sortedTopTableAlliances')" style="cursor:pointer;">AVERAGE IP
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

                <tr class="global" v-for="(alliance, index) in battle.sortedTopTableAlliances" :key="index" :style=" alliance.id === bestAlliance ? 'background:#19600c;' : alliance.id === loserAlliance ? 'background:#6d280d;' : ''">
                    <td>{{ alliance.name }}</td>
                    <td :uk-tooltip="(alliance.players.length *100 / totalPlayer).toFixed(1) +' % players'">{{ alliance.players.length }}</td>
                    <td :uk-tooltip="(alliance.kills *100 / battle.totalKills).toFixed(1) +' % kills done'">{{ alliance.kills }}</td>
                    <td>{{ alliance.deaths }}</td>
                    <td :uk-tooltip="(alliance.killFame *100 / battle.totalFame).toFixed(1) +' % killfame'">{{ formatNumber(alliance.killFame) }}</td>
                    <td v-if="showStats && alliance.itempower">{{alliance.itempower.toFixed(0)}}</td>
                    <td v-else></td>
                </tr>
            </tbody>
        </table>

        <!-- PLAYER SEARCH -->
        <div class="uk-margin">
            <form class="uk-search uk-search-default" v-on:submit.prevent>
                <span uk-search-icon></span>
                <input class="uk-search-input" type="search" v-model="searchPlayerName" placeholder="Highlight player">
            </form>
            <a v-if="searchPlayerName" :href="searchPlayerAnchor" class="uk-button uk-button-primary"> GO</a>
            <button v-else class="uk-button uk-button-primary" disabled> GO</button>
        </div>

        <RequestFailed v-if="error404" :killboardID="battle.id">
        </RequestFailed>

        <KillboardOrderBy style="text-align: center;" :showStats="showStats" @clicked="onClickOrderBy" @changecolumn="onChangeColumn">
        </KillboardOrderBy>

        <div v-if="!showStats" class="uk-grid-collapse uk-child-width-expand@s uk-text-center uk-margin-large-top" uk-grid>
            <div>
                <div class="uk-padding"></div>
            </div>
            <div>
                <div class="uk-padding-small uk-light">
                    Loading more stats
                    <div class="loading_bar">
                        <div v-if="refreshStats.length" class="percent_bar" :style="'width:' + Object.keys(this.refreshStats).length *100 / this.battle.totalKills + '%;' ">
                        </div>
                    </div>
                </div>
                <span v-if="refreshStats.length">{{(Object.keys(this.refreshStats).length *100 / this.battle.totalKills).toFixed(1)}} %</span>
            </div>
            <div>
                <div class="uk-padding"></div>
            </div>
        </div>
    </div>
  </div>
  <div v-else class="uk-margin-auto" style="text-align:center;"> <!--  -->
      <h1 style="color:white;">Loading initial statistics</h1>
      <span uk-spinner="ratio: 3"></span>
  </div>

    <ul uk-grid="masonry: true"  :uk-accordion="` multiple: true ${isCollapse}`" class="uk-grid-collapse killboard_guilds">
        <li style="padding-right:20px" class="uk-open uk-card uk-card-default uk-margin-small-bottom" :class="NbColumn()"
          v-for="(alliance, indexa) in battle.sortedalliances" :key="indexa">
            <a class="uk-accordion-title guild_header" href="#">
            <table class="uk-table" style="margin-bottom:0px;bottom: 12px;position: relative;">
            <thead>
              <th>ALLIANCE</th>
              <th>GUILDS</th>
              <th>PLAYERS</th>
              <th>KDA</th>
              <th>KILLFAME</th>
              <th>AVERAGE IP</th>
            </thead>
            <tbody>
              <tr>
                <td>{{ alliance.name }}</td>
                <td>
                  <span v-for="(guild, indexg) in alliance.guilds" :key="indexg">
                    {{guild}} <br />
                  </span>
                </td>
                <td> {{ alliance.players.length }} </td>
                <td>{{ alliance.kills }} / {{ alliance.deaths }}</td>
                <td>{{ formatNumber(alliance.killFame) }}</td>
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
                    <!-- <td>Damages</td> -->
                    <td uk-tooltip="Heal applied on assistance, consider it as offensive healing">Heal*</td>
                    <td> Item Power </td>
                    <td> Kill Fame </td>
                    <td uk-tooltip="Only first death" v-if="showDeathFame"> Death Fame* </td>
                </tr>
              </thead>
            <tbody>
              <KillboardPlayersList
                v-for="player in alliance.sortedPlayers"
                :key="player.id"
                :showStats="showStats"
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

export default {
  name: 'Battle',
  data: function () {
    return {
      battle: [],
      totalPlayer: 0,
      // refreshStats: [],
      bestPlayerKillfame: { id: '', killfame: 0 },
      bestPlayerKill: { id: '', kill: 0 },
      bestPlayerAssistance: { id: '', assistance: 0 },
      bestPlayerIP: { id: '', itempower: 0 },
      bestAlliance: null,
      loserAlliance: null,
      showWeapon: false,
      showStats: false,
      showDeathFame: false,
      columnClass: false,
      isCollapse: false,
      searchPlayerName: null,
      error404: false,
      currentTopTableSort: '',
      currentTopTableSortDir: 'desc',
       
    }
  },
  components: {
    RequestFailed,
    KillboardOrderBy,
    KillboardPlayersList,
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
    refreshStats : function () {
      return this.battle ? this.battle.refreshStats : []
    }
  },
  methods: {
    async fetchData () {
      try {
          return await axios.get(`https://handholdreport.com/api/killboard/${this.$route.params.id}`)
      } catch {
          this.error404 = true
      }
    },

    async playerDead (playerId) {
      await axios.get(`https://handholdreport.com/api/player/${playerId}`) // METTRE L'ID DE LA BATTLE
        .then(response => {
          const eventdeath = response.data // RECUPERER QUE L EVENT DEATH UTILE VU QUE LE FOR EACH EST DANS LE BACK
          eventdeath.forEach(eventDeath => {
            // console.log(eventDeath)
            if (eventDeath.BattleId === this.battle.id) {
                this.battle.players[playerId].eventDeath = eventDeath
                console.log(this.refreshStats.length)
                this.refreshStats.push(playerId)
                 // KEEP
            } /* else {
                console.log('player died too much')
                this.refreshStats.push(playerId) // KEEP
                console.log(this.refreshStats.length) // KEEP
            } */
                // Show weapons when completly loaded
                if (this.battle.totalKills === Object.keys(this.refreshStats).length) {
                  this.showWeapon = true
              }
          })
        })
        .catch((error) => {
          this.refreshStats.push(playerId)
          this.error404 = true
        });
    },
    getPlayerDeath (playerId) {
      for (const player in this.battle.players) {
        if (this.battle.players[player].deaths > 0 && this.refreshStats.includes(player)) { // NOT USEFULL, seulement la requete ca devrait aller
          this.refreshStats.push(player)
          // Else if player died more than once, put his name in array for final count line 101
        } else if (this.battle.players[player].deaths > 0) {
          this.playerDead(player)
        }
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
        if (allianceChanged === 'sortedTopTableAlliances') {
          this.currentTopTableSortDir = currentSortDir
          this.currentTopTableSort = currentSortName
        }
    } ,
    onChangeColumn () {
      this.columnClass = !this.columnClass
      this.isCollapse = this.isCollapse ? '' : 'collapsible'
    },
    NbColumn () {
      return this.columnClass ? "uk-width-2-5@m uk-width-1-2@s uk-margin-auto twocolumn" : "uk-width-1-3@l uk-width-2-5@m uk-width-1-2@s"
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
        if (this.fullEventDeath) {
          this.showWeapon = true
        } else {
          this.getPlayerDeath()
        }
        // 
      })
      
  },
  watch: {
    showWeapon: function () {
      this.refreshStats.forEach(playerID => {
        // ------- VICTIM ITEM
        this.battle.players[playerID].weapon = this.battle.players[playerID].eventDeath.Victim.Equipment.MainHand
        // ------- VICTIM MOUNT
        this.battle.players[playerID].mount = this.battle.players[playerID].eventDeath.Victim.Equipment.Mount
        // ------- VICTIM IP
        this.battle.players[playerID].itempower = this.battle.players[playerID].eventDeath.Victim.AverageItemPower
        this.battle.players[playerID].itempower = this.battle.players[playerID].itempower.toFixed(0)
        // ------- Death IP
        this.battle.players[playerID].deathFame = this.battle.players[playerID].eventDeath.Victim.DeathFame

        // ------- PARTICIPANT WEAPON / IP / DMG / HEAL / ASSIST
        for (const participant in this.battle.players[playerID].eventDeath.Participants) {
          const participantId = this.battle.players[playerID].eventDeath.Participants[participant].Id

          if (this.battle.players[participantId]) {
            this.battle.players[participantId].assistance += 1
            // this.battle.players[participantId].damageDone.push(this.battle.players[playerID].eventDeath.Participants[participant].DamageDone)
            const heal = this.battle.players[playerID].eventDeath.Participants[participant].SupportHealingDone
            if (!this.battle.players[participantId].healingDone.includes(heal)) this.battle.players[participantId].healingDone.push(heal)
            if (this.battle.players[participantId].weapon) {
            } else {
              this.battle.players[participantId].weapon = this.battle.players[playerID].eventDeath.Participants[participant].Equipment.MainHand
              this.battle.players[participantId].mount = this.battle.players[playerID].eventDeath.Participants[participant].Equipment.Mount
              this.battle.players[participantId].itempower = this.battle.players[playerID].eventDeath.Participants[participant].AverageItemPower
              this.battle.players[participantId].itempower = this.battle.players[participantId].itempower.toFixed(0)
              // this.battle.players[participantId].itempower = this.battle.players[participantId].itempower.padStart(4, '0')
            }
          }
        }
        const killerId = this.battle.players[playerID].eventDeath.Killer.Id
        if (!this.battle.players[killerId].weapon) {
          this.battle.players[killerId].weapon = this.battle.players[playerID].eventDeath.Killer.Equipment.MainHand
          this.battle.players[killerId].mount = this.battle.players[playerID].eventDeath.Killer.Equipment.Mount
          this.battle.players[killerId].itempower = this.battle.players[playerID].eventDeath.Killer.AverageItemPower.toFixed(0)
        }
      })
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
}
// DANS LE TABLEAU DES GUILDES, POUR CHAQUE GUILDES (TABLEAU) AVOIR TOUS SES JOUEURS (OBJ)
</script>

<style scoped>
@import './../assets/css/killboard.css';
</style>
