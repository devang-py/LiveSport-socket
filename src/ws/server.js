// helper function -- ensures socket is on
// importing 
import { WebSocket, WebSocketServer } from 'ws';
import { wsArcjet } from './arcjet.js';

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
    const wss = new WebSocketServer({
        server, 
        path: '/ws', // ws reserved by for all live match update
        maxPayload: 1024 * 1024,
    });

    wss.on('connection', async (socket, req) => {
        if (wsArcjet) {
            try {
                const decision = await wsArcjet.protect(req);

                if (decision.isDenied()) {
                    const code = decision.reason.isRateLimit() ? 1013 : 1008;
                    const reason = decision.reason.isRateLimit() ? 'Rate limit exceeded, try again later' : 'Access denied';

                    socket.close(code, reason);
                    return;
                }
            } catch (e) {
                console.error('WS connection error : ', e);
                socket.close();
                return;
            }
        }
        socket.isAlive = true;
        socket.on('pong', () => { socket.isAlive = true; });

        sendJson(socket, { type: 'welcome' });

        socket.on('error', console.error);
    });

    const interval = setInterval(() => {
        wss.clients.forEach(ws => {
            if (ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        });
    }, 3000);

    wss.on('close', () => clearInterval(interval));
    function broadcastMatchCreated(match) {
        broadCast(wss, { type: 'match_created', data: match });
    }

    return { broadcastMatchCreated };
};

