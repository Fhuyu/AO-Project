<template>
  <div class="home">
    BATTLE
      <a class="waves-effect waves-light btn" v-on:click="deathStat(battle.players[0])">
        <i class="material-icons left">search</i>See first player death</a>
      <div class="row">

        <table v-for="(alliance, indexa) in battle.alliances" :key="indexa" class="col s4">
          <thead>
          <tr>
              <td>Alliance</td>
              <td>Guild</td>
              <td>Name</td>
              <td>Kills</td>
              <td>Deaths</td>
              <td>Assistance</td>
              <td>Damages</td>
              <td>Heal</td>
              <td>Weapon</td>
          </tr>
        </thead>
        <tbody v-for="player in battle.players" :key="player.id">
              <!-- <tr v-for="player in battle.players" :key="player.id"> -->
                <tr v-if="player.allianceId === alliance.id">
                  <td>{{ alliance.name }}</td>
                  <td>{{player.guildName}}</td>
                  <td>{{player.name}}</td>
                  <td>{{player.kills}}</td>
                  <td>{{player.deaths}}</td>
                  <td>{{player.assistance}}</td>
                  <td>{{player.damageDone}}</td>
                  <td>{{player.healingDone}}</td>
                  <td v-if="showWeapon">{{player.weapon}}</td>
                  <td v-else> Loading </td>

                </tr>
              <!-- </tr> -->

              </tbody>
<!--                <tbody v-for="player in battle.players" :key="player.id">
              <tr v-if="player.allianceId === ''">
                  <td>{{ alliance.name }}</td>
                  <td>{{player.guildName}}</td>
                  <td>{{player.name}}</td>
                  <td>{{player.kills}}</td>
                  <td>{{player.deaths}}</td>
                  <td>{{player.assistance}}</td>
                  <td>{{player.damageDone}}</td>
                  <td>{{player.healingDone}}</td>
                  <td v-if="showWeapon">{{player.weapon}}</td>
                  <td v-else> Loading </td>

                </tr>
                </tbody> -->
        </table>

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
      showWeapon: false
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
      await axios.get(`http://localhost:3000/player/${playerId}`)
        .then(response => {
          const eventdeath = response.data
          eventdeath.forEach(eventDeath => {
            if (eventDeath.BattleId === this.battle.id) {
              this.battle.players[playerId].eventDeath = eventDeath
              console.log(this.battle.players[playerId].eventDeath)
              // this.battle.players[playerId].weapon = eventDeath.Victim.Equipment.MainHand.Type
              // console.log(this.battle.players[playerId].weapon + playerId)

              // Add 1 to refreshstat dictionnary. Make a simple array later when healing
              // this.refreshStats[playerId] = this.battle.players[playerId].weapon
              this.refreshStats.push(playerId)

              // Show weapons when completly loaded
              console.log(`${Object.keys(this.refreshStats).length} = ${this.battle.totalKills}`)
              this.battle.totalKills === Object.keys(this.refreshStats).length ? this.showWeapon = true : console.log('NOT YET')
            }
          })
        })
    },
    getPlayerDeath (playerId) {
      console.log('IN GET PLAYER DEATH')
      for (const player in this.battle.players) {
        if (this.battle.players[player].deaths > 0 && this.refreshStats.includes(player)) {
          this.refreshStats.push(player)
          console.log('ELSE IF DEJA PRESENT' + this.refreshStats)
          // Else if player died more than once, put his name in array for final count line 101
        } else if (this.battle.players[player].deaths > 0) {
          this.playerDead(player)
        }
      }
    }
  },
  mounted () {
    this.fetchData()
      .then(res => {
        this.battle = res.data[0]
        this.events = res.data[1]
        for (const player in this.battle.players) {
          this.battle.players[player].damageDone = 0
          this.battle.players[player].healingDone = 0
          this.battle.players[player].assistance = 0
          this.battle.players[player].weapon = ''
        }
        this.getPlayerDeath()
      })
  }
  // watch: {
  //   refreshStats: function () {
  //     console.log('WATCHER ON')
  // CHECK REFRESH STAT POUR SAVOIR SI ON A FINI POUR AFFICHER
  // TABLEAU REFRESH STATS
  // PUSH PLAYER DANS TABLEAU
  // SI PLAYER DANS TABLEAU SEULEMENT UNE FOIS
  // FONCTION PLAYERDEAD
  //   }
  // },
  /*  computed: {
    refreshPlayerStat: function () {
      return this.refreshStats
    }
  } */
}
</script>
