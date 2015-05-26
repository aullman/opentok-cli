#!/usr/bin/env node

var args = require('args'),
  options = args.Options.parse([
    {
      name: 'apikey',
      shortName: 'a',
      help: 'An OpenTok API Key'
    },
    {
      name: 'secret',
      shortName: 's',
      help: 'An OpenTok API Secret'
    },
    {
      name: 'role',
      shortName: 'r',
      help: 'Optional role to assign to the token, one of moderator, publisher or subscriber',
      defaultValue: 'moderator'
    },
    {
      name: 'expires',
      shortName: 'e',
      type: 'int',
      help: 'Optional expire time for the token in milliseconds (30 days from now by default)'
    }
  ]),
  opts = args.parser(process.argv).parse(options),
  OpenTok = require('opentok'),
  apiKey = opts.apikey,
  secret = opts.secret,
  session = opts.session;

if (!apiKey || !secret) {
  errorMessage();
  return;
}

var opentok = new OpenTok(apiKey, secret);
opentok.createSession(function (err, session) {
  if (err) {
    errorMessage(err);
    return;
  }
  var token = session.generateToken({
    role: opts.role,
    expireTime : opts.expires || (new Date().getTime() / 1000)+(30 * 24 * 60 * 60), // in 30 days
  });

  console.info('sessionId: ', session.sessionId);
  console.info('token: ', token);
});


function errorMessage(err) {
  if (err) {
    if (err.stack) {
        console.error(err.stack);
    }
    else {
        console.error(String(err));
    }
  }
  console.error(options.getHelp());
  process.exit(1);
}

