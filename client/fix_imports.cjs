const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/Hitenrao/.gemini/antigravity/scratch/Smart-Mentor-Connect/client/src';

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let newContent = content.replace(/import\s+React\s+from\s+["']react["'];?\r?\n/g, '');
      newContent = newContent.replace(/import\s+React\s*,\s*{\s*(.*?)\s*}\s*from\s+["']react["'];?/g, "import { $1 } from 'react';");
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

fixImports(directory);
console.log('Fixed imports again');
