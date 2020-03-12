<template>
  <div class="home">
    BATTLE
      <a class="waves-effect waves-light btn" v-on:click="deathStat(battle.players[0])">
        <i class="material-icons left">search</i>See first player death</a>
      <div class="row">
        <div v-for="(alliance, indexa) in battle.alliances" :key="indexa" class="col s4">
          <h6>{{ alliance.name }}</h6>
              <div v-for="player in battle.players" :key="player.id">
                <span v-if="player.allianceId === alliance.id">
                  {{ player }}
                  {{player.guildName}}
                  {{player.name}}
                  {{player.kills}}
                  {{player.deaths}}
                  {{player.assistance}}
                  {{player.damageDone}}
                  {{player.healingDone}}
                  {{player.weapon}}

                  <span v-if="showWeapon">{{player.weapon}}</span>
                  <span v-else>LOADING</span>
                </span>
              </div>
        </div>
        PAS DALLIANCE
        <div v-for="player in battle.players" :key="player.id">
            <span v-if="player.allianceId === ''"> {{player}}</span>
        </div>
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
      refreshStats: {},
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
              this.battle.players[playerId].weapon = eventDeath.Victim.Equipment.MainHand.Type
              // console.log(this.battle.players[playerId].weapon)
              // Add 1 to refreshstat dictionnary. Make a simple array later when healing etc...
              this.refreshStats[playerId] = this.battle.players[playerId].weapon
              // Show weapons when completly loaded
              this.battle.totalKills === Object.keys(this.refreshStats).length ? this.showWeapon = true : console.log('NOT YET')
            }
          })
        })
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

          if (this.battle.players[player].deaths > 0) {
            this.playerDead(player)
          }
        }
        console.log('done')
      })
  },
  // watch: {
  //   refreshStats: function () {
  //     console.log('WATCHER ON')
  //   }
  // },
  computed: {
    refreshPlayerStat: function () {
      return this.refreshStats
    }
  }
}
</script>
