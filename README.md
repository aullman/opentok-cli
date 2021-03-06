# opentok-cli

Command line interface to generate a sessionId and token given an apiKey and secret. This is useful when you're trying to quickly test OpenTok code and you want to generate a sessionId and token.

## Install

```
npm install -g opentok-cli
```

## Usage

Options:
```
--apikey, -a	An OpenTok API Key
--secret, -s	An OpenTok API Secret
--role, -r	Optional role to assign to the token, one of moderator, publisher or subscriber (moderator by default)
--expires, -e	Optional expire time for the token in milliseconds (30 days from now by default) (integer)
--p2p, -p	Whether this session should be a relayed (p2p) session or a routed session ("true" or "false", "false" by default)
--sessionId, -i	Optional sessionId parameter to generate a token for
--code, -c	Optional whether to output a code snippet ("true" or "false", "false" by default)
--env, -v	Optional environment parameter "prod", "dev", "rel" or API URL (prod by default)
```

Example: `opentok-cli -a <APIKEY> -s <API_SECRET>`

If you don't want to remember your apiKey and secret every time you can add an alias to your `.bash_profile` so you can easily generate sessionIds and tokens whenever you want without any arguments. Although, you should consider the security of your secret, it's probably not the best idea to store it in plain text on your computer.
