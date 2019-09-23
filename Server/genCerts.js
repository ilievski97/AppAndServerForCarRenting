const openssl = require('openssl-nodejs')
openssl('openssl req -config csr.cnf -x509 -sha256 -nodes -days 365 -newkey rsa:512 -keyout key2.pem -out cert2.pem');