require('dotenv').config();
const TURN_ON_ELK_LOG = process.env['TURN_ON_ELK_LOG'] == 'true';
const MACHINE = process.env['MACHINE'];

class Log {
	constructor(sender, tag) {
    this.sender = sender;
    this.tag = tag;
  }
  assert() {
    if (!arguments[0]) {
      this.__log('assert', ...arguments);
    }
  }
  error() {
    this.__log('error', ...arguments);
  }
  debug() {
    this.__log('debug', ...arguments);
  }
  warn() {
    this.__log('warn', ...arguments);
  }
  log() {
    this.__log('info', ...arguments);
  }
  info() {
    this.__log('info', ...arguments);
  }
  __log(level) {
    let message = '';
    let line;
    let func;
    for (let i=1; i<arguments.length; i++, message += ' ') {
      if (arguments[i] == null) {
        message += '(null)';
      } else if (arguments[i] instanceof Error) {
        level = 'error';
        if (arguments[i].stack) {
          let frame = arguments[i].stack.split('\n')[1];
          line = frame ? frame.split(':').reverse()[1] : -1;
          func = frame ? frame.split(' ')[5] : 'unknown';
        }
        message += arguments[i];
      } else if (typeof arguments[i] == 'object') {
        message += JSON.stringify(arguments[i]);
      } else {
        message += arguments[i];
      }
    }
    if (message) {
      if (TURN_ON_ELK_LOG) {
        console[level](JSON.stringify({
          time: new Date().toISOString(),
          level,
          tag: this.tag,
          message: message.trim(),
          class: this.sender,
          line,
          func,
          machine: MACHINE,
        }));
      } else if (level == 'error'){
        const m = `${this.tag.toLowerCase()}___${new Date().toISOString()}___${level.toUpperCase()}___${message.trim()}___${this.sender}`
                + `#${func}:${line}`
                + (MACHINE ? `___${MACHINE}` : '')
        console[level](m);
      } else {
        const m = `${this.tag.toLowerCase()}___${new Date().toISOString()}___${level.toUpperCase()}___${message.trim()}`
                + (MACHINE ? `___${MACHINE}` : '')
        console[level](m);
      }
    }
  }
}

module.exports = function(sender, tag) {
  return new Log(sender, tag);
}