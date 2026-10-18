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
        sendJson(socket, {type: 'welcome'});

        socket.on('error' , console.error);
    })

    function broadcastMatchCreated(match) {
        broadCast(wss, {type:'match_created', data: match});
    }

    return { broadcastMatchCreated };
};

