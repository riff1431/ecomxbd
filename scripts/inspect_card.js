const http = require('http');

http.get('http://localhost:3001', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const heartMatches = data.match(/<button[^>]*aria-label="Add to wishlist"[^>]*>[\s\S]*?<\/button>/g);
    console.log('Heart buttons count:', heartMatches ? heartMatches.length : 0);
    if (heartMatches) {
      console.log('First heart button:', heartMatches[0]);
    }
    // Also check if there's any other button with Heart or SVG
    const allButtons = data.match(/<button[^>]*>[\s\S]*?<\/button>/g);
    console.log('Total buttons on page:', allButtons ? allButtons.length : 0);
  });
});
