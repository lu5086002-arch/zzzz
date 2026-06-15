import fs from 'fs';
import path from 'path';

const srcDir = '/ai-commerce-os (35)';
const destDir = '/';

function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  if (!exists) return;
  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(childItemName => {
      // Skip node_modules or .git if any
      if (childItemName === 'node_modules' || childItemName === '.git') return;
      copyRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    // Prevent infinite loop if script is running in src
    if (path.basename(src) === 'copy-project.js') return;
    
    // Create parent directory of destination if not exists
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

try {
  copyRecursive(srcDir, destDir);
  console.log("Successfully copied all files from /ai-commerce-os (35) to /");
} catch (error) {
  console.error("Error during copy:", error);
}
