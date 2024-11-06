document.addEventListener('DOMContentLoaded', () => {
    const logList = document.getElementById('log-list');
    const instanceList = document.getElementById('instance-list');
  
    const updateLogs = (log) => {
      const logItem = document.createElement('li');
      logItem.textContent = log;
      logList.appendChild(logItem);
    };
  
    const updateInstances = async () => {
      const response = await fetch('/instances');
      const instances = await response.json();
      instanceList.innerHTML = '';
      
      instances.forEach(({ host, port }) => {
        const instanceItem = document.createElement('li');
        instanceItem.textContent = `Host: ${host}, Port: ${port}`;
        instanceList.appendChild(instanceItem);
      });
    };
  
    const fetchLogs = async () => {
      const response = await fetch('/logs');
      const { logs } = await response.json();
      logList.innerHTML = '';
      logs.forEach((log) => updateLogs(log));
    };
  
    const launchInstance = async () => {
      const response = await fetch('/launch', { method: 'POST' });
      if (response.ok) {
        const message = await response.text();
        updateLogs(message);
        await updateInstances();
      } else {
        updateLogs('Error lanzando la instancia');
      }
    };
  
    const syncClocks = async () => {
      const response = await fetch('/sync-clocks', { method: 'POST' });
      if (response.ok) {
        const { message } = await response.json();
        updateLogs(message);
      } else {
        updateLogs('Error sincronizando los relojes');
      }
    };
  
    document.getElementById('launch-instance').addEventListener('click', launchInstance);
    document.getElementById('sync-clocks').addEventListener('click', syncClocks);
  
    // Construir la URL del WebSocket de forma dinámica según el protocolo actual
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${wsProtocol}://${window.location.host}`);
    
    // Debug: Verificar conexión y mensajes de WebSocket
    ws.onopen = () => console.log('WebSocket conectado');
    ws.onmessage = (event) => {
      console.log('Mensaje WebSocket recibido:', event.data); // Debug log
      const { log } = JSON.parse(event.data);
      updateLogs(log);
    };
    ws.onerror = (error) => console.error('Error en WebSocket:', error);
    ws.onclose = () => console.log('WebSocket desconectado');
  
    fetchLogs();
    updateInstances();
  });
  