<template>
  <div id="app" :class="viewMode">
    <div id="header">
      <router-link to='/' style="text-decoration: none;">
        <!-- <img style="position: absolute;left: 30%;" src="./assets/handhold.png" alt="logo" /> -->
        <h1><span style="color:#9e9e9e;">HANDHOLD</span><span style="color:#DFA408;">REPORT</span></h1>
      </router-link>
      <p>Beta version - 0.3.1 - Filter by players number reworked | 

      <button class="uk-button uk-button-text" type="button" uk-toggle="target: #modal-close-default">See changes</button> </p>
      <div id="modal-close-default" uk-modal>
          <div class="uk-modal-dialog uk-modal-body">
              <button class="uk-modal-close-default" type="button" uk-close></button>
              <h2 class="uk-modal-title">Incoming</h2>
                  <b>Battleboard : Alliance + Player search</b><br />
                  <b>Killboard : Optimize weapons in all killboard without loading.</b><br />
                  Battleboard : Save guild research to be able to click back from killboard<br />
                  Killboard : Resolve loading bar blocked for old battles<br />
                  Battleboard : Highlight searched guild & player<br />
                  Website : General design (Logo / Color)<br />
              <!-- <h2 class="uk-modal-title">Idea</h2>
                  Comment section under each killboard<br />
                  Top 5 battles of the week <br />
                  Top PVP guild of the week <br />
                  Show guild presentation with video <br /> -->
              <h2 class="uk-modal-title">Done</h2>
                  20-05-25 : Battleboard : Filter current battles by players : reworked (now show all battles and not only current offset)<br />
                  20-05-24 : Battleboard : Guild quick search !<br />
                  20-05-22 : Killboards : Now show informations as soon as the data is fetched (Prevent several bugs) | Loading bar is still here as indicator<br />
                  20-05-20 : Killboards are loading faster + Half of them show directly Weapon, IP ... || Killboard global stat can now be order by IP<br />
                  20-05-19 : New version available (HTTPS / Faster battleboard loading)<br />
                  20-04-17 : Battleboard - Visual update + Able to type Enter to search guild<br />
                  20-04-06 : Killboard - Global statistics // Mode switch updated<br />
                  20-04-03 : Global Battleboard - Filter current battles by player number<br />
                  20-04-02 : Global Battleboard - Battles Design visual upgraded (Night & Day)<br />
                  20-03-31 : Killboard - See battlemount over weapon (Hover weapon available)<br />
          </div>
      </div>
    <NightMode @clicked="onClickSwitchMode"></NightMode>

    </div>
      <!-- <div class="uk-card uk-card-secondary uk-card-body uk-width-1-2@m uk-margin-auto" style="text-align:center;">
        <h3 class="uk-card-title"> NEW DOMAIN NAME <a href="https://handholdreport.com/" target="_blank">https://handholdreport.com/</a></h3>
        <p>HTTPS + MAIN PAGE IS LOADING FASTER</p>
      </div> -->
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
  padding: 40px;
}
#header h1 {
  margin: 0;
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
