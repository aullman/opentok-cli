#!/usr/bin/env node

var args = require('args'),
  options = args.Options.parse([{
    name: 'apikey',
    shortName: 'a',
    help: 'An OpenTok API Key'
  }, {
    name: 'secret',
    shortName: 's',
    help: 'An OpenTok API Secret'
  }, {
    name: 'role',
    shortName: 'r',
    help: 'Optional role to assign to the token, one of moderator, publisher or subscriber',
    defaultValue: 'moderator'
  }, {
    name: 'expires',
    shortName: 'e',
    type: 'int',
    help: 'Optional expire time for the token in milliseconds (30 days from now by default)'
  }, {
    name: 'p2p',
    shortName: 'p',
    type: 'bool',
    help: 'Whether this session should be a relayed (p2p) session or a routed session'
  }, {
    name: 'sessionId',
    shortName: 'i',
    help: 'Optional sessionId parameter to generate a token for'
  }, {
    name: 'code',
    shortName: 'c',
    type: 'bool',
    help: 'Optional whether to output a code snippet'
  }]),
  opts = args.parser(process.argv).parse(options),
  OpenTok = require('opentok'),
  apiKey = opts.apikey,
  secret = opts.secret,
  sessionId = opts.sessionId;

if (!apiKey || !secret) {
  errorMessage();
  return;
}

var opentok = new OpenTok(apiKey, secret);

if (!sessionId) {
  createSessionId(generateToken);
} else {
  generateToken(sessionId);
}

function createSessionId(cb) {
  opentok.createSession({
    mediaMode: opts.p2p ? 'relayed' : 'routed'
  }, function (err, session) {
    if (err) {
      errorMessage(err);
    } else {
      cb(session.sessionId);
    }
  });
}

function generateToken(sessionId) {
  var token = opentok.generateToken(sessionId, {
    role: opts.role,
    expireTime: opts.expires || (new Date().getTime() / 1000) + (30 * 24 * 60 * 60), // in 30 days
  });
  outputResults(sessionId, token);
}

function outputResults(sessionId, token) {
  console.info('sessionId: ', sessionId);
  console.info('token: ', token);
  if (opts.code) {
    console.info('\n// Sample code');
    console.info('var session = OT.initSession(\'' + apiKey + '\', \'' + sessionId + '\');');
    console.info('session.on(\'streamCreated\', function(event) {\n' +
      '  session.subscribe(event.stream, function(err) {\n' +
        '    if (err) alert(err.message);\n' +
      '  });\n' +
    '});\n');
    console.info('session.connect(\'' + token + '\', function(err) {\n' +
      '  if (err) {\n' +
      '    alert(err.message);\n' +
      '  } else {\n' +
      '    session.publish(function(err) { if (err) alert(err.message) });\n' +
      '  }\n' +
    '});\n');
  }
}


function errorMessage(err) {
  if (err) {
    if (err.stack) {
      console.error(err.stack);
    } else {
      console.error(String(err));
    }
  }
  console.error(options.getHelp());
  process.exit(1);
}
