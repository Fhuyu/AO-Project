<template>
  <div class="containercustom">
    BATTLE
<ul uk-grid="masonry: true" uk-accordion="multiple: true" class="uk-grid-collapse">
    <li class="uk-open uk-width-2-5 uk-card uk-card-default uk-padding-small uk-margin-auto uk-margin-small-bottom" v-for="(alliance, indexa) in battle.alliances" :key="indexa">
        <a class="uk-accordion-title" href="#">{{ alliance.name }} | KDA : {{ alliance.kills }} / {{ alliance.deaths }} | KILLFAME : {{ alliance.killFame }}</a>
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
        <tbody v-if="showStats" >
                <tr v-for="player in alliance.players" :key="player.id">
                  <td>
                    <span v-if="values(player).id === bestPlayerKillfame.id" class="uk-label uk-label-warning">KILLFAME</span>
                    <span v-if="values(player).id === bestPlayerKill.id" class="uk-label uk-label-danger">KILLS</span>
                  </td>
                  <td>{{values(player).guildName}}</td>
                  <td v-if="showStats && values(player).weapon">
                    <img style="height:35px" :src="imageWeaponUri(values(player).weapon.Type)">
                  </td>
                  <td v-else></td>
                  <td>{{values(player).name}}</td>
                  <td>{{values(player).kills}}</td>
                  <td>{{values(player).deaths}}</td>
                  <td>{{values(player).assistance}}</td>
                  <td v-if="showStats">{{values(player).damageDone}}</td>
                  <td>{{values(player).healingDone}}</td>
                  <td v-if="showStats">{{values(player).itempower}}</td>
                  <td v-else></td>
                  <td> {{values(player).killFame}} </td>

                </tr>

              </tbody>
              <tbody v-else><div uk-spinner></div></tbody>
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
      // averageIpGuild: [],
      showWeapon: false,
      showStats: false
    }
  },
  components: {
  },
  methods: {
    values (player) {
      return player[Object.keys(player)[0]]
    },
    async fetchData () {
      const response = await axios.get(`http://localhost:3000/killboard/${this.$route.params.id}`) // Passer la battle en props ?? plutot que de request
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
    },
    getPlayerDeath (playerId) {
      for (const player in this.battle.players) {
        if (this.battle.players[player].deaths > 0 && this.refreshStats.includes(player)) { // NOT USEFULL, seulement la requete ca devrait aller
          this.refreshStats.push(player)
          console.log('ELSE IF DEJA PRESENT' + this.refreshStats)
          // Else if player died more than once, put his name in array for final count line 101
        } else if (this.battle.players[player].deaths > 0) {
          this.playerDead(player)
        }
      }
    },
    imageWeaponUri (weaponType) {
      return `https://gameinfo.albiononline.com/api/gameinfo/items/${weaponType}`
    },
    arrondirIP (ip) {
      return ip.toFixed(0)
    }
  },
  mounted () {
    this.fetchData()
      .then(res => {
        this.battle = res.data // EVENT NOT USEFULL
        for (const guild in this.battle.guilds) { // ----------------- CHANGE TO ALLIANCE ?
          this.battle.guilds[guild].averageIP = []
        }
        for (const player in this.battle.players) {
          // --- BEST KILL FAME MEDAL
          if (this.battle.players[player].killFame > this.bestPlayerKillfame.killfame) {
            this.bestPlayerKillfame.killfame = this.battle.players[player].killFame
            this.bestPlayerKillfame.id = this.battle.players[player].id
          }
          if (this.battle.players[player].kills > this.bestPlayerKill.kill) {
            this.bestPlayerKill.kill = this.battle.players[player].kills
            this.bestPlayerKill.id = this.battle.players[player].id
          }
        }
        this.getPlayerDeath()
      })
  },
  watch: {
    showWeapon: function () {
      // console.log(this.refreshStats)
      this.refreshStats.forEach(playerID => {
        // console.log('PLAYER DEAD ID : ', playerID)
        // ------- VICTIM ITEM
        this.battle.players[playerID].weapon = this.battle.players[playerID].eventDeath.Victim.Equipment.MainHand
        // console.log('WEAPON JOUEUR MORT : ', this.battle.players[playerID].weapon)

        // ------- VICTIM IP
        this.battle.players[playerID].itempower = this.battle.players[playerID].eventDeath.Victim.AverageItemPower
        this.battle.players[playerID].itempower = this.battle.players[playerID].itempower.toFixed(0)
        // ADD IP IN GUILD STAT TO CALCUL AVERAGE GUILD IP
        // this.battle.guilds[this.battle.players[playerID].guildId].averageIP.push(this.battle.players[playerID].itempower)
        // console.log('IP JOUEUR MORT : ', this.battle.players[playerID].itempower)

        // ------- PARTICIPANT WEAPON
        for (const participant in this.battle.players[playerID].eventDeath.Participants) {
          const participantId = this.battle.players[playerID].eventDeath.Participants[participant].Id
          // console.log(participantId)
          // console.log('PARTICIPANT : ', this.battle.players[playerID].eventDeath.Participants[participant])

          if (this.battle.players[participantId]) {
            // console.log('PLAYER EXIST')
            this.battle.players[participantId].assistance += 1
            this.battle.players[participantId].damageDone.push(this.battle.players[playerID].eventDeath.Participants[participant].DamageDone)
            this.battle.players[participantId].healingDone.push(this.battle.players[playerID].eventDeath.Participants[participant].SupportHealingDone)
            if (this.battle.players[participantId].weapon) {
              // console.log('ALREADY WEAPON -- CANCEL', this.battle.players[participantId].weapon)
            } else {
              this.battle.players[participantId].weapon = this.battle.players[playerID].eventDeath.Participants[participant].Equipment.MainHand
              this.battle.players[participantId].itempower = this.battle.players[playerID].eventDeath.Participants[participant].AverageItemPower
              this.battle.players[participantId].itempower = this.battle.players[participantId].itempower.toFixed(0)
              // ADD IP IN GUILD STAT TO CALCUL AVERAGE GUILD IP
              // this.battle.guilds[this.battle.players[participantId].guildId].averageIP.push(this.battle.players[participantId].itempower)
              // console.log('NEW WEAPON : ', this.battle.players[participantId].weapon)
            }
          }
        }
      })
      for (const playerID in this.battle.players) {
        console.log('ALLIANCE DU JOUEUR : ', this.battle.players[playerID])
        if (this.battle.players[playerID].allianceId) {
          console.log('ALLIANCE DU JOUEUR : ', this.battle.players[playerID].allianceId)
          const playerAlliance = this.battle.players[playerID].allianceId
          this.battle.alliances[playerAlliance].players.push({ [playerID]: this.battle.players[playerID] })
          console.log('ALLIANCE DU JOUEUR UPDATED: ', this.battle.alliances[playerAlliance])
        }
      }
      console.log('WEAPON DONE')
      this.showStats = true
    }
  }
}
// DANS LE TABLEAU DES GUILDES, POUR CHAQUE GUILDES (TABLEAU) AVOIR TOUS SES JOUEURS (OBJ)
</script>

<style scoped>
@import './../assets/css/killboard.css';
</style>
