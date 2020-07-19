<template>
  <div>
    <div class="uk-child-width-1-3@s" uk-grid>
        <div class="winning side">
          <h4 style="text-align:center;color: #f2f2f2;">{{handhold.side1}}</h4>
          <table v-if="winnerHandhold.length" class="uk-table stat_battle uk-container-small uk-margin-auto" style="margin-bottom:0px;bottom: 12px;position: relative;box-shadow: 0px 0px 4px 0px rgba(235,235,235,1);">
            <thead>
                <th style="font-weight: bold;">ALLIANCE</th>
                <th style="cursor:pointer;font-weight: bold;">PLAYERS
                </th>
                <th style="cursor:pointer;font-weight: bold;">KILLS
                </th>
                <th style="cursor:pointer;font-weight: bold;">DEATHS
                </th>
                <th style="cursor:pointer;font-weight: bold;">KILLFAME
                </th>
                <th  style="cursor:pointer;font-weight: bold;">IP
                </th>
            </thead>
            <tbody>
                <tr class="global_battle">
                    <td></td>
                    <td>{{ totalPlayers.winner.length ? totalPlayers.winner.reduce( (a,b) => a + b) : '' }}</td>
                    <td>{{ handholdGlobalColumn(winnerHandhold, 'kills')}}</td><!-- kills -->
                    <td>{{ handholdGlobalColumn(winnerHandhold, 'deaths')}}</td>
                    <td>{{ formatNumber(handholdGlobalColumn(winnerHandhold, 'killFame')) }}</td>
                    <td> {{ (handholdGlobalColumn(winnerHandhold, 'itempower') / winnerHandhold.length).toFixed(0) }} </td>
                </tr>
                <tr class="global" v-for="(alliance, index) in winnerHandhold" :key="index">
                    <td>{{ alliance.name }}</td>
                    <td>{{ alliance.players.length }}</td>
                    <td>{{ alliance.kills }}</td>
                    <td>{{ alliance.deaths }}</td>
                    <td >{{ formatNumber(alliance.killFame) }}</td>
                    <td v-if="alliance.itempower">{{alliance.itempower.toFixed(0)}}</td>
                    <td v-else></td>
                </tr>
            </tbody>
        </table>
      </div>
      <div class="loser side" v-if="loserHandhold.length">
          <h4 style="text-align:center;color: #f2f2f2;">{{handhold.side2}}</h4>
          <table class="uk-table stat_battle uk-container-small uk-margin-auto" style="margin-bottom:0px;bottom: 12px;position: relative;box-shadow: 0px 0px 4px 0px rgba(235,235,235,1);">
            <thead>
                <th style="font-weight: bold;">ALLIANCE</th>
                <th style="cursor:pointer;font-weight: bold;">PLAYERS
                </th>
                <th style="cursor:pointer;font-weight: bold;">KILLS
                </th>
                <th style="cursor:pointer;font-weight: bold;">DEATHS
                </th>
                <th style="cursor:pointer;font-weight: bold;">KILLFAME
                </th>
                <th  style="cursor:pointer;font-weight: bold;">IP
                </th>
            </thead>
            <tbody>
                <tr class="global_battle">
                    <td></td>
                    <!-- <td>{{ handholdGlobalColumn(loserHandhold, 'kills')}}</td> -->
                    <td>{{ totalPlayers.loser.length ? totalPlayers.loser.length > 1 ?  totalPlayers.loser.reduce( (a,b) => a + b) : totalPlayers.loser[0] : ''}}</td>
                    <td>{{ handholdGlobalColumn(loserHandhold, 'kills')}}</td>
                    <td> {{handholdGlobalColumn(loserHandhold, 'deaths')}}</td>
                    <td>{{ formatNumber(handholdGlobalColumn(loserHandhold, 'killFame')) }}</td>
                    <td> {{ (handholdGlobalColumn(loserHandhold, 'itempower') / loserHandhold.length).toFixed(0) }} </td>
                </tr>
                <tr class="global" v-for="(alliance, index) in loserHandhold" :key="index">
                    <td>{{ alliance.name }}</td>
                    <td>{{ alliance.players.length }}</td>
                    <td>{{ alliance.kills }}</td>
                    <td>{{ alliance.deaths }}</td>
                    <td >{{ formatNumber(alliance.killFame) }}</td>
                    <td v-if="alliance.itempower">{{alliance.itempower.toFixed(0)}}</td>
                    <td v-else></td>
                </tr>
            </tbody>
        </table>
      </div>
       <div class="other side" v-if="othersHandhold.length">
          <h4 style="text-align:center;color: #f2f2f2;">{{handhold.side3}}</h4>
          <table class="uk-table stat_battle uk-container-small uk-margin-auto" style="margin-bottom:0px;bottom: 12px;position: relative;box-shadow: 0px 0px 4px 0px rgba(235,235,235,1);">
            <thead>
                <th style="font-weight: bold;">ALLIANCE</th>
                <th style="cursor:pointer;font-weight: bold;">PLAYERS
                </th>
                <th style="cursor:pointer;font-weight: bold;">KILLS
                </th>
                <th style="cursor:pointer;font-weight: bold;">DEATHS
                </th>
                <th style="cursor:pointer;font-weight: bold;">KILLFAME
                </th>
                <th  style="cursor:pointer;font-weight: bold;">IP
                </th>
            </thead>
            <tbody>
                <tr class="global_battle">
                    <td></td>
                    <td>{{ totalPlayers.others.length ? totalPlayers.others.length > 1 ?  totalPlayers.others.reduce( (a,b) => a + b) : totalPlayers.others[0] : ''}}</td>
                    <td>{{ handholdGlobalColumn(othersHandhold, 'kills')}}</td>
                    <td> {{handholdGlobalColumn(othersHandhold, 'deaths')}}</td>
                    <td>{{ formatNumber(handholdGlobalColumn(othersHandhold, 'killFame')) }}</td>
                    <td>{{ (handholdGlobalColumn(othersHandhold, 'itempower') / othersHandhold.length).toFixed(0) }}</td>
                </tr>
                <tr class="global" v-for="(alliance, index) in othersHandhold" :key="index">
                    <td>{{ alliance.name }}</td>
                    <td>{{ alliance.players.length }}</td>
                    <td>{{ alliance.kills }}</td>
                    <td>{{ alliance.deaths }}</td>
                    <td >{{ formatNumber(alliance.killFame) }}</td>
                    <td v-if="alliance.itempower">{{alliance.itempower.toFixed(0)}}</td>
                    <td v-else></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Handhold',
  props: ['handhold','winnerHandhold', 'loserHandhold', 'othersHandhold'],
  data: function () {
    return {
      totalPlayers : {
        winner : [],
        loser : [],
        others : []
      }
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    formatNumber (num) {
      return ("" + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "." });
    },
    handholdGlobalColumn (side, column) {
      let columnArray = side.map( alliance => alliance[column])
      if (columnArray.length) {
        return columnArray.reduce( (a,b) => a + b)
      }
    }
  },
  mounted () {
    this.totalPlayers.winner = this.winnerHandhold.map(alliance => alliance.players.length);
    this.totalPlayers.loser = this.loserHandhold.map(alliance => alliance.players.length);
    this.totalPlayers.others = this.othersHandhold.map(alliance => alliance.players.length);
  }
}
</script>

<style scoped>
.loserside table {
  border-left: 5px solid red;
}
</style>