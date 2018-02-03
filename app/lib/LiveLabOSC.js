// Server side module for managing osc connections. Only works with nw.js

var shortid = require('shortid')

var dgram, osc
if(typeof nw == "object"){
  dgram = nw.require('dgram')
  osc = nw.require('osc-min')
}
// to do: possibly switch to osc-msg (https://github.com/mohayonao/osc-msg) which seems to be better maintained
var events = require('events').EventEmitter
var inherits = require('inherits')


var LiveLabOSC = function (options) {
  //this.udp_client
  this.receivers = {}
  this.emitter = dgram.createSocket('udp4', function(msg, rinfo) {})
}

inherits(LiveLabOSC, events)

LiveLabOSC.prototype.sendOSC = function(_message, _port, _ip){
 //  var ip =  'localhost'
 //
 //  var buf;
 //
 // var emitter = this.emitter
 // function sendMessage(){
 //   buf = osc.toBuffer({
 //     oscType : "message",
 //    address : "/test",
 //    args : [33, 45]
 //   })
 //   emitter.send(buf, 0, buf.length, 12345, "localhost");
 // }
 //
 // setInterval(sendMessage, 1000)
  //this.emitter.send(_message, 0, _message.length, _port, ip)
}

LiveLabOSC.prototype.listenOnPort = function(port){
  // to do: check whether port in use
  this.receivers[port] = dgram.createSocket('udp4')
  this.receivers[port].on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

  this.receivers[port].on('message', (msg, rinfo) => {
    try {
      //turns datagram to javascript
      var message = osc.fromBuffer(msg)

      this.emit('received osc', {
        port: port,
        message: message
      })
    } catch (error1) {
      error = error1;
      console.log("invalid OSC packet");
    }
    //console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  })

  this.receivers[port].on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  });

  this.receivers[port].bind(port);
  // this.receivers[port].bind(port)
  // console.log("!!LLLLLLLLlistening on port", port)
  // this.receivers[port].on('message', function() {
  //   // handle all messages
  //   var address = arguments[0];
  //   var args = Array.prototype.slice.call(arguments, 1);
  //   console.log("RECEIVED ", address, args)
  // })
}


module.exports = LiveLabOSC