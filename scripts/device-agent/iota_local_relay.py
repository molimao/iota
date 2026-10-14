import select
import socket
import socketserver
import time

HOST = '127.0.0.1'
PORT = 18010
BACKEND_PORT = 8010


class Relay(socketserver.BaseRequestHandler):
    def handle(self):
        client = self.request
        client.settimeout(10)
        request = b''
        while b'\r\n\r\n' not in request:
            part = client.recv(8192)
            if not part:
                return
            request += part
            if len(request) > 65536:
                return
        line = request.split(b'\r\n', 1)[0].split()
        if len(line) != 3 or line[0] != b'GET':
            return
        path = line[1].split(b'?', 1)[0]
        if path not in (b'/health', b'/ws'):
            client.sendall(b'HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n')
            return
        # Forward only a real backend response; never manufacture healthy status.
        deadline = time.monotonic() + 180
        backend = None
        while time.monotonic() < deadline:
            try:
                backend = socket.create_connection((HOST, BACKEND_PORT), timeout=1)
                break
            except OSError:
                ready, _, _ = select.select([client], [], [], .3)
                if ready and not client.recv(1, socket.MSG_PEEK):
                    return
        if backend is None:
            client.sendall(b'HTTP/1.1 503 Service Unavailable\r\nContent-Length: 0\r\nConnection: close\r\n\r\n')
            return
        # Preserve the complete request, including the original authentication token.
        # No request URLs, headers, tokens, or payloads are logged.
        try:
            backend.sendall(request)
            backend.settimeout(None)
            client.settimeout(None)
            while True:
                ready, _, _ = select.select([client, backend], [], [], 60)
                for source in ready:
                    data = source.recv(65536)
                    if not data:
                        return
                    (backend if source is client else client).sendall(data)
        except (OSError, ValueError):
            return
        finally:
            backend.close()


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == '__main__':
    with Server((HOST, PORT), Relay) as server:
        server.serve_forever()
