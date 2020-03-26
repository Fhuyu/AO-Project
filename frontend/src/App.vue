<template>
  <div id="app" :class="viewMode">
    <div id="nav" uk-grid>
      <router-link class="uk-width-1-2" to="/"><h3>Battleboard</h3></router-link>
    <NightMode class="uk-width-1-2" @clicked="onClickSwitchMode"></NightMode>

    </div>
    <router-view/>

  </div>
</template>

<script>
import NightMode from "@/components/NightMode"
export default {
  data: function () {
      return {
          viewMode: 'night',
      }
  },
  components: {
    NightMode
  },
  methods : {
    onClickSwitchMode : function (mode) {
      this.viewMode = mode
      console.log('APP SWITCHED MODE', mode)
    }
  }
  
}
</script>

<style>
body {
    height: 100%;
}
.night, .night .battleboard {
    background: #1d1d1d;
    transition: 0.5s ease-in-out;
}
.night li {
    background: #323232;
}
.night td {
    color: #dddddd;
}
.night .uk-button-primary {
    background: #0d7377;
}
</style>
