<template>
  <div class="errormessage">
    <h1> OOPS ! An error occured. </h1> 
    <h3>Please refresh this page </h3>
    <!-- <router-link :to="killboardURL()"><button class="uk-button uk-button-primary">REFRESH THIS PAGE</button></router-link> -->
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
