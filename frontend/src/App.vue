<template>
    <div id="app" :class="viewMode">

    <div id="header">
		<div class="uk-text-center" uk-grid>
			<div class="uk-text-left uk-width-auto@m">
				<router-link to='/' style="text-decoration: none;">
					<h1><span>HANDHOLD</span><span style="color:#FF6933;">REPORT</span></h1> 
				</router-link>
				<p>Version 0.5.3 | 

				<button class="uk-button uk-button-text" type="button" uk-toggle="target: #modal-close-default">See changes</button> </p>
				<div id="modal-close-default" uk-modal>
					<div class="uk-modal-dialog uk-modal-body">
						<button class="uk-modal-close-default" type="button" uk-close></button>
						All details on HandHoldReport Discord : <a href="https://discord.gg/eQnTDFn" target="_blank"><img style="width:20px;" src="./assets/discord.png" alt="discord" /></a>
						<h2 class="uk-modal-title">Incoming</h2>
							Battleboard : Save guild research to be able to click back from killboard<br />
							Battleboard : Highlight searched guild & player<br />
						<h2 class="uk-modal-title">Done</h2>
							20-09-01 : Killboard : Switch to guild stats<br />
							20-08-28 : Attendance : Show IP + Main Weapon + Assistance<br />
							20-08-27 : Attendance : Version 1 + Rework design + Top stats<br />
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

        <nav class="uk-navbar-container uk-navbar-transparent menu" uk-navbar>
          <div class="uk-navbar-left">
              <ul class="uk-navbar-nav">
                  <li>				
                    <router-link to='/' style="text-decoration: none;">BATTLEBOARD</router-link>
                  </li>
                  <li>
                    <router-link to='/attendance' style="text-decoration: none;">ATTENDANCE</router-link>
                  </li>
                  <li>
                    <a uk-toggle="target: #support">SUPPORT THE PROJECT</a>
                  </li>
              </ul>
          </div>
        </nav>
        <div id="support" uk-modal>
            <div class="uk-modal-dialog uk-modal-body">
                <button class="uk-modal-close-default" type="button" uk-close></button>
                <h2 class="uk-modal-title">Support</h2>
                This website is still under development.<br/>
                If you want to help & support the server (or even buy me a coffee), this button brings you to Paypal.<br />
                <a class="m-4" target="_blank" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ZRAWUYBSCPB8Q&item_name=Server%20%26%20Coffee%21&currency_code=EUR&source=url">
                <button class="uk-button uk-button-primary" style="background:#FF7A4D">DONATE PAYPAL</button></a><br/>
                <br/>

                <a href="https://en.tipeee.com/handholdreport" style="margin: 10px 0!important;">
                <button class="uk-button uk-button-primary" style="background:#FF7A4D">Support HandHoldReport on Tipeee</button>
                </a>
                <p>If you need a special development / feature for your guild, you can join HandHoldReport discord or contact me on discord : Fuyu#2494
                </p>

                <h2 class="uk-modal-title">Contribute</h2>
                    - If you have any ideas<br />
                    - If you want to report a bug<br />
                    - If you want to help on something<br />
                    - If you want to know the next update<br />
                    <a target="_blank" href="https://discord.gg/eQnTDFn"> 
                      <button class="uk-button uk-button-primary" style="background:#FF7A4D">JOIN HANDHOLDREPORT DISCORD <img style="width:40px;" src="./assets/discord.png" alt="discord" />
                      </button>
                    </a>

                    <a href="https://discord.gg/eQnTDFn" target="_blank"></a>
                <h4 style="text-align:center">THANK YOU!</h4>
            </div>
        </div>
			</div>
				
			<div class="uk-width-expand@m">
				<NightMode @clicked="onClickSwitchMode"></NightMode>
		</div>
	</div>

    <router-view/>
    <div id="footer">

    </div>

    </div>

  </div>
</template>

<script async src="https://plugin.tipeee.com/widget.js" charset="utf-8"></script>
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
.night .menu li {
  background: none;
}
.uk-select:not([multiple]):not([size]) option {
  color:white;
  background: #444;
}
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
#header h4 {
	color:#f2c4b5;
}
#header .active h4{
	color:#FF7A4D;
}
#header h1, #header p {
  margin:0;
}
.night #header h1, .night #header p, .night #header button{
  color:white;
}
.night#app {
    height: 100vh;
    background-color: #05081c;
}

.night h3 {
  color:white;
}
.night, .night .battleboard, .night #footer {
    background: #05081c;
}
.night li {
    background: #24212f;
}
.night td {
    color: white;
}
.night .uk-button-primary {
    background: #FF7A4D;
}
.night .uk-button-secondary {
  background: #3066BE;
}
.attendance .v-select {
  width:350px;
  margin: auto;
}
.vs__dropdown-toggle {
  display: none!important;
  background:white;
}
.vs__dropdown-menu {
  background: #2e2a42!important;
  max-width: 350px;

}
.vs__dropdown-menu li {
  color: white;
  background: #444;
}
.night .attendance li:nth-child(2n) {
    background: #131218;
}
</style>
