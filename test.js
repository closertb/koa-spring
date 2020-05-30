var crypto = require('crypto');
 
var h = crypto.createHash('md5');
 
h.update("A string not same tru 东方闪电放松放松 对方水电费");

console.log('res', h.digest('hex'));

