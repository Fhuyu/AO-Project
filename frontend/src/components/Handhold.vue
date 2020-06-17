<template>
<div>
    <button @click="getGuild(); $emit('changeHeaderView', winningGuilds, loserGuilds, otherGuilds); ">APPLY</button>

  <div class="uk-child-width-1-3@s" uk-grid>
      <div>
          <h4 class="win">WINNING SIDE</h4>
          <div uk-sortable="group: sortable-group" id="win">

          </div>
      </div>
      <div>
          <h4 class="lose">LOSING SIDE</h4>
          <div uk-sortable="group: sortable-group" id="lose">
              <div class="uk-margin guild" v-for="(alliance, index) in alliances" :key="index" :id="alliance.id">
                  <div class="uk-card uk-card-default uk-card-body uk-card-small">{{ alliance.name }}</div>
              </div>
          </div>
      </div>
      <div>
          <h4 class="other">OTHER</h4>
          <div uk-sortable="group: sortable-group" id="other"></div>
      </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'Handhold',
  props: ['alliances'],
  data: function () {
    return {
      winningGuilds : [],
      loserGuilds : [],
      otherGuilds : []
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    getGuild () {
      this.winningGuilds = Array.from(document.getElementById("win").getElementsByClassName("guild")).map( guild => guild.id);
      this.loserGuilds = Array.from(document.getElementById("lose").getElementsByClassName("guild")).map( guild => guild.id);
      this.otherGuilds = Array.from(document.getElementById("other").getElementsByClassName("guild")).map( guild => guild.id);
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.win {
  color: green;
}
#win div {
  background-color: green;
}
.lose {
  color: red;
}
#lose div {
  background-color: red;
}
.other {
  color: grey;
}
#other div {
  background-color: grey;
}
</style>