// Test-only instrumentation: observe the actual driver's close during shutdown.
import Database from 'better-sqlite3';
let stopping = false;
const close = Database.prototype.close;
Database.prototype.close = function () {
  const result = close.call(this);
  if (stopping && process.connected) {
    process.send('db-closed');
    process.disconnect();
  }
  return result;
};
process.on('message', (message) => {
  if (message === 'shutdown') {
    stopping = true;
    process.emit('SIGTERM');
  }
});
await import('../dist/index.js');
