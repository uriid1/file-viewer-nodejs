import fs from 'node:fs';
import { extname } from 'node:path';
import { unescape } from 'node:querystring';
import mime from 'mime';

const config = JSON.parse(fs.readFileSync('src/config.json',
  { encoding: 'utf8', flag: 'r' })
);

// Получение статических фалов из заданного пути
const readStatic = async (req, res) => {
  const match = unescape(req.url).match(/.*\/static\/(.*?)$/);
  const filepath = match ? match[1] : '';

  // Читаем изображение из файловой системы
  fs.readFile(filepath, (err, data) => {
    if (err) {
      console.log(err)

      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('File not found');
      return;
    }

    // MIME-тип изображения
    const contentType = mime.getType(extname(filepath));

    res.writeHead(200, {'Content-Type': contentType});
    res.end(data);
  });
}
 
export default readStatic;
