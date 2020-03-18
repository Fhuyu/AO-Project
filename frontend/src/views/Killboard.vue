<template>
  <div class="containercustom">
    BATTLE
      <div class="row">
        <table v-for="(alliance, indexa) in battle.alliances" :key="indexa" class="col s3" style="position:relative;margin:10px">
          <div style="position:absolute;top:-20px"> {{ alliance.name }} |  {{ alliance.kills }} / {{ alliance.deaths }}</div>
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
        <tbody v-for="player in battle.players" :key="player.id">
                <tr v-if="player.allianceId === alliance.id">
                  <td>
                    <span v-if="player.id === bestPlayerKillfame.id" class="new badge orange" data-badge-caption="KILLFAME"></span>
                    <span v-if="player.id === bestPlayerKill.id" class="new badge red" data-badge-caption="TOP KILL"></span>
                  </td>
                  <td>{{player.guildName}}</td>
                  <td v-if="showStats && player.weapon">
                    <img style="height:35px" :src="imageWeaponUri(player.weapon.Type)">
                  </td>
                  <td v-else></td>
                  <td>{{player.name}}</td>
                  <td>{{player.kills}}</td>
                  <td>{{player.deaths}}</td>
                  <td>{{player.assistance}}</td>
                  <td v-if="showStats">{{player.damageDone}}</td>
                  <td v-else></td>
                  <td>{{player.healingDone}}</td>
                  <td v-if="showStats">{{player.itempower}}</td>
                  <td v-else></td>
                  <td> {{player.killFame}} </td>

                </tr>
              <!-- </tr> -->

              </tbody>
             </table>
              <div v-for="(guild, indexg) in battle.guilds" :key="indexg">
              <table v-if="!guild.allianceId" class="col s3" style="position:relative;margin:10px" :class="guild.name">
                <div style="position:absolute;top:-20px"> {{ guild.name }} | {{guild.kills}}/{{guild.deaths}} | AverageIP : {{guild.averageIP}}</div>
                <thead>
                <tr>
                    <td></td>
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
               <tbody v-for="player in battle.players" :key="player.id">
                  <tr v-if="guild.id === player.guildId">
                    <td>
                      <span v-if="player.id === bestPlayerKillfame.id" class="new badge orange" data-badge-caption="KILLFAME"></span>
                      <span v-if="player.id === bestPlayerKill.id" class="new badge red" data-badge-caption="TOP KILL"></span>
                    </td>
                    <td>{{player.guildName}}</td>
                    <td v-if="showStats && player.weapon">
                      <img style="height:35px" :src="imageWeaponUri(player.weapon.Type)">
                    </td>
                    <td v-else></td>
                    <td>{{player.name}}</td>
                    <td>{{player.kills}}</td>
                    <td>{{player.deaths}}</td>
                    <td>{{player.assistance}}</td>
                    <td v-if="showStats">{{player.damageDone}}</td>
                    <td v-else></td>
                    <td>{{player.healingDone}}</td>
                    <td v-if="showStats">{{player.itempower}}</td>
                    <td v-else></td>
                    <td> {{player.killFame}} </td>
                  </tr>
                </tbody>
             </table>
             </div>

<!--         PAS DALLIANCE
        <div v-for="player in battle.players" :key="player.id">
            <span v-if="player.allianceId === ''"> {{player}}</span>
        </div> -->
      </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Battle',
  data: function () {
    return {
      battle: [],
      events: [],
      refreshStats: [],
      alliances: [],
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
    },
    averageIP (guild) {

    }
  },
  mounted () {
    this.fetchData()
      .then(res => {
        this.battle = res.data[0] // EVENT NOT USEFULL
        this.events = res.data[1]
        for (const guild in this.battle.guilds) {
          this.battle.guilds[guild].averageIP = []
        }
        for (const player in this.battle.players) {
          this.battle.players[player].damageDone = []
          this.battle.players[player].healingDone = []
          this.battle.players[player].assistance = 0
          this.battle.players[player].weapon = ''
          this.battle.players[player].itempower = null
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
      console.log(this.refreshStats)
      this.refreshStats.forEach(playerID => {
        console.log('PLAYER DEAD ID : ', playerID)
        // ------- VICTIM ITEM
        this.battle.players[playerID].weapon = this.battle.players[playerID].eventDeath.Victim.Equipment.MainHand
        console.log('WEAPON JOUEUR MORT : ', this.battle.players[playerID].weapon)

        // ------- VICTIM IP
        this.battle.players[playerID].itempower = this.battle.players[playerID].eventDeath.Victim.AverageItemPower
        this.battle.players[playerID].itempower = this.battle.players[playerID].itempower.toFixed(0)
        // ADD IP IN GUILD STAT TO CALCUL AVERAGE GUILD IP
        this.battle.guilds[this.battle.players[playerID].guildId].averageIP.push(this.battle.players[playerID].itempower)
        console.log('IP JOUEUR MORT : ', this.battle.players[playerID].itempower)

        // ------- PARTICIPANT WEAPON
        for (const participant in this.battle.players[playerID].eventDeath.Participants) {
          const participantId = this.battle.players[playerID].eventDeath.Participants[participant].Id
          console.log(participantId)
          console.log('PARTICIPANT : ', this.battle.players[playerID].eventDeath.Participants[participant])

          if (this.battle.players[participantId]) {
            console.log('PLAYER EXIST')
            this.battle.players[participantId].assistance += 1
            this.battle.players[participantId].damageDone.push(this.battle.players[playerID].eventDeath.Participants[participant].DamageDone)
            this.battle.players[participantId].healingDone.push(this.battle.players[playerID].eventDeath.Participants[participant].SupportHealingDone)
            if (this.battle.players[participantId].weapon) {
              console.log('ALREADY WEAPON -- CANCEL', this.battle.players[participantId].weapon)
            } else {
              this.battle.players[participantId].weapon = this.battle.players[playerID].eventDeath.Participants[participant].Equipment.MainHand
              this.battle.players[participantId].itempower = this.battle.players[playerID].eventDeath.Participants[participant].AverageItemPower
              this.battle.players[participantId].itempower = this.battle.players[participantId].itempower.toFixed(0)
              // ADD IP IN GUILD STAT TO CALCUL AVERAGE GUILD IP
              this.battle.guilds[this.battle.players[participantId].guildId].averageIP.push(this.battle.players[participantId].itempower)
              console.log('NEW WEAPON : ', this.battle.players[participantId].weapon)
            }
          }
        }
      })
      console.log('WEAPON DONE')
      this.showStats = true
    }
  }
}
</script>

<style scoped>
@import './../assets/css/killboard.css';
</style>
