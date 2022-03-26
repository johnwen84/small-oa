import { registerDNS, verifyOADocument } from './oa.js';

import express from 'express';

const PORT = process.env.PORT || 3000;
const app = express();

// app.get('/', (req, res) => {
//     const app = ReactDOMServer.renderToString(<App />);
//     const indexFile = path.resolve('./build/index.html');

//     fs.readFile(indexFile, 'utf8', (err, data) => {
//       if (err) {
//         console.error('Something went wrong:', err);
//         return res.status(500).send('Oops, better luck next time!');
//       }

//       return res.send(
//         data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
//       );
//     });
// });

// app.get('/', (req, res) => {
//   const html = `
//       <html lang="en">
//       <head>
//           <script src="app.js" async defer></script>
//       </head>
//       <body>
//           <div id="root"></div>
//       </body>
//       </html>
//   `
//   res.send(html);
// });

app.use(express.json());

app.post('/dns', async (req, res) => {
  const input = req.body;
  const dns = await registerDNS(input.networkId, input.address);

  res.json(dns);
});

app.post('/verify', async (req, res) => {
  const input = req.body;
  const {verified, error} = await verifyOADocument(input);

  if(verified) {
    res.send("Document is verified.")
  }
  res.status(400).send(`Document is not verified. ${error}`);
});

app.use(express.static('./build'));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
