<template>
  <div class="container text-center mt-5">
    <h1>Tiempo Real</h1>
    <div class="clock-display p-4 my-4">
      <h2>{{ time }}</h2>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      time: "Cargando...",
    };
  },
  mounted() {
    this.fetchTime();
    this.setupWebSocket();
  },
  methods: {
    async fetchTime() {
      try {
        const response = await axios.get(
          `http://${process.env.VUE_APP_COORDINATOR_HOST}:${process.env.VUE_APP_COORDINATOR_PORT}/worldtime`
        );
        this.time = new Date(response.data.datetime).toLocaleTimeString();
      } catch (error) {
        console.error("Error al obtener la hora:", error);
      }
    },
    setupWebSocket() {
      const socket = new WebSocket(
        `ws://${process.env.VUE_APP_COORDINATOR_HOST}:${process.env.VUE_APP_COORDINATOR_PORT}`
      );
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.time) {
          this.time = data.time;
        }
      };
    },
  },
};
</script>
