const { spawn } = require('child_process');

const pingHost = (ip) => {
  return new Promise((resolve) => {
    const args = process.platform === 'win32' ? ['-n', '1', ip] : ['-c', '1', ip];
    const ping = spawn('ping', args, {
      windowsHide: true // Esto evita que se abra la consola en Windows
    });

    let output = '';

    ping.stdout.on('data', (data) => {
      output += data.toString();
    });

    ping.on('close', () => {
      const success = /TTL=|ttl=/.test(output);
      resolve(success);
    });

    ping.on('error', () => resolve(false));
  });
};
 module.exports={pingHost}