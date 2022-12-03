#
#  Copyright (C) 2021  Roger Lindberg, Rickard Lindberg
#
#  This file is part of TimelineJs.
#
#  TimelineJs is free software: you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.

#  TimelineJs is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with TimelineJs.  If not, see <http://www.gnu.org/licenses/>.
#


try:
    from http import server
except ImportError:
    import SimpleHTTPServer as server # Python 2
import logging


class MyHTTPRequestHandler(server.SimpleHTTPRequestHandler):

    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def end_headers(self):
        self.send_my_headers()
        server.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")

    def do_POST(self):
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself
        print(f'Save {self.path} Received.')
        if self.path.endswith('.cfg') or self.path.endswith('.svg'):
            with open(f".{self.path}", "bw") as f:
                f.write(post_data)
                print(f'.{self.path} saved.')
        else:
            with open(f'.{self.path}.timeline', "bw") as f:
                f.write(post_data)
                print(f'.{self.path}.timeline saved.')
        self._set_response()


if __name__ == '__main__':
    server.test(HandlerClass=MyHTTPRequestHandler)
