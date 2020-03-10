<template>
  <div class="home">
    BATTLE
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Battle',
  data: function () {
    return {
      battle: []
    }
  },
  components: {
  },
  methods: {
    async fetchData () {
      const response = await axios.get(`http://localhost:3000/killboard/${this.$route.params.id}`)
      return response
    }
  },
  mounted () {
    this.fetchData()
      .then(res => {
        this.battle = res.data
      })
  }
}
</script>
