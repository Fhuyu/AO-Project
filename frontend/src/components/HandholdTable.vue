<template>
  <div>
    <p>{{winnerHandhold}}</p>
  </div>
</template>

<script>

export default {
  name: 'Handhold',
  props: ['winnerHandhold', 'loserHandhold', 'othersHandhold'],
  data: function () {
    return {
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style scoped>
.win {
  color: green;
}
#win div {
  background-color: green;
}
.lose {
  color: red;
}
#lose div {
  background-color: red;
}
.other {
  color: grey;
}
#other div {
  background-color: grey;
}
</style>