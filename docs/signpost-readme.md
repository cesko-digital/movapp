* This folder contains a single index.html file (and related resources) with a signpost to all country variants of Movapp.
* It is deployed separately from the main app to `movapp.eu`, and is used as a landing page for the app.
* It uses [GitHub pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages) for deployment (that's why the folder needs to be named `docs` and not something more descriptive).
* It cannot access resources inside the main repository, it is a standalone website, some resource are duplicated.
  * If we ever need something more complex, we can refactor it to be part of the main app but this is good for the first iteration for now. 
* The main app is deployed separately using Vercel in 3 country variants to: 

  - `movapp.cz` - Czech
  - `sk.movapp.eu` - Slovak
  - `pl.movapp.eu` - Polish