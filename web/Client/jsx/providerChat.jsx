var Packages = require("./packages.jsx");
import { connect } from "react-redux";
// Import custom components
import { clients, addClient } from "../actions/providers";
var providerService = require("../services/providerService");
import { ChatFeed } from 'react-chat-ui'
import io from 'socket.io-client';
import { loadEarlierMessages, addChatMessage } from "../actions/users";
var clientConfig = require("../clientConfig");

var ProviderChat = React.createClass({
  getInitialState() {
    this.socket = io(clientConfig.appUrl, {jsonp: false});
    this.socket.emit('join', {email: "Iloveyou1"});
    this.socket.on('chat message', this.onReceive);
    this._isMounted = false;

    return {
      messages: [],
      currMessage: '',
      is_typing: false,
      client: null,
      clientId: this.props.routeParams.clientId,
      startDate: Date.now(),
      currentChatRoom: '',
      clientInviteEmail: '',
    }
  },
  inviteUser(){
    if(/[^\s@]+@[^\s@]+\.[^\s@]+/.test(this.state.clientInviteEmail)){
      //this.props.dispatch(inviteClient(this.state.clientInviteEmail));
      providerService.inviteUser(this.state.clientInviteEmail).then(response => {
        if(response.data.user){
          console.log(addClient);
          this.props.dispatch(addClient(response.data.user));
        } else {
          alert("An invitation has been sent. Once he/she registers you will see them in your client list.")
        }
        this.setState({ clientInviteEmail: '' })
      }).catch(error => {
        alert("An error occured. Please try again soon.")
      });
    } else {
      alert("Please enter a valid email address.")
    }
  },
  componentWillMount() {
    this._isMounted = true;
  },
  componentWillUnmount() {
    this._isMounted = false;
  },
  componentDidMount() {
   this.props.dispatch(clients());
  },
  handleMessage(event) {
   this.setState({currMessage: event.target.value});
  },
  _onMessageSubmit() {
    var user = this.props.user._id;
    var user1 = "" + this.state.clientId;
    console.log(user);
    console.log(user1);
    var email;
    if (user < user1) {
      email = user + user1;
      console.log(email);
    } else {
      email = user1 + user;
      console.log(email);
    }
    console.log(email);
    var msg = this.props.user._id + ": " + this.state.currMessage;
    var createdAt = Date.now();
    this.socket.emit('chat message', msg, email, user, user1, (status, result) => {
      if(status === "done"){
        //this.props.dispatch(addChatMessage(result, this.state.currentChatRoom));
        this.setState({currMessage: ''}, function(){
          $('#chat').animate({scrollTop: $('#chat')[0].scrollHeight}, 100);
        });

      }
    });
    // var messages = this.state.messages;
    // messages.push({type:0, message: this.state.currMessage});
  },
  handleClientClick(client) {
    var user = this.props.user._id;
    var user1 = client._id;
    console.log(user);
    console.log(user1);
    var email;
    if (user < user1) {
      email = user + user1;
      console.log(email);
    } else {
      email = user1 + user;
      console.log(email);
    }

    if(!this.props.chats[email]){
      this.props.dispatch(loadEarlierMessages(new Date(), email));
    }

    this.socket.emit('join', {email: email});
    this.setState({clientId: client._id, currentChatRoom: email});
  },
  onReceive(text, actualMessage) {
    var colonIndex = text.indexOf(':');
    var id = text.substring(0, colonIndex);
    var msg = text.substring(colonIndex + 1);
    if (id !== this.props.user._id && this.state.currentChatRoom.indexOf(id) !== -1) {
      $('#chat').animate({scrollTop: $('#chat')[0].scrollHeight}, 100);
    }else if(id === this.props.user._id){
      $('#chat').animate({scrollTop: $('#chat')[0].scrollHeight}, 100);
    }
  },
  onLoadEarlier() {
    this.props.dispatch(loadEarlierMessages(this.state.startDate, this.state.currentChatRoom));
    setTimeout(() => {
      if (this._isMounted === true) {
        var newStartDate;
        var newMessages = this.state.messages;
        for (var i = 0; i< this.props.oldChatMessages.length; i++) {
          newStartDate = this.props.oldChatMessages[i].createdAt;
          if (this.props.oldChatMessages[i].user._id === this.props.user._id) {
            newMessages.unshift({type:0, message: this.props.oldChatMessages[i].text});
          } else {
            newMessages.unshift({type:1, message: this.props.oldChatMessages[i].text});
          }
        }
        this.setState({messages: newMessages, startDate: newStartDate});
      }
    }, 1000); // simulating network
  },

  render: function() {
    var clients = this.props.clients || [];
    console.log("EWLEREL");
    var clientsjs = clients.map(client => {
      return (

          <tr style={{ cursor: "pointer"}} onClick={this.handleClientClick.bind(null, client)}>
              <td className="client-avatar">
                  <img alt="image"
                    src={client.userDetails && client.userDetails.profileImageId ?
                      "/providers/images/" + client.userDetails.profileImageId :
                      "/img/noUser.png"}></img>
                  </td>
              <td><a data-toggle="tab" href="#contact-1" className="client-link">{client.name}</a></td>
              <td>{client.username}</td>

          </tr>

      );
    });
    console.log(this.state);
    var messages = (this.props.chats[this.state.currentChatRoom] || []);
    messages = messages.map(m => {
      return { type: m.user._id === this.props.user._id, message: m.text }
    });

    var cl = clients.find(c => c._id === this.state.clientId);

      return (
        <div className="wrapper wrapper-content  animated fadeInRight">
        <div className="row">
            <div className="col-sm-7">
                <div className="ibox">
                    <div className="ibox-content">
                        <h2>Clients</h2>

                        <p>
                            The following is a list of clients that have either purchased your services or have been invited by you.
                        </p>
                        <div className="input-group">
                            <input type="text" placeholder="Invite Client By Email" value={this.state.clientInviteEmail} onChange={(e) => this.setState({clientInviteEmail: e.target.value})} className="input form-control"/>
                            <span className="input-group-btn">
                                    <button type="button" className="btn btn btn-primary" onClick={() => { this.inviteUser() }}> <i className="fa fa-plus"></i> Invite</button>
                            </span>
                        </div>
                        <div className="clients-list">
                        {/*<ul className="nav nav-tabs">
                            <span className="pull-right small text-muted"></span>
                            <li className="active"><a data-toggle="tab" href="#tab-1"><i className="fa fa-user"></i> Contacts</a></li>

                        </ul>*/}
                        <div className="tab-content">
                            <div id="tab-1" className="tab-pane active">
                                <div className="full-height-scroll">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                          <tbody>
                                              {clientsjs}
                                          </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>

                        </div>
                    </div>
                </div>
            </div>
            {cl ? <div className="col-sm-5">
              <div className="widget p-xl" style={{backgroundColor: "#b20000", color: "white"}}>
                <div className="text-center">
                  <img alt="image" style={{borderRadius: "50%", height: "150px", width: "150px"}}
                    src={cl.userDetails && cl.userDetails.profileImageId ?
                      "/providers/images/" + cl.userDetails.profileImageId :
                      "/img/noUser.png"}></img>
                      <h2>
                          {cl.name || cl.username}
                      </h2>
                </div>

                  <ul className="list-unstyled m-t-md">
                      <li>
                          <label>Email:</label>
                          &nbsp;<a style={{color: "white"}} href={"mailto:" + cl.username}>{cl.username}</a>
                      </li>
                      { cl.userDetails ?
                        <div><li>
                            <label>Gender:</label>
                            &nbsp;{cl.userDetails.gender}
                        </li>
                        <li>
                            <label>Weight:</label>
                            &nbsp;{cl.userDetails.weight + " lb"}
                        </li>
                        <li>
                            <label>Height:</label>
                            &nbsp;{cl.userDetails.heightFt + "' " + cl.userDetails.heightIn + "\""}
                        </li>
                        <li>
                            <label>Smoke?:</label>
                            &nbsp;{cl.userDetails.smoke}
                        </li>
                        <li>
                            <label>Age:</label>
                            &nbsp;{cl.userDetails.age}
                        </li></div>
                      : null
                      }
                  </ul>

              </div>
              <div className="ibox">
                  <div className="ibox-content">
                      <h2>Chat</h2>
                        <div id="chat" style={{overflow: 'scroll', height: 400}}>
                          <button onClick={this.onLoadEarlier} style ={{borderRadius: 20, display: 'block', margin: '0 auto', marginBottom: 20}}>Load earlier messages</button>
                          <ChatFeed
                            messages={messages} // Boolean: list of message objects
                            is_typing={this.state.is_typing} // Boolean: is the recipient typing
                            bubblesCentered={false} // Boolean: should bubbles be centered in the feed (default is false)
                            bubbleStyles={{ // JSON: Custom bubble styles
                              text: {
                                fontSize: 12,
                              },
                              chatbubble: {
                                borderRadius: 30,
                                padding: 10,
                                backgroundColor: 'red'
                              }
                            }}
                          />
                          <div className="input-group">
                              <input type="text" placeholder="Type a message..." className="input form-control" onChange={this.handleMessage} value={this.state.currMessage}/>
                              <span className="input-group-btn">
                                <button type="button" className="btn btn btn-primary" onClick={this._onMessageSubmit}>Send</button>
                              </span>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="ibox">
                  <div className="ibox-content">
                      <h2>Transaction History</h2>
                        
                  </div>
              </div>

            </div> : null }
        </div>
    </div>
      );
  }
})

ProviderChat.propTypes = {
  dispatch: React.PropTypes.func
};

ProviderChat.defaultProps = {
  dispatch: () => {}
};

export default connect((state) => {
  console.log("in connect of provider chat.jsx");
  console.log(state);
  return ({
    clients: state.data.clients,
    user: state.data.user,
    oldChatMessages: state.data.oldChatMessages,
    chats: state.data.chats
  });
})(ProviderChat);
