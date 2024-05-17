import fs from 'node:fs';
import { extname } from 'node:path';
import mime from 'mime';

// Получение статических фалов из /source
const readSource = async (req, res) => {
  const filepath = './src' + req.url;

  // Читаем изображение из файловой системы
  fs.readFile(filepath, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('File not found');
      return;
    }

    // MIME-тип изображения
    const mimetype = mime.getType(extname(filepath));
    res.writeHead(200, {'Content-Type': mimetype});
    res.end(data);
  });
}
 
export default readSource;
