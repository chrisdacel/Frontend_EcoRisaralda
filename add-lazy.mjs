import fs from 'fs';
import path from 'path';

const srcDir = 'src';

function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

function optimizeImages() {
  const allFiles = getFilesRecursively(srcDir);
  let count = 0;
  for (const file of allFiles) {
    if (/\.(jsx|tsx)$/i.test(file)) {
      let content = fs.readFileSync(file, 'utf8');
      let updated = false;
      
      // find <img that does not contain loading= inside the tag
      const regex = /<img\s+(?![^>]*loading\s*=)[^>]*>/gi;
      
      content = content.replace(regex, (match) => {
         updated = true;
         // return '<img loading="lazy" ' + match.substring(match.indexOf('<img') + 4).trimStart();
         // Safer:
         return match.replace(/<img/i, '<img loading="lazy"');
      });
      
      if (updated) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`Added loading="lazy" to ${file}`);
      }
    }
  }
  console.log(`Updated images in ${count} files.`);
}

optimizeImages();
