export const renderErrorPage = () => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FLIXR error</title>
    <style>
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #020617; color: #fff; }
      main { min-height: 100vh; display: grid; place-items: center; padding: 2rem; text-align: center; }
      h1 { margin: 0 0 .5rem; font-size: clamp(2rem, 5vw, 4rem); }
      p { margin: 0; color: rgba(255,255,255,.7); max-width: 40rem; }
    </style>
  </head>
  <body>
    <main>
      <div>
        <h1>Something went wrong</h1>
        <p>Please reload the page or try again in a moment.</p>
      </div>
    </main>
  </body>
</html>`;