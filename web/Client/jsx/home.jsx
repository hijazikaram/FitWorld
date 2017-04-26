var Packages = require("./packages.jsx");
var moment = require("moment");
import { connect } from "react-redux";
import { getCurrentProvider } from "../actions/providers";
import { providerTransactions } from "../actions/users";
// Import routing components
import {Link} from 'react-router';

var Home = React.createClass({
  getInitialState: function() {
    return{
      session: null
    }
  },
  componentDidMount() {
    this.props.dispatch(providerTransactions())
  },
  handleEditSession(session, event) {
    this.setState({session});
  },
  enterSession(sessionId, event){
    window.open("/providers/startSession?sessionId=" + sessionId, "_blank")
  },
  render: function() {
   var upcomingSessions = this.props.upcomingSessions || [];
   var transactions = this.props.transactions || [];
   var client = this.props.clients;

   const upcomingSessionObjs = upcomingSessions.map(session => {
     var client = this.props.clients.find(c => c._id === session.clientId);

     return (
     <div className='row' style={{marginBottom: "15px"}}onClick={this.handleEditSession.bind(null, session)}>
       <div className="col-md-2">
         <img alt="image" className="img-circle" style={{width: "50px", height: "50px"}} src={"/providers/CreateProfileImage/" + session.gigImageId}></img>
       </div>
       <div className="col-md-7 color-red" style={{fontWeight: "800"}}>
         {session.gigName + " with " + client.name}
         <div className="session-data-time">{moment(session.startDate).format(" MM/DD") + " at " + session.startTime}</div>
       </div>


     </div>
     );
   });0
  //  const providerTransactions = transactions.filter(transaction => client._id === transaction.transaction.userId);
   //
  //  const transactionObjs = providerTransactions.map(session => {
   //
  //    return (
  //    <div className='row'>
   //
  //    </div>
  //    );
  //  });
    console.log(this.state);
    console.log(this.props.transactions);

    var client = this.state.session ? this.props.clients.find(c => c._id === this.state.session.clientId) : {};

      return (
      <div>
        <div className="col-lg-5">
          <div className="ibox float-e-margins">
              <div className="ibox-title">
                <h5>Upcoming Sessions</h5>
              </div>
              <div className="ibox-content">
                  <div id='external-events'>
                       {upcomingSessionObjs}
                  </div>
              </div>
          </div>
      </div>
      {this.state.session
          ?<div className="col-lg-7">
            <div className="ibox float-e-margins">
                <div className="ibox-title">
                  { this.state.session ? <h5>{this.state.session.gigName + " with " + client.name}</h5> : null}
                </div>
                <div className="ibox-content">
                    <div id='external-events'>
                        <div className="row">
                          <div className="col-md-12" style={{backgroundColor: "black", padding: "0"}}>
                            <div className="gig-image" style={{backgroundImage: "url('/providers/CreateProfileImage/" + this.state.session.gigImageId + "')" }}>
                              <div style={{opacity: "1", paddingTop: "15%"}}>
                                <img alt="image" className="img-circle provider-img" style={{width: "100px", height: "100px"}} src={"/providers/CreateProfileImage/" + this.state.session.providerImageId}></img>
                                <h2 style={{textAlign: "center", color: "white", fontWeight: "800"}}>{this.state.session.gigName + " with " + client.name}</h2>
                                <h2 style={{textAlign: "center", color: "white", fontWeight: "800"}}>{moment(this.state.session.startDate).format(" MM/DD") + " at " + this.state.session.startTime}</h2>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className='external-event navy-bg row'><h3 style={{textAlign: "center"}}>Speacial Instructions</h3></div>
                              <div className="row">
                                <div className="col-md-12" style={{fontWeight: "800"}}>
                                  <h4>
                                   {this.state.session.instruction}
                                  </h4>
                                </div>
                              </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className='external-event navy-bg row'><h3 style={{textAlign: "center"}}>Actions</h3></div>
                              <div className="row" style={{textAlign: "center"}}>
                                <div className="col-md-3">

                                  <Link to={"/providers/Home/Chat/" + client._id}>
                                  <i className="fa fa-comment-o fa-5x color-red" ></i>
                                  <h4 className="color-red">Message {client.name}</h4>
                                  </Link>
                                </div>
                                <div className="col-md-3">
                                  <i className="fa fa-close fa-5x color-red"></i>
                                  <h4 className="color-red">Cancel Session</h4>
                                </div>
                                <div className="col-md-3" onClick={this.enterSession.bind(null, this.state.session.id)}>
                                  <i className="fa fa-arrow-right fa-5x color-red"></i>
                                  <h4 className="color-red">Enter Session</h4>
                                </div>
                                <div className="col-md-3">
                                  <a href={"mailto:" + client.username}  target="_top">
                                  <i className="fa fa-envelope-o fa-5x color-red"></i>
                                  <h4 className="color-red">Email {client.name}</h4>
                                  </a>
                                </div>
                              </div>
                          </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="ibox">
                <div className="ibox-content">
                    <h2>Transaction History</h2>
                    {transactionObjs}
                </div>

            </div>
        </div>: null}
      </div>
      );
  }

})

Home.propTypes = {
  dispatch: React.PropTypes.func
};

Home.defaultProps = {
  dispatch: () => {}
};

export default connect((state) => ({
  user: state.data.user,
  upcomingSessions : state.data.upcomingSessions,
  clients: state.data.clients || [],
  transactions: state.data.transactions
}))(Home);
