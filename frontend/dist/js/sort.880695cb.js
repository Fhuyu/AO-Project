(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["sort"],{"4e82":function(t,r,e){"use strict";var a=e("23e7"),n=e("1c0b"),s=e("7b0b"),o=e("d039"),l=e("a640"),i=[],c=i.sort,u=o((function(){i.sort(void 0)})),d=o((function(){i.sort(null)})),k=l("sort"),b=u||!d||!k;a({target:"Array",proto:!0,forced:b},{sort:function(t){return void 0===t?c.call(s(this)):c.call(s(this),n(t))}})},"66a7":function(t,r,e){"use strict";e.r(r);var a=function(){var t=this,r=t.$createElement,e=t._self._c||r;return e("div",{staticClass:"uk-container-xlarge uk-margin-auto"},[t._v(" BATTLE "),e("div",{staticClass:"uk-button-group"},[e("button",{staticClass:"uk-button uk-button-secondary",on:{click:function(r){return t.sort("guildName")}}},[t._v("GUILDNAME "),"guildName"===t.currentSort&&"desc"===t.currentSortDir?e("span",{attrs:{"uk-icon":"arrow-up"}}):t._e(),"guildName"===t.currentSort&&"asc"===t.currentSortDir?e("span",{attrs:{"uk-icon":"arrow-down"}}):t._e()]),e("button",{staticClass:"uk-button uk-button-secondary",on:{click:function(r){return t.sort("name")}}},[t._v("NAME "),"name"===t.currentSort&&"desc"===t.currentSortDir?e("span",{attrs:{"uk-icon":"arrow-up"}}):t._e(),"name"===t.currentSort&&"asc"===t.currentSortDir?e("span",{attrs:{"uk-icon":"arrow-down"}}):t._e()]),e("button",{staticClass:"uk-button uk-button-secondary",on:{click:function(r){return t.sort("killFame")}}},[t._v("KILLFAME "),"killFame"===t.currentSort&&"desc"===t.currentSortDir?e("span",{attrs:{"uk-icon":"arrow-up"}}):t._e(),"killFame"===t.currentSort&&"asc"===t.currentSortDir?e("span",{attrs:{"uk-icon":"arrow-down"}}):t._e()])]),e("ul",{staticClass:"uk-grid-collapse",attrs:{"uk-grid":"masonry: true","uk-accordion":"multiple: true"}},t._l(t.battle.alliances,(function(r,a){return e("li",{key:a,staticClass:"uk-open uk-width-2-5 uk-card uk-card-default uk-padding-small uk-margin-small-bottom"},[e("a",{staticClass:"uk-accordion-title",attrs:{href:"#"}},[t._v(t._s(r.name)+" | KDA : "+t._s(r.kills)+" / "+t._s(r.deaths)+" | KILLFAME : "+t._s(r.killFame))]),e("div",{staticClass:"uk-accordion-content"},[e("table",{staticClass:"uk-table uk-table-divider uk-table-striped",staticStyle:{position:"relative",margin:"10px"}},[e("thead",[e("tr",[e("td"),t._v(" "),e("td",{on:{click:function(r){return t.sort("guildName")}}},[t._v("Guild")]),e("td",{on:{click:function(r){return t.sort("name")}}},[t._v("Name")]),e("td",[t._v("Kills")]),e("td",[t._v("Deaths")]),e("td",{on:{click:function(r){return t.sort("killFame")}}},[t._v(" Kill Fame ")])])]),e("tbody",t._l(r.players,(function(r){return e("tr",{key:r.id},[e("td",[t.values(r).id===t.bestPlayerKillfame.id?e("span",{staticClass:"uk-label uk-label-warning"},[t._v("KILLFAME")]):t._e(),t.values(r).id===t.bestPlayerKill.id?e("span",{staticClass:"uk-label uk-label-danger"},[t._v("KILLS")]):t._e()]),e("td",[t._v(t._s(r.guildName))]),e("td",[t._v(t._s(r.name))]),e("td",[t._v(t._s(r.kills))]),e("td",[t._v(t._s(r.deaths))]),e("td",[t._v(" "+t._s(r.killFame)+" ")])])})),0)])])])})),0)])},n=[],s=(e("4e82"),e("b64b"),e("96cf"),e("1da1")),o=e("bc3a"),l=e.n(o),i={name:"Battle",data:function(){return{battle:[],refreshStats:[],bestPlayerKillfame:{id:"",killfame:0},bestPlayerKill:{id:"",kill:0},showWeapon:!1,currentSort:"killFame",currentSortDir:"desc",reload:0}},components:{},methods:{values:function(t){return t[Object.keys(t)[0]]},fetchData:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function r(){var e;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,l.a.get("http://localhost:3000/killboard/".concat(t.$route.params.id));case 2:return e=r.sent,r.abrupt("return",e);case 4:case"end":return r.stop()}}),r)})))()},sort:function(t){console.log(this.currentSort),console.log("clicked",t),t===this.currentSort&&(this.currentSortDir="asc"===this.currentSortDir?"desc":"asc"),this.currentSort=t,this.reload+=1,console.log(this.currentSort)}},computed:{},mounted:function(){var t=this;this.fetchData().then((function(r){t.battle=r.data,t.showWeapon=!0}))},watch:{showWeapon:function(){for(var t in this.battle.players){if(console.log("ALLIANCE DU JOUEUR : ",this.battle.players[t]),this.battle.players[t].allianceId){console.log("ALLIANCE DU JOUEUR : ",this.battle.players[t].allianceId);var r=this.battle.players[t].allianceId;this.battle.alliances[r].players.push(this.battle.players[t]),console.log("ALLIANCE DU JOUEUR UPDATED: ",this.battle.alliances[r])}this.reload+=1}},reload:function(){var t=this;for(var r in this.battle.alliances)console.log,this.battle.alliances[r].sortedPlayers=this.battle.alliances[r].players.sort((function(r,e){var a=1;return"desc"===t.currentSortDir&&(a=-1),r[t.currentSort]<e[t.currentSort]?-1*a:r[t.currentSort]>e[t.currentSort]?1*a:0}))}}},c=i,u=(e("e3a2"),e("2877")),d=Object(u["a"])(c,a,n,!1,null,"162439a0",null);r["default"]=d.exports},b64b:function(t,r,e){var a=e("23e7"),n=e("7b0b"),s=e("df75"),o=e("d039"),l=o((function(){s(1)}));a({target:"Object",stat:!0,forced:l},{keys:function(t){return s(n(t))}})},c86d:function(t,r,e){},e3a2:function(t,r,e){"use strict";var a=e("c86d"),n=e.n(a);n.a}}]);
//# sourceMappingURL=sort.880695cb.js.map