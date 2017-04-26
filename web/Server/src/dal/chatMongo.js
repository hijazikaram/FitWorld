var services = {
  addMessage(msg,email,createdAt, callbacks) {
    var collection = db.collection('chats');
    try {
        collection.findOne({"id": email}, function(err, result) {
            if (err) {
              console.log(err);
            }
            var semicolonIndex = msg.indexOf(":");
            var userId = msg.substring(0,semicolonIndex);
            var text = msg.substring(semicolonIndex + 1);
            if (result) {
              var msgs = result.msgs;
              var messageObject = {
                createdAt: createdAt,
                _id: msgs.length + 1,
                user: {
                  _id: userId
                },
                text: text
              };
              msgs.push(messageObject);
              collection.updateOne({
                    'id': email
                }, {
                    $set: {
                        'msgs': msgs
                    }
              }, function(err){
                if(err){
                  callbacks.error(err);
                  return;
                }
                callbacks.success(messageObject);
              });
            } else {
              var messageObject = {
                createdAt: createdAt,
                _id: 1,
                user: {
                  _id: userId
                },
                text: text
              };
              collection.insert({id: email, msgs: [messageObject]}, function(err){
                if(err){
                  callbacks.error(err);
                  return;
                }
                callbacks.success(messageObject);
              })
            }
        });
    } catch (e) {
        console.log(e);
    }
  }
};

module.exports = services;
