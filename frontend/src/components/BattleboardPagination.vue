<template>
<div class="uk-margin-medium">
      <ul class="uk-pagination">
        <li><a  v-if="currentOffset > 1" 
                @click="changeOffset('previous')" 
                :uk-tooltip="currentOffset -50 +' - '+currentOffset+' Battles'">
                  <span class="uk-margin-small-right" uk-pagination-previous></span> Previous
        </a></li>

        <span v-if="offsetLoading" class="uk-width-expand" style="text-align: center;">Loading battles : {{currentOffset}} - {{ currentOffset +50}} <div uk-spinner></div></span>
        <span v-else class="uk-width-expand" style="text-align: center;">Actual battles : {{currentOffset}} - {{ currentOffset +50}}</span>

        <li class="uk-margin-auto-left"><a @click="changeOffset('next')"
          :uk-tooltip="(currentOffset+50) +' - '+(currentOffset+100) +' Battles'">
            Next <span class="uk-margin-small-left" uk-pagination-next></span>
        </a></li>
      </ul>
    </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['currentOffset', 'offsetLoading'],
  data: function () {
    return {
    }
  },
  methods: {
    changeOffset (step) {
      this.currentOffset += step === 'next' ? 50 : -50
      this.$emit('changeOffset', this.currentOffset)
    },
  },
}
</script>

<style scoped>
</style>
