document.addEventListener('DOMContentLoaded', () => {
  const logsContainer = document.getElementById('logs-container');
  const instanceList = document.getElementById('instance-list');
  const clockDisplay = document.getElementById('clock');
  const wsProtocol = location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${wsProtocol}://${location.host}`);

  ws.onmessage = (event) => {
    const { log } = JSON.parse(event.data);
    logsContainer.textContent += log + '\n';
    logsContainer.scrollTop = logsContainer.scrollHeight;
  };

  async function updateInstances() {
    const response = await fetch('/instances');
    const instances = await response.json();
    instanceList.innerHTML = '';
    
    instances.forEach(({ host, port }) => {
      const item = document.createElement('li');
      
      const link = document.createElement('a');
      link.href = `http://${host}:${port}`;
      link.textContent = `Host: ${host}, Port: ${port}`;
      link.target = '_blank';
      link.title = 'Ir a la instancia';
  
      item.appendChild(link);
      instanceList.appendChild(item);
    });
  }  

  async function updateClock() {
    try {
      const response = await fetch('/worldtime');
      if (response.ok) {
        const data = await response.json();
        const datetime = new Date(data.datetime);
        const formattedTime = datetime.toLocaleTimeString('en-GB', { hour12: false });
        clockDisplay.textContent = formattedTime;
      } else {
        clockDisplay.textContent = 'Error al obtener la hora';
        console.error('Error al hacer fetch:', response.statusText);
      }
    } catch (error) {
      clockDisplay.textContent = 'Error al obtener la hora';
      console.error('Error de conexión:', error);
    }
  }

  async function launchInstance() {
    const response = await fetch('/launch', { method: 'POST' });
    logsContainer.textContent += await response.text() + '\n';
    await updateInstances();
  }

  async function syncClocks() {
    const response = await fetch('/sync-clocks', { method: 'POST' });
    const { message } = await response.json();
    logsContainer.textContent += message + '\n';
  }

  document.getElementById('launch-instance').onclick = launchInstance;
  document.getElementById('sync-clocks').onclick = syncClocks;
  
  updateInstances(); 
  updateClock();
  setInterval(updateClock, 50000);
});
