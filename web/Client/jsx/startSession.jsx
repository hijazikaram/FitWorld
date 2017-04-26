var React = require("react");
var axios = require("axios");

var StartSession = React.createClass({
  startSession(){
    axios.post("/vidSessions/start", { sessionId: this.props.sessionId }).then(function(a){
      var apiKey = '45749592';
      var sessionId = a.data.openTokSessionId;
      var token = a.data.token;

      var session = OT.initSession(apiKey, sessionId)
        .on('streamCreated', function(event) {
          session.subscribe(event.stream, 'subscriber', {  insertMode: 'append',  width: '100%', height: '100%', fitMode: "contain"});
        })
        .on('connectionDestroyed', function () {
          console.log("disconneted");
        })
        .connect(token, function(error) {
          var publisher = OT.initPublisher("publisher", {  insertMode: 'append',  width: '100%', height: '100%', fitMode: "contain"});
          publisher.on('streamCreated', function(event) {
             console.log('Stream resolution: ' +
               event.stream.videoDimensions.width +
               'x' + event.stream.videoDimensions.height);
          });
          session.publish(publisher);
        });

    });
  },
  componentDidMount(){
    this.startSession();
  },
  render(){
    console.log(OT);
    return <div>
      <div id="subscriber" style={{width: document.documentElement.clientHeight, height: "80%", margin: "auto"}}>
      </div>
      <div style={{width: "100%", height: "20%"}}>
        <div id="publisher" style={{backgroundColor: "white", position: "fixed", bottom: 30, right: 30, width: "100px", height: "50px"}}></div>
      </div>
    </div>
  }
});

module.exports = StartSession;
