<template>
    <div class="switch__container">
        <div>
          <!-- <img src="../assets/sun.svg" alt="sun" /> -->
        </div>
        <input id="switch-shadow" class="switch switch--shadow" :class="currentMode" type="checkbox">
        <label @click="switchMode()" for="switch-shadow"></label>
    </div>
</template>
<script>
export default {
    name: 'NightMode',
    data: function () {
        return {
            currentMode: 'night',
        }
    },
    methods: {
    switchMode: function () {
        this.currentMode = this.currentMode === 'night' ? 'day' : 'night'
        // this.currentMode = !this.currentMode
        console.log('switched', this.currentMode)
        this.$emit('clicked', this.currentMode)
    },
    
}
}
</script>
<style scoped>

.switch__container {
  right: 20px;
  top: 20px;
  position: absolute;
}

.switch {
  visibility: hidden;
  position: absolute;
  margin-left: -9999px;
}

.switch + label {
  display: block;
  position: relative;
  cursor: pointer;
  outline: none;
  user-select: none;
}
.switch--shadow.night + label {
  padding: 2px;
  width: 120px;
  height: 60px;
  background-color: #092d6b;
  border-radius: 60px;
}
.switch--shadow.day + label {
  padding: 2px;
  width: 120px;
  height: 60px;
  background-color: #b0eff4;
  border-radius: 60px;
}
.switch--shadow + label:before,
.switch--shadow + label:after {
  display: block;
  position: absolute;
  top: 1px;
  left: 1px;
  bottom: 1px;
  content: "";
}
.switch--shadow + label:before {
  right: 1px;
  background-color: #144777;
  border-radius: 60px;
  transition: background 0.4s;
}
.switch--shadow.night + label:after {
  width: 62px;
  background-image: url(https://image.flaticon.com/icons/svg/2204/2204369.svg);
  background-size: 62px;
  border-radius: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: all 0.4s;
}
.switch--shadow.day + label:after {
  width: 62px;
  background-image: url(https://image.flaticon.com/icons/svg/2204/2204346.svg);
  background-size: 62px;
  border-radius: 100%;
  transition: all 0.4s;
}
.switch--shadow:checked + label:before {
  background-color: #85c7dd;
}
.switch--shadow:checked + label:after {
  transform: translateX(60px);
}

</style>