var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var router = express.Router()
var server = require('http').Server(app)
var amqp = require('amqplib/callback_api')
var PubNub = require('pubnub')

app.use("/", express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

var pubnub = new PubNub({
    subscribeKey: "YOUR_SUB_KEY",
    publishKey: "YOUR_PUB_KEY"
})

var exchangeChannel = 'chat'
//create queue
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) throw new Error(error0)
  connection.createChannel(function(error1, channel) {
    if (error1) throw new Error(error1)

    channel.assertExchange(exchangeChannel, 'fanout', {durable: false})
    channel.assertQueue('', {exclusive: true}, function(error2, q) {
      if (error2) throw new Error(error2)
      channel.bindQueue(q.queue, exchangeChannel, '')
      channel.consume(q.que, function(msg) {
      	pubnub.publish({channel : 'chat', message: msg.content.toString()},
      		function (status, response) {
        // handle status, response
        console.log(status);
        console.log(response);
    	});
      })
    }, {noAck: true})
  })
})

// post message
app.use('/mq', router)
router.route('/chat')
.post(function(req, res) {
	amqp.connect('amqp://localhost', function(error0, connection) {
  	if (error0) throw new Error(error0)
    connection.createChannel(function(error1, channel) {
      if (error1) throw new Error(error1)
      var msg = JSON.stringify(req.body)

      // fanout delivery method for pub/sub messaging
      channel.assertExchange(exchangeChannel, 'fanout', {durable: false})
      // publish to rabbitmq exchange
      channel.publish(exchangeChannel, '', new Buffer(msg), {persistent: false})
      channel.close(function() {connection.close()})
    })
  })
  res.send('{"success": true}')
})

server.listen(3030, '0.0.0.0', function() {
    console.log('App running on localhost:3030')
  })
