var pubnub = new PubNub({
    subscribeKey: "YOUR_SUB_KEY"
})

pubnub.subscribe({channels: ['chat']});

pubnub.addListener({message: function(m) {
  message = JSON.parse(m.message);
  var currInput = $('#input_msg_write').serialize().split("=");
  if (message.message == currInput[1].replace(new RegExp("%20", 'g'), " ")) {
    var newMessage = '<div class="outgoing_msg"><div class="sent_msg"><p>' +
      message.message +
      '</p><span class="time_date">' +
      new Date().toJSON().substring(0,19).replace('T',' ') +
      '</span> </div></div>'
    } else {
      var newMessage = '<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg"><p>' +
        message.message +
        '</p><span class="time_date">' +
        new Date().toJSON().substring(0,19).replace('T',' ') +
        '</span></div></div></div>'
    }
  $('.msg_history').append(newMessage);
  updateScrollandInput();
}});


$('#input_msg_write').on('submit', function(e) {
  e.preventDefault()
  $.ajax({ type: 'POST', data: $('#input_msg_write').serialize(), url: '/mq/chat', processData: false})
})

function updateScrollandInput(){
    var element = document.getElementById("msg_history");
    element.scrollTop = element.scrollHeight;
    // clear input
    $('#message').val('');
}
