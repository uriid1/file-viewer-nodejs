import fs from 'node:fs';
import querystring from 'node:querystring';
import { extname } from 'node:path';
import mime from 'mime';

const readAudioStream = async (req, res) => {
  // Обработка query строки
  const queryMatch = req.url.match(/\?(.*)/);

  if (!queryMatch) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('Не правильно переданы параметры');
    return;
  }

  const query = querystring.parse(queryMatch[1]);

  // Размере видеофайла
  const fileSize = fs.statSync(query.path).size;

  // HTTP диапазон из заголовка Range, если он есть
  const rangeHeader = req.headers.range;
  let start = 0;
  let end = fileSize - 1;

  if (rangeHeader) {
    const range = req.headers.range;
    if (!range) {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('Requires Range header');
      return;
    }

    const CHUNK_SIZE = 10 ** 6;
    start = Number(range.replace(/\D/g, ""));
    end = Math.min(start + CHUNK_SIZE, fileSize - 1);
  }

  // Mime type
  const mimeType = await mime.getType(extname(query.path));

  // Открываем поток для чтения видеофайла с указанными диапазонами
  const stream = fs.createReadStream(query.path, { start, end });
  // Стримим видеофайл на клиент
  stream.pipe(res);

  // Устанавливаем заголовки для указания типа контента и длины контента
  return res.writeHead(206, {
    'Content-Type': mimeType,
    'Content-Length': end - start + 1,
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Security-Policy': 'upgrade-insecure-requests; default-src https:',
    'Content-Security-Policy-Report-Only': 'default-src https:; report-uri /endpoint'
  });
}
 
export default readAudioStream;
