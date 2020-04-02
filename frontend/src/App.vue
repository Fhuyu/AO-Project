<template>
  <div id="app" :class="viewMode">
    <div id="header">
      <h1 >HANDHOLDREPORT</h1>
      <p>Beta version - 0.1.0 - Under Development</p>

      <button class="uk-button uk-button-text" type="button" uk-toggle="target: #modal-close-default">See changes</button>
      <div id="modal-close-default" uk-modal>
          <div class="uk-modal-dialog uk-modal-body">
              <button class="uk-modal-close-default" type="button" uk-close></button>
              <h2 class="uk-modal-title">Incoming</h2>
                  Global Battleboard : Battles Design visual <br />
                  Global Battleboard : Search by player<br />
                  Killboard : Player / Killfame / Kills percent per guild<br />
              <h2 class="uk-modal-title">Done</h2>
                  Killboard : See battlemount over weapon (PopHover weapon available)<br />
          </div>
      </div>
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
          viewMode: 'night', //night
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
#header {
  text-align: center;
}
.night #header h1, .night #header p, .night #header button{
  color:white;
}
.night#app {
    height: 100vh;
    background-color: #1d1d1d;
    transition: 0.5s ease-in-out;

}
.night h3 {
  color:white;
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
.night .uk-button-secondary {
  background: #3066BE;
}
</style>
