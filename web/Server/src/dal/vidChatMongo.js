var repo = function(){
  this.collection = function(){
    return db.collection("vid_chats");
  }
  this.getSession = function(vidChatId, callbacks){
    this.collection().findOne({"_id": vidChatId}, function(err, result){
      if(result)
        callbacks.success(result);
      else
        callbacks.error("Session does not exist");
    });
  };

  this.addSession = function(session, callbacks){
    this.collection().insert(session, {}, function(err, result){
      if(!err)
        callbacks.success(result);
      else
        callbacks.error(err);
    });
  };


}

module.exports = new repo();
