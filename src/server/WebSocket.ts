Bun.serve({
    fetch(req, server) {
        // Пытаемся обновить HTTP-соединение до WebSocket
        if (server.upgrade(req)) {
            // Если обновление прошло успешно, больше ничего не возвращаем
            return;
        }
        // Если обновление не удалось, возвращаем ошибочный ответ
        return new Response('Upgrade failed', { status: 500 });
    },
    websocket: {
        message(ws, message) {}, // a message is received
        open(ws) {}, // a socket is opened
        close(ws, code, message) {}, // a socket is closed
        drain(ws) {}, // the socket is ready to receive more data
    },
});
