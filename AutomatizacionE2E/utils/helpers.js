function uniqueEmail(prefix = 'qa') {
    const ts = new Date().toISOString().replace(/[-:.TZ]/g, '');
    return `${prefix}.${ts}@example.com`;
  }
  
  module.exports = { uniqueEmail };