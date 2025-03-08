<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  <v-stage
    :scale="1"
    :width="1200"
    :height="1200"
    ref='stageRef'
    @click="() => {
      console.log('www')
    }"
  >
    <v-layer>
      <v-rect
        fill='red'
        :x="100"
        :y="100"
        :width="400 * 3"
        :height="400 * 3"
      />
      <v-line
        bezier
        :points="[100, 100, 200, 200, 250, 350, 400, 500]"
        :strokeWidth="2.2"
        stroke="black"
      />
    </v-layer>
  </v-stage>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
