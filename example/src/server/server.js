import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../universal/app';
import { getDevServerBundleUrl } from '../../../lib';
import webpackClientConfig from '../../webpack.config.client';

const PORT = 3000;
const app = Express();
const devServerBundleUrl = getDevServerBundleUrl(webpackClientConfig);

app.use('/dist', Express.static('dist', { maxAge: '1d' }));

app.use((req, res) => {
  const html = `<!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Universal Hot Reload</title>
                      </head>
                      <body>
                        <div id="reactDiv">${renderToString(
                          <StaticRouter location={req.url} context={{}}>
                            <App />
                          </StaticRouter>,
                        )}</div>
                        <script type="application/javascript" src="${devServerBundleUrl}"></script>
                      </body>
                    </html>`;

  res.end(html);
});

// export httpServer object so universal-hot-reload can access it
export default app.listen(PORT, () => {
  console.log(`Example app listening at ${PORT}...`);
});
