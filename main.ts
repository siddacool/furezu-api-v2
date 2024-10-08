import { Application } from 'jsr:@oak/oak/application';
import { Router } from 'jsr:@oak/oak/router';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';

const port = 8080;

const router = new Router();
router
  .get('/', oakCors(), (context) => {
    context.response.body = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <h1>Furezu API</h1>
          <ul>
            <li><a href="library">Library</a></li>
            <li><a href="library-cache-version">Library cache version</a></li>
          </ul>
        </body>
      </html>
    `;
  })
  .options('/library', oakCors())
  .get('/library', oakCors(), async (context) => {
    await context.send({
      root: `${Deno.cwd()}/library.json`,
      path: '',
    });
  })
  .options('/library-cache-version', oakCors())
  .get('/library-cache-version', oakCors(), async (context) => {
    const libraryFileVersion = await Deno.readTextFile('library.version.txt');

    context.response.body = `${libraryFileVersion} - ${new Date(
      Number(libraryFileVersion),
    )}`;
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', () => {
  console.log(`Listening on localhost:${port}`);
});

await app.listen({ port });
