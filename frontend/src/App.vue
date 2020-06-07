<template>
  <div id="app" :class="viewMode">
    <div id="background">
    </div>
    <div id="header">
      <router-link to='/' style="text-decoration: none;">
        <!-- <img style="position: absolute;left: 30%;" src="./assets/handhold.png" alt="logo" /> -->
        <h1><span style="color:#9e9e9e;">HANDHOLD</span><span style="color:#DFA408;">REPORT</span></h1> 
      </router-link>
      <p>Beta version - 0.3.5 | 

      <button class="uk-button uk-button-text" type="button" uk-toggle="target: #modal-close-default">See changes</button> </p>
      <div id="modal-close-default" uk-modal>
          <div class="uk-modal-dialog uk-modal-body">
              <button class="uk-modal-close-default" type="button" uk-close></button>
              All details on HandHoldReport Discord : <a href="https://discord.gg/eQnTDFn" target="_blank"><img style="width:20px;" src="./assets/discord.png" alt="discord" /></a>
              <h2 class="uk-modal-title">Incoming</h2>
                  <b>Battleboard : Alliance + Player search</b><br />
                  Battleboard : Save guild research to be able to click back from killboard<br />
                  Battleboard : Highlight searched guild & player<br />
                  Website : General design (Logo / Color)<br />
              <h2 class="uk-modal-title">Done</h2>
                  20-06-06 : Killboard : Loading battles is faster & more (on discord)<br />
                  20-06-04 : Battleboard : Loading battles is faster<br />
                  20-06-02 : New Database on duty ! Data Optimized<br />
                  20-05-25 : Battleboard : Filter current battles by players : reworked (now show all battles and not only current offset)<br />
                  20-05-24 : Battleboard : Guild quick search !<br />
                  20-05-22 : Killboards : Now show informations as soon as the data is fetched (Prevent several bugs) | Loading bar is still here as indicator<br />
                  20-05-20 : Killboards are loading faster + Half of them show directly Weapon, IP ... || Killboard global stat can now be order by IP<br />
                  20-05-19 : New version available (HTTPS / Faster battleboard loading)<br />
          </div>
      </div>
    <NightMode @clicked="onClickSwitchMode"></NightMode>

    </div>
      <!-- <div class="uk-card uk-card-secondary uk-card-body uk-width-1-2@m uk-margin-auto" style="text-align:center;">
        <h3 class="uk-card-title"> NEW DOMAIN NAME <a href="https://handholdreport.com/" target="_blank">https://handholdreport.com/</a></h3>
        <p>HTTPS + MAIN PAGE IS LOADING FASTER</p>
      </div> -->
    <router-view/>
    <div id="footer">
      <p>Website under development. Wanna share your feedback ? <br />
      <a href="https://discord.gg/eQnTDFn" target="_blank"><img id="discord" src="./assets/discord.png" alt="discord" /></a>
      </p>
    </div>

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
#discord {
  width: 60px;
}
#footer {
  text-align: center;
  padding: 40px;

}
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
}

.night h3 {
  color:white;
}
.night, .night .battleboard, .night #footer {
    background: #1d1d1d;
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
