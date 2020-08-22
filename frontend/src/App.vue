<template>
  <div id="app" :class="viewMode">

    <div id="header">
      

    <div class="uk-text-center" uk-grid>
		<div class="uk-text-left uk-width-auto@m">
			<router-link to='/' style="text-decoration: none;">
				<h1><span>HANDHOLD</span><span style="color:#FF6933;">REPORT</span></h1> 
			</router-link>
			<p>Beta version - 0.4.0 | 

			<button class="uk-button uk-button-text" type="button" uk-toggle="target: #modal-close-default">See changes</button> </p>
			<div id="modal-close-default" uk-modal>
				<div class="uk-modal-dialog uk-modal-body">
					<button class="uk-modal-close-default" type="button" uk-close></button>
					All details on HandHoldReport Discord : <a href="https://discord.gg/eQnTDFn" target="_blank"><img style="width:20px;" src="./assets/discord.png" alt="discord" /></a>
					<h2 class="uk-modal-title">Incoming</h2>
						Battleboard : Save guild research to be able to click back from killboard<br />
						Battleboard : Highlight searched guild & player<br />
						Website : General design (Logo / Color)<br />
					<h2 class="uk-modal-title">Done</h2>
						20-07-17 : Killboard : Handhold mode + Enable healing view<br />
						20-06-13 : Battleboard : Alliance + Player search (Exact name + Case sensitive)<br />
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
		</div>
		<div class="uk-width-1-5@m">
			<router-link to='/' style="text-decoration: none;"><h4>BATTLEBOARD</h4></router-link>
		</div>
		<div class="uk-width-1-5@m">
			<router-link to='/attendance' style="text-decoration: none;"><h4>ATTENDANCE</h4></router-link>
		</div>
		<div class="uk-width-expand@m">
			<NightMode @clicked="onClickSwitchMode"></NightMode>
      </div>
  </div>


    </div>
      <!-- <div class="uk-card uk-card-secondary uk-card-body uk-width-1-2@m uk-margin-auto" style="text-align:center;">
        <h3 class="uk-card-title"> NEW DOMAIN NAME <a href="https://handholdreport.com/" target="_blank">https://handholdreport.com/</a></h3>
        <p>HTTPS + MAIN PAGE IS LOADING FASTER</p>
      </div> -->
    <router-view/>
    <div id="footer">
      <div>Website under development. Wanna share your feedback ? <br />
      <a href="https://discord.gg/eQnTDFn" target="_blank"><img id="discord" src="./assets/discord.png" alt="discord" /></a>
      <form  action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" style="width: 130px;
    height: 100px;
    overflow: hidden;margin: 20px auto;">
        <input type="hidden" name="cmd" value="_donations" />
        <input type="hidden" name="business" value="ZRAWUYBSCPB8Q" />
        <input type="hidden" name="item_name" value="Coffee & Server !" />
        <input type="hidden" name="currency_code" value="EUR" />
        <input type="image" style="width: 200px;margin: -40% -50%;" src="https://media.giphy.com/media/EqNfolceUiLPW/giphy.gif" border="0" name="submit" title="Send me one coffee with Paypal !" alt="Donate with PayPal button" />
        <img alt="" border="0" src="https://www.paypal.com/en_FR/i/scr/pixel.gif" width="1" height="1" />
      </form>
      </div>
      


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
  padding: 20px;
}
#header .active h4{
	color:#0495a3;
}
#header h1, #header p {
  margin:0;
}
.night #header h1, .night #header p, .night #header button{
  color:white;
}
.night#app {
    height: 100vh;
    background-color: #080B21;
}

.night h3 {
  color:white;
}
.night, .night .battleboard, .night #footer {
    background: #080B21;
}
.night li {
    background: #323232;
}
.night td {
    color: #dddddd;
}
.night .uk-button-primary {
    background: #FF7A4D;
}
.night .uk-button-secondary {
  background: #3066BE;
}
</style>
