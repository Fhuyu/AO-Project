(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["killboard"],{1148:function(t,e,r){"use strict";var a=r("a691"),n=r("1d80");t.exports="".repeat||function(t){var e=String(n(this)),r="",i=a(t);if(i<0||i==1/0)throw RangeError("Wrong number of repetitions");for(;i>0;(i>>>=1)&&(e+=e))1&i&&(r+=e);return r}},"13d5":function(t,e,r){"use strict";var a=r("23e7"),n=r("d58f").left,i=r("a640"),s=r("ae40"),o=i("reduce"),c=s("reduce",{1:0});a({target:"Array",proto:!0,forced:!o||!c},{reduce:function(t){return n(this,t,arguments.length,arguments.length>1?arguments[1]:void 0)}})},"159b":function(t,e,r){var a=r("da84"),n=r("fdbc"),i=r("17c2"),s=r("9112");for(var o in n){var c=a[o],l=c&&c.prototype;if(l&&l.forEach!==i)try{s(l,"forEach",i)}catch(u){l.forEach=i}}},"17c2":function(t,e,r){"use strict";var a=r("b727").forEach,n=r("a640"),i=r("ae40"),s=n("forEach"),o=i("forEach");t.exports=s&&o?[].forEach:function(t){return a(this,t,arguments.length>1?arguments[1]:void 0)}},2532:function(t,e,r){"use strict";var a=r("23e7"),n=r("5a34"),i=r("1d80"),s=r("ab13");a({target:"String",proto:!0,forced:!s("includes")},{includes:function(t){return!!~String(i(this)).indexOf(n(t),arguments.length>1?arguments[1]:void 0)}})},"30ff":function(t,e,r){},"408a":function(t,e,r){var a=r("c6b6");t.exports=function(t){if("number"!=typeof t&&"Number"!=a(t))throw TypeError("Incorrect invocation");return+t}},4160:function(t,e,r){"use strict";var a=r("23e7"),n=r("17c2");a({target:"Array",proto:!0,forced:[].forEach!=n},{forEach:n})},"44e7":function(t,e,r){var a=r("861d"),n=r("c6b6"),i=r("b622"),s=i("match");t.exports=function(t){var e;return a(t)&&(void 0!==(e=t[s])?!!e:"RegExp"==n(t))}},"49cf":function(t,e,r){"use strict";r.r(e);var a=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"uk-container-xlarge uk-margin-auto"},[r("div",{},[r("form",{staticClass:"uk-search uk-search-default",on:{submit:function(t){t.preventDefault()}}},[r("span",{attrs:{"uk-search-icon":""}}),r("input",{directives:[{name:"model",rawName:"v-model",value:t.searchPlayerName,expression:"searchPlayerName"}],staticClass:"uk-search-input",attrs:{type:"search",placeholder:"Search player"},domProps:{value:t.searchPlayerName},on:{input:function(e){e.target.composing||(t.searchPlayerName=e.target.value)}}})]),t.searchPlayerName?r("a",{staticClass:"uk-button uk-button-primary",attrs:{href:t.searchPlayerAnchor}},[t._v(" GO")]):r("button",{staticClass:"uk-button uk-button-primary",attrs:{disabled:""}},[t._v(" GO")])]),r("div",{staticClass:"orderby uk-margin"},[r("h5",[t._v(" ORDER BY ")]),r("div",{staticClass:"uk-button-group"},[r("button",{staticClass:"uk-button uk-button-secondary",on:{click:function(e){return t.sort("guildName")}}},[t._v("GUILDNAME "),"guildName"===t.currentSort&&"desc"===t.currentSortDir?r("span",{attrs:{"uk-icon":"arrow-up"}}):t._e(),"guildName"===t.currentSort&&"asc"===t.currentSortDir?r("span",{attrs:{"uk-icon":"arrow-down"}}):t._e()]),r("button",{staticClass:"uk-button uk-button-secondary",on:{click:function(e){return t.sort("name")}}},[t._v("NAME "),"name"===t.currentSort&&"desc"===t.currentSortDir?r("span",{attrs:{"uk-icon":"arrow-up"}}):t._e(),"name"===t.currentSort&&"asc"===t.currentSortDir?r("span",{attrs:{"uk-icon":"arrow-down"}}):t._e()]),t.showStats?r("button",{staticClass:"uk-button uk-button-secondary",on:{click:function(e){return t.sort("itempower")}}},[t._v("ITEM POWER "),"itempower"===t.currentSort&&"desc"===t.currentSortDir?r("span",{attrs:{"uk-icon":"arrow-up"}}):t._e(),"itempower"===t.currentSort&&"asc"===t.currentSortDir?r("span",{attrs:{"uk-icon":"arrow-down"}}):t._e()]):r("button",{staticClass:"uk-button uk-button-secondary",attrs:{disabled:""}},[t._v("ITEM POWER")]),r("button",{staticClass:"uk-button uk-button-secondary",on:{click:function(e){return t.sort("killFame")}}},[t._v("KILLFAME "),"killFame"===t.currentSort&&"desc"===t.currentSortDir?r("span",{attrs:{"uk-icon":"arrow-up"}}):t._e(),"killFame"===t.currentSort&&"asc"===t.currentSortDir?r("span",{attrs:{"uk-icon":"arrow-down"}}):t._e()]),r("button",{staticClass:"uk-button uk-button-secondary",on:{click:function(e){return t.sort("kills")}}},[t._v("KILLS "),"kills"===t.currentSort&&"desc"===t.currentSortDir?r("span",{attrs:{"uk-icon":"arrow-up"}}):t._e(),"kills"===t.currentSort&&"asc"===t.currentSortDir?r("span",{attrs:{"uk-icon":"arrow-down"}}):t._e()]),t.showStats?r("button",{staticClass:"uk-button uk-button-secondary",on:{click:function(e){return t.sort("assistance")}}},[t._v("ASSISTANCE "),"assistance"===t.currentSort&&"desc"===t.currentSortDir?r("span",{attrs:{"uk-icon":"arrow-up"}}):t._e(),"assistance"===t.currentSort&&"asc"===t.currentSortDir?r("span",{attrs:{"uk-icon":"arrow-down"}}):t._e()]):r("button",{staticClass:"uk-button uk-button-secondary",attrs:{disabled:""}},[t._v("ASSISTANCE")])])]),r("ul",{staticClass:"uk-grid-collapse",attrs:{"uk-grid":"masonry: true","uk-accordion":"multiple: true"}},t._l(t.battle.alliances,(function(e,a){return r("li",{key:a,staticClass:"uk-margin-auto uk-open uk-width-2-5 uk-card uk-card-default uk-margin-small-bottom",staticStyle:{"padding-right":"20px"}},[r("a",{staticClass:"uk-accordion-title",attrs:{href:"#"}},[t._v(t._s(e.name)+" | KDA : "+t._s(e.kills)+" / "+t._s(e.deaths)+" | KILLFAME : "+t._s(e.killFame)+" "),t.showStats&&e.listItemPower.length>0?r("span",[t._v("IP Moyen : "+t._s((t.sumArray(e.listItemPower)/e.listItemPower.length).toFixed(0)))]):t._e()]),r("div",{staticClass:"uk-accordion-content"},[r("table",{staticClass:"uk-table uk-table-divider uk-table-striped",staticStyle:{position:"relative",margin:"10px"}},[t._m(0,!0),r("tbody",t._l(e.players,(function(e){return r("tr",{key:e.id,style:t.resortir(e),attrs:{id:e.name}},[r("td",{staticStyle:{"max-width":"80px",position:"absolute",left:"-90px"}},[e.id===t.bestPlayerKillfame.id?r("span",{staticClass:"uk-label uk-label-warning"},[t._v("KILLFAME")]):t._e(),e.id===t.bestPlayerKill.id?r("span",{staticClass:"uk-label uk-label-danger"},[t._v("KILLS")]):t._e()]),r("td",[t._v(t._s(e.guildName))]),t.showStats&&e.weapon?r("td",[r("img",{staticStyle:{height:"35px"},attrs:{"uk-tooltip":e.weapon.Type,src:t.imageWeaponUri(e.weapon.Type)}})]):r("td"),r("td",[t._v(t._s(e.name))]),r("td",[t._v(t._s(e.kills))]),r("td",[t._v(t._s(e.deaths))]),r("td",[t._v(t._s(e.assistance))]),t.showStats?r("td",[t._v(t._s(t.sumArray(e.damageDone).toFixed(0)))]):r("td"),t.showStats?r("td",[t._v(t._s(t.sumArray(e.healingDone).toFixed(0)))]):r("td",[r("div",{attrs:{"uk-spinner":""}})]),t.showStats?r("td",[t._v(t._s(e.itempower))]):r("td"),r("td",[t._v(" "+t._s(e.killFame)+" ")])])})),0)])])])})),0),r("a",{attrs:{href:"#","uk-totop":"","uk-scroll":""}})])},n=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("thead",[r("tr",[r("td"),t._v(" "),r("td",[t._v("Guild")]),r("td"),r("td",[t._v("Name")]),r("td",[t._v("Kills")]),r("td",[t._v("Deaths")]),r("td",[t._v("Assist")]),r("td",[t._v("Damages")]),r("td",[t._v("Heal")]),r("td",[t._v(" Item Power ")]),r("td",[t._v(" Kill Fame ")])])])}],i=(r("4160"),r("caad"),r("13d5"),r("4e82"),r("b0c0"),r("b680"),r("b64b"),r("e25e"),r("2532"),r("159b"),r("96cf"),r("1da1")),s=r("bc3a"),o=r.n(s),c={name:"Battle",data:function(){return{battle:[],refreshStats:[],bestPlayerKillfame:{id:"",killfame:0},bestPlayerKill:{id:"",kill:0},showWeapon:!1,showStats:!1,currentSort:"killFame",currentSortDir:"desc",reload:0,searchPlayerName:null}},computed:{searchPlayerAnchor:function(){if(this.searchPlayerName)return"#".concat(this.searchPlayerName)}},methods:{fetchData:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,o.a.get("https://routeymqad0mx-fuyuh-che.b542.starter-us-east-2a.openshiftapps.com/killboard/".concat(t.$route.params.id));case 2:return r=e.sent,e.abrupt("return",r);case 4:case"end":return e.stop()}}),e)})))()},playerDead:function(t){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,o.a.get("https://routeymqad0mx-fuyuh-che.b542.starter-us-east-2a.openshiftapps.com/player/".concat(t)).then((function(r){var a=r.data;a.forEach((function(r){r.BattleId===e.battle.id&&(e.battle.players[t].eventDeath=r,e.refreshStats.push(t),e.battle.totalKills===Object.keys(e.refreshStats).length&&(e.reload+=1,e.showWeapon=!0))}))}))["catch"]((function(r){e.refreshStats.push(t)}));case 2:case"end":return r.stop()}}),r)})))()},getPlayerDeath:function(t){for(var e in this.battle.players)this.battle.players[e].deaths>0&&this.refreshStats.includes(e)?this.refreshStats.push(e):this.battle.players[e].deaths>0&&this.playerDead(e)},imageWeaponUri:function(t){return"https://gameinfo.albiononline.com/api/gameinfo/items/".concat(t)},sumArray:function(t){return t.reduce((function(t,e){return t+e}),0)},sort:function(t){t===this.currentSort&&(this.currentSortDir="asc"===this.currentSortDir?"desc":"asc"),this.currentSort=t,this.reload+=1},resortir:function(t){if(t.name===this.searchPlayerName)return"background: lightblue;"}},mounted:function(){var t=this;this.fetchData().then((function(e){for(var r in t.battle=e.data,t.battle.players)t.battle.players[r].killFame>t.bestPlayerKillfame.killfame&&(t.bestPlayerKillfame.killfame=t.battle.players[r].killFame,t.bestPlayerKillfame.id=t.battle.players[r].id),t.battle.players[r].kills>t.bestPlayerKill.kill&&(t.bestPlayerKill.kill=t.battle.players[r].kills,t.bestPlayerKill.id=t.battle.players[r].id);for(var a in t.battle.players)if(t.battle.players[a].allianceId){var n=t.battle.players[a].allianceId;t.battle.alliances[n].players.push(t.battle.players[a])}t.reload+=1,t.getPlayerDeath()}))},watch:{showWeapon:function(){var t=this;for(var e in this.refreshStats.forEach((function(e){for(var r in t.battle.players[e].weapon=t.battle.players[e].eventDeath.Victim.Equipment.MainHand,t.battle.players[e].itempower=t.battle.players[e].eventDeath.Victim.AverageItemPower,t.battle.players[e].itempower=t.battle.players[e].itempower.toFixed(0),t.battle.players[e].eventDeath.Participants){var a=t.battle.players[e].eventDeath.Participants[r].Id;t.battle.players[a]&&(t.battle.players[a].assistance+=1,t.battle.players[a].damageDone.push(t.battle.players[e].eventDeath.Participants[r].DamageDone),t.battle.players[a].healingDone.push(t.battle.players[e].eventDeath.Participants[r].SupportHealingDone),t.battle.players[a].weapon||(t.battle.players[a].weapon=t.battle.players[e].eventDeath.Participants[r].Equipment.MainHand,t.battle.players[a].itempower=t.battle.players[e].eventDeath.Participants[r].AverageItemPower,t.battle.players[a].itempower=t.battle.players[a].itempower.toFixed(0)))}})),this.battle.alliances)this.battle.alliances[e].players=[];for(var r in this.battle.players)if(this.battle.players[r].allianceId){var a=this.battle.players[r].allianceId;this.battle.alliances[a].players.push(this.battle.players[r]),this.battle.players[r].itempower&&this.battle.alliances[a].listItemPower.push(parseInt(this.battle.players[r].itempower))}this.showStats=!0},reload:function(){var t=this;for(var e in this.battle.alliances)this.battle.alliances[e].sortedPlayers=this.battle.alliances[e].players.sort((function(e,r){var a=1;return"desc"===t.currentSortDir&&(a=-1),e[t.currentSort]<r[t.currentSort]?-1*a:e[t.currentSort]>r[t.currentSort]?1*a:0}))}}},l=c,u=(r("a6b0"),r("2877")),d=Object(u["a"])(l,a,n,!1,null,"4c897424",null);e["default"]=d.exports},"4e82":function(t,e,r){"use strict";var a=r("23e7"),n=r("1c0b"),i=r("7b0b"),s=r("d039"),o=r("a640"),c=[],l=c.sort,u=s((function(){c.sort(void 0)})),d=s((function(){c.sort(null)})),f=o("sort"),p=u||!d||!f;a({target:"Array",proto:!0,forced:p},{sort:function(t){return void 0===t?l.call(i(this)):l.call(i(this),n(t))}})},5899:function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(t,e,r){var a=r("1d80"),n=r("5899"),i="["+n+"]",s=RegExp("^"+i+i+"*"),o=RegExp(i+i+"*$"),c=function(t){return function(e){var r=String(a(e));return 1&t&&(r=r.replace(s,"")),2&t&&(r=r.replace(o,"")),r}};t.exports={start:c(1),end:c(2),trim:c(3)}},"5a34":function(t,e,r){var a=r("44e7");t.exports=function(t){if(a(t))throw TypeError("The method doesn't accept regular expressions");return t}},"65f0":function(t,e,r){var a=r("861d"),n=r("e8b5"),i=r("b622"),s=i("species");t.exports=function(t,e){var r;return n(t)&&(r=t.constructor,"function"!=typeof r||r!==Array&&!n(r.prototype)?a(r)&&(r=r[s],null===r&&(r=void 0)):r=void 0),new(void 0===r?Array:r)(0===e?0:e)}},a6b0:function(t,e,r){"use strict";var a=r("30ff"),n=r.n(a);n.a},ab13:function(t,e,r){var a=r("b622"),n=a("match");t.exports=function(t){var e=/./;try{"/./"[t](e)}catch(r){try{return e[n]=!1,"/./"[t](e)}catch(a){}}return!1}},ae40:function(t,e,r){var a=r("83ab"),n=r("d039"),i=r("5135"),s=Object.defineProperty,o={},c=function(t){throw t};t.exports=function(t,e){if(i(o,t))return o[t];e||(e={});var r=[][t],l=!!i(e,"ACCESSORS")&&e.ACCESSORS,u=i(e,0)?e[0]:c,d=i(e,1)?e[1]:void 0;return o[t]=!!r&&!n((function(){if(l&&!a)return!0;var t={length:-1};l?s(t,1,{enumerable:!0,get:c}):t[1]=1,r.call(t,u,d)}))}},b0c0:function(t,e,r){var a=r("83ab"),n=r("9bf2").f,i=Function.prototype,s=i.toString,o=/^\s*function ([^ (]*)/,c="name";!a||c in i||n(i,c,{configurable:!0,get:function(){try{return s.call(this).match(o)[1]}catch(t){return""}}})},b64b:function(t,e,r){var a=r("23e7"),n=r("7b0b"),i=r("df75"),s=r("d039"),o=s((function(){i(1)}));a({target:"Object",stat:!0,forced:o},{keys:function(t){return i(n(t))}})},b680:function(t,e,r){"use strict";var a=r("23e7"),n=r("a691"),i=r("408a"),s=r("1148"),o=r("d039"),c=1..toFixed,l=Math.floor,u=function(t,e,r){return 0===e?r:e%2===1?u(t,e-1,r*t):u(t*t,e/2,r)},d=function(t){var e=0,r=t;while(r>=4096)e+=12,r/=4096;while(r>=2)e+=1,r/=2;return e},f=c&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!o((function(){c.call({})}));a({target:"Number",proto:!0,forced:f},{toFixed:function(t){var e,r,a,o,c=i(this),f=n(t),p=[0,0,0,0,0,0],h="",b="0",v=function(t,e){var r=-1,a=e;while(++r<6)a+=t*p[r],p[r]=a%1e7,a=l(a/1e7)},m=function(t){var e=6,r=0;while(--e>=0)r+=p[e],p[e]=l(r/t),r=r%t*1e7},y=function(){var t=6,e="";while(--t>=0)if(""!==e||0===t||0!==p[t]){var r=String(p[t]);e=""===e?r:e+s.call("0",7-r.length)+r}return e};if(f<0||f>20)throw RangeError("Incorrect fraction digits");if(c!=c)return"NaN";if(c<=-1e21||c>=1e21)return String(c);if(c<0&&(h="-",c=-c),c>1e-21)if(e=d(c*u(2,69,1))-69,r=e<0?c*u(2,-e,1):c/u(2,e,1),r*=4503599627370496,e=52-e,e>0){v(0,r),a=f;while(a>=7)v(1e7,0),a-=7;v(u(10,a,1),0),a=e-1;while(a>=23)m(1<<23),a-=23;m(1<<a),v(1,1),m(2),b=y()}else v(0,r),v(1<<-e,0),b=y()+s.call("0",f);return f>0?(o=b.length,b=h+(o<=f?"0."+s.call("0",f-o)+b:b.slice(0,o-f)+"."+b.slice(o-f))):b=h+b,b}})},b727:function(t,e,r){var a=r("0366"),n=r("44ad"),i=r("7b0b"),s=r("50c4"),o=r("65f0"),c=[].push,l=function(t){var e=1==t,r=2==t,l=3==t,u=4==t,d=6==t,f=5==t||d;return function(p,h,b,v){for(var m,y,k=i(p),S=n(k),g=a(h,b,3),w=s(S.length),_=0,x=v||o,D=e?x(p,w):r?x(p,0):void 0;w>_;_++)if((f||_ in S)&&(m=S[_],y=g(m,_,k),t))if(e)D[_]=y;else if(y)switch(t){case 3:return!0;case 5:return m;case 6:return _;case 2:c.call(D,m)}else if(u)return!1;return d?-1:l||u?u:D}};t.exports={forEach:l(0),map:l(1),filter:l(2),some:l(3),every:l(4),find:l(5),findIndex:l(6)}},c20d:function(t,e,r){var a=r("da84"),n=r("58a8").trim,i=r("5899"),s=a.parseInt,o=/^[+-]?0[Xx]/,c=8!==s(i+"08")||22!==s(i+"0x16");t.exports=c?function(t,e){var r=n(String(t));return s(r,e>>>0||(o.test(r)?16:10))}:s},caad:function(t,e,r){"use strict";var a=r("23e7"),n=r("4d64").includes,i=r("44d2"),s=r("ae40"),o=s("indexOf",{ACCESSORS:!0,1:0});a({target:"Array",proto:!0,forced:!o},{includes:function(t){return n(this,t,arguments.length>1?arguments[1]:void 0)}}),i("includes")},d58f:function(t,e,r){var a=r("1c0b"),n=r("7b0b"),i=r("44ad"),s=r("50c4"),o=function(t){return function(e,r,o,c){a(r);var l=n(e),u=i(l),d=s(l.length),f=t?d-1:0,p=t?-1:1;if(o<2)while(1){if(f in u){c=u[f],f+=p;break}if(f+=p,t?f<0:d<=f)throw TypeError("Reduce of empty array with no initial value")}for(;t?f>=0:d>f;f+=p)f in u&&(c=r(c,u[f],f,l));return c}};t.exports={left:o(!1),right:o(!0)}},e25e:function(t,e,r){var a=r("23e7"),n=r("c20d");a({global:!0,forced:parseInt!=n},{parseInt:n})},e8b5:function(t,e,r){var a=r("c6b6");t.exports=Array.isArray||function(t){return"Array"==a(t)}},fdbc:function(t,e){t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}}}]);
//# sourceMappingURL=killboard.e2387b47.js.map