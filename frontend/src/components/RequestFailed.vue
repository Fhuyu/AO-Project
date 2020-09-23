<template>
  <div class="errormessage">
    <div class="uk-card uk-card-primary uk-card-body" style="background: #FF7A4D;width: 50%;margin: auto;">
    <h3 class="uk-card-title">I can't find your guild! </h3> 
    <h3>Please check your guild name</h3>
    <!-- <router-link :to="killboardURL()"><button class="uk-button uk-button-primary">REFRESH THIS PAGE</button></router-link> -->
  </div>
  </div>
</template>

<script>
export default {
  name: 'RequestFailed',
  // props: [killboardID],
  methods: {
    killboardURL () {
      // return `killboard/${killboardID}`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
