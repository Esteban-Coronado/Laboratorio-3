// Obtener la IP y el puerto de la instancia desde la URL de la ventana
const instanceInfo = `${window.location.hostname}:${window.location.port}`;
document.getElementById('instance-info').textContent = instanceInfo;

// Conectar al WebSocket
const ws = new WebSocket(`ws://${instanceInfo}`);

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    document.getElementById('time').textContent = data.time;
};

ws.onopen = function() {
    console.log('Connected to WebSocket');
};

ws.onclose = function() {
    console.log('Disconnected from WebSocket');
};
