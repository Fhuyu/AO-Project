<template>
    <tr :style="resortir(player)">
        <td style="max-width: 80px;position: absolute;left: -90px;">
            <span v-if="player.id === bestPlayerKillfame.id" class="uk-label uk-label-warning">KILLFAME</span>
            <span v-if="player.id === bestPlayerKill.id" class="uk-label uk-label-danger">KILLS</span>
            <span v-if="player.id === bestPlayerAssistance.id" class="uk-label uk-label-success">ASSISTANCE</span>
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
        <!-- <td v-if="showStats">{{sumArray(player.damageDone).toFixed(0)}}</td> <td v-else></td> -->
        <td v-if="showStats">{{sumArray(player.healingDone).toFixed(0)}}</td> <td v-else><div uk-spinner></div></td>
        <td v-if="showStats">{{player.itempower}}</td> <td v-else></td>
        <td> {{formatNumber(player.killFame)}} </td>

    </tr>
</template>

<script>
export default {
  name: 'PlayersList',
  props: ['player', 'showStats', 'bestPlayerKillfame', 'bestPlayerKill', 'bestPlayerAssistance'],
  data: function () {
    return {
    }
  },
  methods: {
    imageWeaponUri (weaponType) {
      return `https://gameinfo.albiononline.com/api/gameinfo/items/${weaponType}`
    },
    formatNumber (num) {
      return ("" + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "." });
    },
    sumArray (array) {
      return array.reduce((accumulator, item) => accumulator + item, 0)
    },
    resortir (player) {
      if (player.name === this.searchPlayerName) return "background: lightblue;"
      if (player.id === this.bestPlayerKillfame.id) return "background: orange;"
      if (player.id === this.bestPlayerKill.id) return "background: lightcoral;"
      if (player.id === this.bestPlayerAssistance.id) return "background: #a6e0bd;"
    },
  }
}
</script>

<style scoped>
</style>
