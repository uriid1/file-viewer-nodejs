import fs from 'node:fs';
import { unescape } from 'node:querystring';
import readDir from '~/fs/readDir.js';
import readContent from '~/routes/readContent.js';
import fstring from '~/utils/fstring.js';

const config = JSON.parse(fs.readFileSync('src/config.json',
  { encoding: 'utf8', flag: 'r' })
);

// Шаблон просмотрщика
let TEMPLATE_BROWSER = fs.readFileSync('./src/source/fmtBrowser.html',
  { encoding: 'utf8', flag: 'r' }
);

// Шаблон элементов
const TEMPLATE_BLOCK = `
<a href="$path" class="$classItem">
  <img src="$icon" onerror="this.src='/source/img/file.png'">
  <p>$name</p>
</a>
`

// Обработчик просмотрщика
const readBrowser = async (req, res) => {
  // Обработка путей
  const match = req.url.match(/.*\/browser\/(.*?)$/);
  const subPath = unescape(match ? match[1] : '');
  const path = config.path + subPath;

  // Проверка что открываем
  const stats = fs.statSync(path);

  // Обработчик файлов
  if (stats.isFile()) {
    req.filepath = path;
    return await readContent(req, res);
  }

  // Парсинг директории
  const data = await readDir(path);

  // Обработка 500 ошибки
  if (data === undefined) {
    res.writeHead(500, { 'Content-Type': 'text' });
    res.end('Server Error 500');
    return;
  }

  let link = '/'
  if (subPath == '') {
    link = 'browser/';
  } else {
    link = '/browser/' + subPath + '/'
  }

  let blocks = '';
  for (let i = 0; i < data.length; i++) {
    const curBlock = data[i];
    let block = fstring(TEMPLATE_BLOCK, {
      path: link + curBlock.name,
      classItem: 'item',
      name: curBlock.name
    })

    if (curBlock.is_dir) {
      block = fstring(block, {icon: '/source/img/folder.png'})
    } else if (
      (curBlock.mimetype == 'video/mp4') ||
      (curBlock.mimetype == 'video/webm')
    ) {
      // Установка превью для видео
      const fullPath = path + '/' + curBlock.name;
      const preview = fullPath.replace(/\.\w+$/, '.jpg');
      if (fs.existsSync(preview)) {
        block = fstring(block, {icon: `/static/` + preview});
      } else {
        block = fstring(block, {icon: `/source/img/video.png`})
      }
    } else {
      const match = curBlock.mimetype?.match(/(.+)\//);
      const part = match ? match[1] : '';
      block = fstring(block, {icon: `/source/img/${part || 'file'}.png`})
    }

    blocks += block;
  }

  const page = fstring(TEMPLATE_BROWSER, {
    path: subPath,
    content: blocks
  });

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(page);
}

export default readBrowser;
