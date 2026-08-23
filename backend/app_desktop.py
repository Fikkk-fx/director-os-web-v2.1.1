"""
ZERO CINEMA — PORTABLE DESKTOP GUI STUDIO (V20.8)
Runs the complete FastAPI server in a background thread and opens a native
hardware-accelerated desktop window using WebView2.
Preserves 100% of the UI/UX design, real-time SSE token streaming, and cinema aesthetics.
"""

import sys
import os
import time
import threading
import socket
import uvicorn
import webview

def find_free_port(default_port=8000):
    """Finds an available local port."""
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.bind(("127.0.0.1", default_port))
        s.close()
        return default_port
    except OSError:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(("127.0.0.1", 0))
        port = s.getsockname()[1]
        s.close()
        return port

def run_backend(port):
    """Starts the FastAPI backend inside a background thread."""
    from server import app
    config = uvicorn.Config(app, host="127.0.0.1", port=port, log_level="warning")
    server = uvicorn.Server(config)
    server.run()

def wait_for_server(port, timeout=10):
    """Waits until the backend is reachable."""
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect(("127.0.0.1", port))
            s.close()
            return True
        except (ConnectionRefusedError, OSError):
            time.sleep(0.1)
    return False

def main():
    port = find_free_port(8000)
    
    # 1. Start backend server thread
    backend_thread = threading.Thread(target=run_backend, args=(port,), daemon=True)
    backend_thread.start()
    
    # 2. Wait for backend to be ready
    if not wait_for_server(port):
        print(f"[ERROR] Failed to start local server on port {port}")
        sys.exit(1)
        
    url = f"http://127.0.0.1:{port}"
    
    # 3. Create native standalone desktop window
    window = webview.create_window(
        title="ZERO CINEMA — MONOCHROME DIRECTORS STUDIO",
        url=url,
        width=1240,
        height=860,
        min_size=(920, 640),
        background_color="#07090e",
        text_select=True,
        zoomable=True
    )
    
    # 4. Start GUI event loop
    webview.start(private_mode=False, debug=False)

if __name__ == "__main__":
    main()
