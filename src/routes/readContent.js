import fs from 'node:fs';
import { extname } from 'node:path';
import mime from 'mime';
import fstring from '~/utils/fstring.js';

const config = JSON.parse(fs.readFileSync('src/config.json',
  { encoding: 'utf8', flag: 'r' })
);

// Шаблон видео-просмотрщика
let TEMPLATE_VIDEO = fs.readFileSync('./src/source/fmtVideo.html',
  { encoding: 'utf8', flag: 'r' }
);

// Шаблон просмотрщика-изображений
let TEMPLATE_IMAGE = fs.readFileSync('./src/source/fmtImage.html',
  { encoding: 'utf8', flag: 'r' }
);

// Шаблон аудио-плеера
let TEMPLATE_AUDIO = fs.readFileSync('./src/source/fmtAudio.html',
  { encoding: 'utf8', flag: 'r' }
);

// Просмотрщик контента
const readContent = async (req, res) => {
  const mimetype = mime.getType(extname(req.filepath));

  if (mimetype == null) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('Server Error. Not read mime');
    return;
  }

  // Релевантный путь
  const relativePath = req.filepath.replace(config.path, '');

  // Получение типа
  const match = mimetype.match(/(.+)\//);
  const type = match ? match[1] : '';

  if (type == 'video') {
    // Установка превью
    const preview = req.filepath.replace(/\.\w+$/, '.jpg');

    const page = fstring(TEMPLATE_VIDEO, {
      filepath: `/videoStream?path=${req.filepath}`,
      filename: relativePath,
      mime: mimetype,
      preview: '/static/' + preview,
      description: 'Без описания.'
    });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(page);
  } else if (type == 'image') {
    const page = fstring(TEMPLATE_IMAGE, {
      filepath: '/static/' + req.filepath,
      filename: relativePath,
      description: 'Без описания.'
    });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(page);
  } else if (type == 'audio') {
    const page = fstring(TEMPLATE_AUDIO, {
      filepath: `/videoStream?path=${req.filepath}`,
      filename: relativePath,
      mime: mimetype,
      description: 'Без описания.'
    });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(page);
  }
}

export default readContent;
