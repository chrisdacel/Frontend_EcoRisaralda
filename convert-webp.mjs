import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicImagesDir = 'public/images';
const srcDir = 'src';

// Recursively get all files in a directory
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

// Convert all images to webp
async function convertImages() {
  const allFiles = getFilesRecursively(publicImagesDir);
  
  for (const file of allFiles) {
    if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const ext = path.extname(file);
      const outputName = file.substring(0, file.lastIndexOf(ext)) + '.webp';
      
      try {
        await sharp(file)
          .webp({ quality: 80 })
          .toFile(outputName);
          
        fs.unlinkSync(file); // Remove original
        console.log(`Converted: ${path.basename(file)} -> ${path.basename(outputName)}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
      }
    }
  }
}

// Replace references in source files
function replaceReferences() {
  const srcFiles = getFilesRecursively(srcDir);
  let filesUpdated = 0;
  
  for (const file of srcFiles) {
    if (/\.(jsx|js|ts|tsx|css)$/i.test(file)) {
      let content = fs.readFileSync(file, 'utf8');
      
      // Match image reference extensions in src strings/imports that correspond to our public/images paths.
      // But actually, replacing every .jpg, .jpeg, .png inside standard src might be safe if there are no external links.
      // To be safe, look for anything matching /images/.*.(png|jpg|jpeg)/i
      const regex = /(\/images\/[^"'\`]+\.(?:png|jpg|jpeg))/gi;
      
      if (regex.test(content)) {
        const newContent = content.replace(regex, (match) => {
          return match.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        });
        
        fs.writeFileSync(file, newContent, 'utf8');
        filesUpdated++;
        console.log(`Updated references in ${path.basename(file)}`);
      }
    }
  }
  
  // also check if index.html has references
  const indexHtml = path.join(process.cwd(), 'index.html');
  if (fs.existsSync(indexHtml)) {
    let content = fs.readFileSync(indexHtml, 'utf8');
    const regex = /(\/images\/[^"'\`]+\.(?:png|jpg|jpeg))/gi;
    if(regex.test(content)) {
        content = content.replace(regex, (match) => match.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
        fs.writeFileSync(indexHtml, content, 'utf8');
        filesUpdated++;
    }
  }

  console.log(`Total source files updated: ${filesUpdated}`);
}

async function run() {
  console.log('Starting conversion to WebP...');
  await convertImages();
  console.log('Finished conversion! Now updating references...');
  replaceReferences();
  console.log('Optimization complete!');
}

run();
