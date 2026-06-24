const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoDir = '/home/chrsdorg/repositories/chrsd-websitev2';
const publicDir = '/home/chrsdorg/public_html';

console.log('Starting Astro build...');

try {
  // Run the build
  execSync('npm run build', {
    cwd: repoDir,
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('Build complete. Copying files...');
  
  // Copy dist to public_html
  execSync('cp -rf ' + path.join(repoDir, 'dist', '.') + ' ' + publicDir + '/', {
    stdio: 'inherit'
  });
  
  console.log('Deployment complete!');
  process.exit(0);
} catch (err) {
  console.error('Deployment failed:', err.message);
  process.exit(1);
}
