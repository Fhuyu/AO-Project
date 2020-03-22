<template>
  <div class="uk-container-xlarge uk-margin-auto">
    BATTLE
<ul uk-grid="masonry: true" uk-accordion="multiple: true" class="uk-grid-collapse">
    <li style="padding-right:20px;" class="uk-margin-auto uk-open uk-width-2-5 uk-card uk-card-default uk-margin-small-bottom" v-for="(alliance, indexa) in battle.alliances" :key="indexa">
        <a class="uk-accordion-title" href="#">{{ alliance.name }} | KDA : {{ alliance.kills }} / {{ alliance.deaths }} | KILLFAME : {{ alliance.killFame }}
          <span v-if="showStats && alliance.listItemPower.length > 0">IP Moyen : {{(sumArray(alliance.listItemPower) / alliance.listItemPower.length).toFixed(0)}}</span>  <!-- / alliance.listItemPower.length -->
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
              <td>Damages</td>
              <td>Heal</td>
              <td> Item Power </td>
              <td> Kill Fame </td>
          </tr>
        </thead>
        <tbody>
                <tr v-for="player in alliance.players" :key="player.id">
                  <td>
                    <span v-if="player.id === bestPlayerKillfame.id" class="uk-label uk-label-warning">KILLFAME</span>
                    <span v-if="player.id === bestPlayerKill.id" class="uk-label uk-label-danger">KILLS</span>
                  </td>
                  <td>{{player.guildName}}</td>
                  <td v-if="showStats && player.weapon">
                    <img :uk-tooltip="player.weapon.Type" style="height:35px" :src="imageWeaponUri(player.weapon.Type)">
                  </td>
                  <td v-else></td>
                  <td>{{player.name}}</td>
                  <td>{{player.kills}}</td>
                  <td>{{player.deaths}}</td>
                  <td>{{player.assistance}}</td>
                  <td v-if="showStats">{{sumArray(player.damageDone).toFixed(0)}}</td> <td v-else><div uk-spinner></div></td>
                  <td v-if="showStats">{{sumArray(player.healingDone).toFixed(0)}}</td> <td v-else><div uk-spinner></div></td>
                  <td v-if="showStats">{{player.itempower}}</td> <td v-else><div uk-spinner></div></td>
                  <td> {{player.killFame}} </td>

                </tr>

              </tbody>
              <!-- <tbody v-else><div uk-spinner></div></tbody> -->
             </table>
        </div>
    </li>
</ul>
  </div>
</template>

<script>
import axios from 'axios'

/*   */

export default {
  name: 'Battle',
  data: function () {
    return {
      battle: [],
      refreshStats: [],
      bestPlayerKillfame: { id: '', killfame: 0 },
      bestPlayerKill: { id: '', kill: 0 },
      showWeapon: false,
      showStats: false,
    }
  },
  components: {
  },
  methods: {
    async fetchData () {
      const response = await axios.get(`http://localhost:3000/killboard/${this.$route.params.id}`)
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
              this.battle.totalKills === Object.keys(this.refreshStats).length ? this.showWeapon = true : console.log('NOT YET')
            }
          })
        })
        .catch((error) => {
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
    imageWeaponUri (weaponType) {
      return `https://gameinfo.albiononline.com/api/gameinfo/items/${weaponType}`
    },
    sumArray (array) {
      return array.reduce((accumulator, item) => accumulator + item, 0)
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
        console.log('ALLIANCE DU JOUEUR : ', this.battle.players[playerID])
        if (this.battle.players[playerID].allianceId) {
          console.log('ALLIANCE DU JOUEUR : ', this.battle.players[playerID].allianceId)
          const playerAlliance = this.battle.players[playerID].allianceId
          this.battle.alliances[playerAlliance].players.push(this.battle.players[playerID])
          console.log('ALLIANCE DU JOUEUR UPDATED: ', this.battle.alliances[playerAlliance])
        }
      }
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
            this.battle.players[participantId].damageDone.push(this.battle.players[playerID].eventDeath.Participants[participant].DamageDone)
            this.battle.players[participantId].healingDone.push(this.battle.players[playerID].eventDeath.Participants[participant].SupportHealingDone)
            if (this.battle.players[participantId].weapon) {
            } else {
              this.battle.players[participantId].weapon = this.battle.players[playerID].eventDeath.Participants[participant].Equipment.MainHand
              this.battle.players[participantId].itempower = this.battle.players[playerID].eventDeath.Participants[participant].AverageItemPower
              this.battle.players[participantId].itempower = this.battle.players[participantId].itempower.toFixed(0)
            }
          }
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
      }
      // for (const alliance in this.battle.alliances) {
      //   this.battle.alliances[alliance].listItemPower = this.sumArray(this.battle.alliances[alliance].listItemPower)
      // }
      this.showStats = true
    }
  }
}
// DANS LE TABLEAU DES GUILDES, POUR CHAQUE GUILDES (TABLEAU) AVOIR TOUS SES JOUEURS (OBJ)
</script>

<style scoped>
@import './../assets/css/killboard.css';
</style>
