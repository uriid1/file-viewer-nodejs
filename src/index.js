import http from 'node:http';
import fs from 'node:fs';
import { unescape } from 'node:querystring';

// Обработчики
import readBrowser from '~/routes/readBrowser.js';
import readSource from '~/routes/readSource.js';
import readStatic from '~/routes/readStatic.js';
import readVideoStream from '~/routes/readVideoStream.js';
import readAudioStream from '~/routes/readVideoStream.js';

const routes = {
  'browser': {
    'GET': readBrowser
  },
  'source': {
    'GET': readSource
  },
  'static': {
    'GET': readStatic
  },
  'videoStream': {
    'GET': readVideoStream
  },
  'audioStream': {
    'GET': readAudioStream
  }
}

const config = JSON.parse(fs.readFileSync('src/config.json',
  { encoding: 'utf8', flag: 'r' })
);

const notFound = (res) => {
  res.writeHead(404, { 'Content-Type': 'text' });
  res.end('Not Found');
}

const serverError = (res) => {
  res.writeHead(500, { 'Content-Type': 'text' });
  res.end('Server error');
}

// Обработчик запросов
const handler = async (req, res) => {
  const match = req.url.match(/\/(\w+)/);
  const route = match ? match[1] : null;
  console.log(`Route [${req.method}]: ${unescape(req.url)}`)

  try {
    if ((!routes[route]) || (!routes[route][req.method])) {
      return notFound(res);
    }

    return await routes[route][req.method](req, res);
  } catch (err) {
    console.error(err);
    return serverError(res);
  }

  return notFound(res);
}

// Сервер
const server = http.createServer(handler);

server.listen(config.server.listen, (err) => {
  if (err) {
    console.error(err);

    return process.exit(1);
  }

  console.info(`Server listening on port ${config.server.listen.port}`);
});
