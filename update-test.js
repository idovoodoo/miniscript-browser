const fs = require('fs'); const path = require('path'); const originalContent = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8'); const newContent = originalContent.replace(/fetch\('tests\/.*?\.ms'\)/g, \
fetch
tests/test-map.ms
\); fs.writeFileSync(path.join(__dirname, 'game.js'), newContent, 'utf8'); console.log('Updated game.js to use test-map.ms');
