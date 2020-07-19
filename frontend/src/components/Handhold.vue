<template>
<div>
    <button class="uk-button uk-button-secondary" style="position: absolute;top: 0;" @click="getGuild(); $emit('changeHeaderView', winningGuilds, loserGuilds, otherGuilds, side1, side2, side3); ">APPLY</button>

  <div class="uk-child-width-1-3@s uk-margin-top" uk-grid>
      <div>
          <h4 v-if="!allowInput1" class="win">{{side1}} <span uk-icon="pencil" v-if="!allowInput2 && !allowInput3" @click="sideEdit = side1; allowInput1 = true"></span></h4>
          <div v-else style="margin-bottom:8px">
            <input class="uk-input" style="max-width: 300px;" v-model="sideEdit">
            <button class="uk-button uk-button-secondary" @click="side1 = sideEdit; allowInput1 = false"><span uk-icon="check"></span></button>
            <button class="uk-button uk-button-danger" @click="allowInput1 = false"><span uk-icon="close"></span></button>
          </div>
          <div uk-sortable="group: sortable-group" id="win">
            <div class="uk-margin guild" v-for="(alliance, index) in winningAlliancesInit" :key="index" :id="alliance.id">
                  <div class="uk-card uk-card-default uk-card-body uk-card-small allicard"><b>{{ alliance.name }}</b> | KILLFAME : {{ alliance.killFame }} | KD : {{ alliance.kills }} / {{ alliance.deaths }}</div>
              </div>

          </div>
      </div>
      <div>
          <h4 v-if="!allowInput2" class="lose">{{side2}} <span v-if="!allowInput1 && !allowInput3" uk-icon="pencil" @click="sideEdit = side2; allowInput2 = true"></span></h4>
          <div v-else style="margin-bottom:8px">
            <input class="uk-input" style="max-width: 300px;" v-model="sideEdit">
            <button class="uk-button uk-button-secondary" @click="side2 = sideEdit; allowInput2 = false"><span uk-icon="check"></span></button>
            <button class="uk-button uk-button-danger" @click="allowInput2 = false"><span uk-icon="close"></span></button>
          </div>
          <div uk-sortable="group: sortable-group" id="lose">
              <div class="uk-margin guild" v-for="(alliance, index) in losingAlliancesInit" :key="index" :id="alliance.id">
                  <div class="uk-card uk-card-default uk-card-body uk-card-small allicard"><b>{{ alliance.name }}</b> | KILLFAME : {{ alliance.killFame }} | KD : {{ alliance.kills }} / {{ alliance.deaths }}</div>
              </div>
          </div>
      </div>
      <div>
          <h4 v-if="!allowInput3" class="other">{{side3}} <span v-if="!allowInput2 && !allowInput1" uk-icon="pencil" @click="sideEdit = side3; allowInput3 = true"></span></h4>
          <div v-else style="margin-bottom:8px">
            <input class="uk-input" style="max-width: 300px;" v-model="sideEdit">
            <button class="uk-button uk-button-secondary" @click="side3 = sideEdit; allowInput3 = false"><span uk-icon="check"></span></button>
            <button class="uk-button uk-button-danger" @click="allowInput3 = false"><span uk-icon="close"></span></button>
          </div>
          <div uk-sortable="group: sortable-group" id="other"></div>
      </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'Handhold',
  props: ['alliances', 'bestAlliance'],
  data: function () {
    return {
      winningGuilds : [],
      loserGuilds : [],
      otherGuilds : [],
      side1 : "SIDE 1",
      side2 : "SIDE 2",
      side3 : "SIDE 3",
      side3edit : '',
      allowInput1 : false,
      allowInput2 : false,
      allowInput3: false,
    }
  },
  components: {
  },
  computed: {
    losingAlliancesInit: function() {
      return this.alliances.filter( (alli) => {
        if (alli.id === this.bestAlliance) {
          return false
        }
        return true
      })
    },
    winningAlliancesInit: function() {
      return this.alliances.filter( (alli) => {
        if (alli.id === this.bestAlliance) {
          return true
        }
        return false
      })
    },
  },
  methods: {
    getGuild () {
      this.winningGuilds = Array.from(document.getElementById("win").getElementsByClassName("guild")).map( guild => guild.id);
      this.loserGuilds = Array.from(document.getElementById("lose").getElementsByClassName("guild")).map( guild => guild.id);
      this.otherGuilds = Array.from(document.getElementById("other").getElementsByClassName("guild")).map( guild => guild.id);
    },
  },
  mounted () {
  }
}
</script>

<style scoped>
.win {
  color: #2A786E;
}
#win div {
  background-color: #2A786E;
  color:white;
}
.lose {
  color: #3066BE;
}
#lose div {
  background-color: #3066BE;
  color:white;
}
.other {
  color: #525252;
}
#other div {
  background-color: #525252;
  color:white;
}
.uk-sortable {
  padding-bottom: 150px;
}
.allicard {
  padding: 5px 20px;
}
span[uk-icon] {
  cursor: pointer;
}
</style>