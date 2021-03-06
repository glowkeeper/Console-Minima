/** @class Smtp */
class Smtp {
  static readonly token = 'bcffc60c-e73d-4e79-9611-a5349751fd8c'
}

/** @class Dbase */
class Dbase {
  static readonly tables = {
    action: {
      name: 'action',
    },
    txpow: {
      name: 'txpow',
    },
    log: {
      name: 'log',
    },
    logType: {
      name: 'logtype',
    },
    trigger: {
      name: 'trigger',
    },
    url: {
      name: 'url',
    },
  };

  static readonly logTypes = {
    ACTION: 'Action',
    TXPOW: 'TxPoW',
    TRIGGER: 'Trigger',
    URL: 'URL',
  };
}

export {Smtp, Dbase};
