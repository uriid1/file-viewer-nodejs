import fs from 'node:fs';
import { join, extname } from 'node:path';
import mime from 'mime';

const readDir = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        return reject(err);
      }

      let data = []
      files.forEach((file) => {
        // Пропуск скрытых файлов
        if (file[0] == '.') {
          return;
        }

        const filePath = join(path, file);
        const stats = fs.statSync(filePath);
        const isDir = stats.isDirectory();

        let mimetype;
        if (isDir === false) {
          const _extname = extname(filePath);
          if (_extname) {
            mimetype = mime.getType(_extname);
          }
        }

        data.push({
          name: file,
          is_dir: isDir,
          mimetype: mimetype
        })
      });

      // is_dir: true должен быть первым
      data.sort((a, b) => {
        if (a.is_dir) {
          return -1;
        }

        return 0;
      });

      return resolve(data);
    });
  });
} 

export default readDir;