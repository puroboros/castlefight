const connection = new EventSource('http://localhost:666/game');
connection.onmessage = (event) => {
    console.log('I\'ve received this event: ' + event.data);
};
