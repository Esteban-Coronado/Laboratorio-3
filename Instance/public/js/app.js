fetch('/instance-info')
    .then(response => response.json())
    .then(data => {
        const instanceInfo = `${data.host}`;
        document.getElementById('instance-info').textContent = instanceInfo;

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
    })
    .catch(error => {
        console.error('Error fetching instance info:', error);
    });
