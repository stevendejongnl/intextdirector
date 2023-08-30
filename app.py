import argparse
import http.server
import socketserver
import urllib.parse
from typing import Optional

import requests


def is_internal_reachable(intern_url: str) -> bool:
    try:
        response = requests.get(intern_url, timeout=5)
        return response.status_code == 200
    except requests.RequestException:
        return False


def determine_redirect_url(intern_url: str, extern_url: str, debug: Optional[str]) -> str:
    internal_reachable = is_internal_reachable(intern_url)

    if debug:
        print(f"Debug mode: internal={intern_url}, external={extern_url}, internal_reachable={internal_reachable}")
        return intern_url

    if internal_reachable:
        return intern_url
    else:
        return extern_url


class NetworkRedirectHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        if 'intern' not in query_params or 'extern' not in query_params:
            self.send_bad_request_response()
            return

        intern_url = query_params['intern'][0]
        extern_url = query_params['extern'][0]

        debug = query_params.get('debug', [''])[0]
        redirect_url = determine_redirect_url(intern_url, extern_url, debug)

        if not debug:
            self.send_redirect_response(redirect_url)

    def send_bad_request_response(self):
        self.send_response(400)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b"Provide both 'intern' and 'extern' query parameters.")

    def send_redirect_response(self, redirect_url: str):
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
