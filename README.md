# Web Technology Practicals

This repository contains practical assignments for the Web Technology course used for learning and experiments with front-end and simple back-end web technologies.

## What I'll do in this update
- Preserve the original overview and expand it with setup, per-practical notes, quick-start instructions, and contribution/licensing information so the repository is easier to use.

## Structure (high level)

- Practical 1: Registration form and table (HTML, CSS, JS)
- Practical 2: Administrator page (HTML)
- Practical 3: Company data (XML)
- Practical_4: Home page and registration (HTML, Java + WEB-INF)
- Practical_6: Registration with PHP (HTML, PHP)
- Practical_7: Simple web app (HTML, CSS, JS)
- Practical_8: Gallery and interactive pages (HTML, images)

## Quick start

1. Open the repository folder in your file explorer or code editor.
2. For static pages (HTML/CSS/JS) just open the HTML file in your browser. On Windows you can:

```powershell
# example: open Practical_8 index page
Start-Process "d:\PES\Sem\SEM 7\Web Technology\Practical_8\index.html"
```

3. For PHP pages use a local server (XAMPP, WampServer, MAMP). Put the repository (or the specific practical) inside the server's document root (for XAMPP: htdocs) and start Apache+MySQL.

4. For Java web (Servlet/JSP) use a servlet container such as Apache Tomcat. Deploy the `Practical_4` webapp folder (the folder that contains `WEB-INF`) as a WAR or copy it to Tomcat's `webapps` directory.

## Per-practical notes (files found in the workspace)

- Practical 1
	- `register.html`, `register.css`, `register.js`, `table.html` — registration UI and client-side behaviour.
- Practical 2
	- `Administartor.html` — administrator page (note: filename contains a typo `Administartor.html`).
- Practical 3
	- `company.xml` — XML data example.
- Practical_4
	- `home.html`, `Register.java`, `WEB-INF/web.xml`, `WEB-INF/lib/` — Java web / servlet example.
- Practical_6
	- `index.html`, `register.php` — PHP-based registration example.
- Practical_7
	- `index.html`, `app.js`, `style.css` — small web app with JS and styles.
- Practical_8
	- `index.html`, `abhi.html`, `img/` — gallery and images (examples: `cook.jpg`, `fresh_pastries.jpg`, ...).

If you want, I can add a short README inside each Practical folder with specific run/view instructions for that practical.

## Running server-side examples (quick)

- PHP (XAMPP)
	1. Install XAMPP (https://www.apachefriends.org).
	2. Copy the practical folder (for example `Practical_6`) into `C:\xampp\htdocs\`.
	3. Start Apache from XAMPP Control Panel.
	4. Visit http://localhost/Practical_6/index.html or http://localhost/Practical_6/register.php

- Java (Tomcat)
	1. Install Apache Tomcat appropriate for your JDK.
	2. Package `Practical_4` as a WAR or copy the folder into Tomcat's `webapps` directory.
	3. Start Tomcat and visit http://localhost:8080/YourAppContext/

## Viewing coverage reports

Some practice folders include a `coverage/` directory. Open the `index.html` inside that folder in your browser to view the generated coverage report (if present).

## Contributing / Notes

- This repository appears to be for learning—feel free to:
	- Clean up filenames (e.g., `Administartor.html` -> `Administrator.html`)
	- Add documentation per practical
	- Add sample data and screenshots

- If you want me to:
	- Create per-practical READMEs, I can add them automatically.
	- Fix typos and small issues, I can propose changes and run quick checks.

## License

This repository does not include a license file. If you want to share this project publicly, tell me which license you prefer (MIT, Apache-2.0, GPL-3.0, etc.) and I'll add `LICENSE` and a short header to each file.

## Author / Contact

ShubhamG2004

---

If you'd like, I can now:
- Add individual README.md files inside each `Practical_*` folder with run instructions, or
- Add a LICENSE file (specify which), or
- Fix the filename typo in `Practical 2` (`Administartor.html`) and update references.
Tell me which of these you'd like next and I'll implement it.