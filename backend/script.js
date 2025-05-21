// Add this code to a file and run with node:
const bcrypt = require('bcrypt');

async function generateHashes() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('password123', 10);

  console.log('Admin hash:', adminHash);
  console.log('User hash:', userHash);
}

generateHashes();