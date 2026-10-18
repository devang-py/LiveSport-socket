// helper function -- ensures socket is on
// importing 
import { WebSocket, WebSocketServer } from 'ws';

export const sendJson = (socket, payload) => {
    if (socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(payload));
};

//here wss is a parameter which will take websocketserver as input
export const broadCast = (wss, payload) => {
    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;
        client.send(JSON.stringify(payload));
    }
};

export function attachWebSocketServer(server) {
    const wss= new WebSocketServer({
        server, 
        path:'/ws',//ws reserved by for all live match update
        maxPayload: 1024*1024,
    });

    wss.on('connection' , (socket)=> {
        socket.isAlive= true;
        socket.on('pong', () => { socket.isAlive= true });

        sendJson(socket, {type: 'welcome'});

        socket.on('error' , console.error);
    })

    const interval = setInterval(() => {
        wss.clients.forEach(ws => {
            if(ws.isAlive === false) return ws.terminate();
            ws.isAlive =false;
            ws.ping();
        });
    }, 3000);

    ws.on('close' , () => clearInterval(interval));
    function broadcastMatchCreated(match) {
        broadCast(wss, {type:'match_created', data: match});
    }

    return { broadcastMatchCreated };
};

