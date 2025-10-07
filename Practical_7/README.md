
# AngularJS Registration & Login SPA (AngularJS 1.x)

Description

Simple single-page application using AngularJS (1.x) demonstrating a registration form (first name, last name, username, password) and a login form. All data is stored in-memory in the browser session (no backend). Refreshing the page clears registered users.

Files

- `index.html` — main page
- `app.js`     — AngularJS module and controller
- `style.css`  — simple styles

Run

Open `index.html` in your browser (Chrome, Edge, Firefox). Because this is only client-side, no server is required. If your browser blocks local file script execution, serve the folder with a simple static server (Python, Node, VS Code Live Server).

Example commands (PowerShell) to serve locally from this folder:

```powershell
# If you have Python 3 installed
python -m http.server 8000

# Or using Node (serve package)
# npx serve -l 8000
```

Then open the server URL (for example, <http://localhost:8000>) in your browser.

Notes

- This is educational — AngularJS is end-of-life. For production apps, use modern frameworks (Angular 2+, React, Vue).
- Data is not persisted. To add persistence, you can extend the app to use `localStorage` or a backend API.
