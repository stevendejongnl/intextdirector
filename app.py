import argparse
import http.server
import socket
import socketserver
import urllib.parse

import requests


def is_internal_request(response, local_ip, extern_url):
    if response.status_code == 200:
        external_ip = urllib.parse.urlparse(extern_url).hostname
        return local_ip == external_ip
    return False


class NetworkRedirectHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        if 'intern' not in query_params or 'extern' not in query_params:
            self.send_bad_request_response()
            return

        intern_url = query_params['intern'][0]
        extern_url = query_params['extern'][0]
        redirect_url = extern_url

        local_ip = socket.gethostbyname(socket.gethostname())

        response = requests.get(intern_url)
        if is_internal_request(response, local_ip, extern_url):
            redirect_url = intern_url

        self.send_redirect_response(redirect_url)

    def send_bad_request_response(self):
        self.send_response(400)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b"Provide both 'intern' and 'extern' query parameters.")

    def send_redirect_response(self, redirect_url):
        self.send_response(302)
        self.send_header('Location', redirect_url)
        self.end_headers()


def main():
    parser = argparse.ArgumentParser(
        description="Web app to check if the request is from an internal or external network."
    )
    parser.add_argument("--port", type=int, default=8080, help="Port number to run the web server on")
    args = parser.parse_args()

    with socketserver.TCPServer(("", args.port), NetworkRedirectHandler) as httpd:
        print(f"Web server is running on port {args.port}")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
