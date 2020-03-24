<template>
<div class="uk-container-xlarge uk-margin-auto">
  <div class="">
    <form class="uk-search uk-search-default" v-on:submit.prevent>
          <span uk-search-icon></span>
          <input class="uk-search-input" type="search" v-model="searchPlayerName" placeholder="Search player">  
    </form>
    <a v-if="searchPlayerName" :href="searchPlayerAnchor" class="uk-button uk-button-primary"> GO</a>
    <button v-else class="uk-button uk-button-primary" disabled> GO</button>
  </div>

  <RequestFailed v-if="error404"
    :killboardID="battle.id">
  </RequestFailed>

  <KillboardOrderBy
    :showStats="showStats"
    @clicked="onClickOrderBy">
  </KillboardOrderBy>
  
    <ul uk-grid="masonry: true" uk-accordion="multiple: true" class="uk-grid-collapse">
        <li style="padding-right:20px;" class="uk-margin-auto uk-open uk-width-2-5 uk-card uk-card-default uk-margin-small-bottom" 
          v-for="(alliance, indexa) in battle.alliances" :key="indexa">
            <a class="uk-accordion-title" href="#">
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
                    <td>Assistance Healing</td>
                    <td> Item Power </td>
                    <td> Kill Fame </td>
                </tr>
              </thead>
            <tbody>
              <KillboardPlayersList
                v-for="player in alliance.sortedPlayers"
                :key="player.id"
                :showStats="showStats"
                :bestPlayerKillfame="bestPlayerKillfame"
                :bestPlayerKill="bestPlayerKill"
                :bestPlayerAssistance="bestPlayerAssistance"
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
      refreshStats: [],
      bestPlayerKillfame: { id: '', killfame: 0 },
      bestPlayerKill: { id: '', kill: 0 },
      bestPlayerAssistance: { id: '', assistance: 0 },
      showWeapon: false,
      showStats: false,
      searchPlayerName: null,
      error404: false
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
    }
  },
  methods: {
    async fetchData () {
      const response = await axios.get(`http://localhost:3000/killboard/${this.$route.params.id}`)
        .catch((error) => {
          this.error404 = true
        });
      return response
    },

    async playerDead (playerId) {
      await axios.get(`http://localhost:3000/player/${playerId}`) // METTRE L'ID DE LA BATTLE
        .then(response => {
          const eventdeath = response.data // RECUPERER QUE L EVENT DEATH UTILE VU QUE LE FOR EACH EST DANS LE BACK
          eventdeath.forEach(eventDeath => {
            if (eventDeath.BattleId === this.battle.id) {
              this.battle.players[playerId].eventDeath = eventDeath

              this.refreshStats.push(playerId) // KEEP

              // Show weapons when completly loaded
              console.log(`${Object.keys(this.refreshStats).length} = ${this.battle.totalKills}`)
              if (this.battle.totalKills === Object.keys(this.refreshStats).length) {
                this.showWeapon = true
              }
            }
          })
        })
        .catch((error) => {
          this.error404 = true
            this.refreshStats.push(playerId)
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
    }
  },
  mounted () {
    this.fetchData()
      .then(res => {
        this.battle = res.data // EVENT NOT USEFULL
        
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
            const playerAlliance = this.battle.players[playerID].allianceId
            this.battle.alliances[playerAlliance].players.push(this.battle.players[playerID])
          }
        }
        this.onClickOrderBy('killFame', 'desc')
        this.getPlayerDeath()
      })
      
  },
  watch: {
    showWeapon: function () {
      this.refreshStats.forEach(playerID => {
        // ------- VICTIM ITEM
        this.battle.players[playerID].weapon = this.battle.players[playerID].eventDeath.Victim.Equipment.MainHand
        // ------- VICTIM IP
        this.battle.players[playerID].itempower = this.battle.players[playerID].eventDeath.Victim.AverageItemPower
        this.battle.players[playerID].itempower = this.battle.players[playerID].itempower.toFixed(0)

        // ------- PARTICIPANT WEAPON / IP / DMG / HEAL / ASSIST
        for (const participant in this.battle.players[playerID].eventDeath.Participants) {
          const participantId = this.battle.players[playerID].eventDeath.Participants[participant].Id

          if (this.battle.players[participantId]) {
            this.battle.players[participantId].assistance += 1
            // this.battle.players[participantId].damageDone.push(this.battle.players[playerID].eventDeath.Participants[participant].DamageDone)
            this.battle.players[participantId].healingDone.push(this.battle.players[playerID].eventDeath.Participants[participant].SupportHealingDone)
            if (this.battle.players[participantId].weapon) {
            } else {
              this.battle.players[participantId].weapon = this.battle.players[playerID].eventDeath.Participants[participant].Equipment.MainHand
              this.battle.players[participantId].itempower = this.battle.players[playerID].eventDeath.Participants[participant].AverageItemPower
              this.battle.players[participantId].itempower = this.battle.players[participantId].itempower.toFixed(0)
            }
          }
        }
        const killerId = this.battle.players[playerID].eventDeath.Killer.Id
        if (!this.battle.players[killerId].weapon) {
          this.battle.players[killerId].weapon = this.battle.players[playerID].eventDeath.Killer.Equipment.MainHand
          this.battle.players[killerId].itempower = this.battle.players[playerID].eventDeath.Killer.AverageItemPower.toFixed(0)
        }
      })
      // CLEAN PLAYERS IN ALLIANCES TO UPDATED THEM WITH NEW STATS (IP, WEAPON ...)
      for (const alliance in this.battle.alliances) {
        this.battle.alliances[alliance].players = []
      }
      for (const playerID in this.battle.players) {
        if (this.battle.players[playerID].allianceId) {
          const playerAlliance = this.battle.players[playerID].allianceId
          this.battle.alliances[playerAlliance].players.push(this.battle.players[playerID])
          if (this.battle.players[playerID].itempower) {
            this.battle.alliances[playerAlliance].listItemPower.push(parseInt(this.battle.players[playerID].itempower))
          }
        }
        // --- BEST ASSITANCE MEDAL
        if (this.battle.players[playerID].assistance > this.bestPlayerAssistance.assistance) {
          this.bestPlayerAssistance.assistance = this.battle.players[playerID].assistance
          this.bestPlayerAssistance.id = this.battle.players[playerID].id
        } 
      }
      this.showStats = true
    },
  },
}
// DANS LE TABLEAU DES GUILDES, POUR CHAQUE GUILDES (TABLEAU) AVOIR TOUS SES JOUEURS (OBJ)
</script>

<style scoped>
@import './../assets/css/killboard.css';
</style>
