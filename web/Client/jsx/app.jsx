// ./src/index.jsx
import { render } from 'react-dom';
// Import routing components
import {Link} from 'react-router';

import { connect } from "react-redux";
// Import custom components
import { getCurrentProvider } from "../actions/providers";
// import Calender from './calender.jsx'
// import Chat from './chat.jsx'
// import Gigs from './gigs.jsx'

var App = React.createClass({
  componentDidMount(){
    this.props.dispatch(getCurrentProvider());
  },
  render: function() {

        return (
            <div id="wrapper">
                    <nav className="navbar-default navbar-static-side" role="navigation">
                        <div className="sidebar-collapse">
                            <ul className="nav metismenu" id="side-menu">
                                <li className="nav-header">
                                    <div className="dropdown profile-element"> <span>
                                        {this.props.user.providerDetails == null ? null :
                                          <img alt="image" className="img-circle" style={{width: "100px", height: "100px"}} src={"/providers/CreateProfileImage/" + this.props.user.providerDetails.profileImageId} />}
                                         </span>
                                        <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                                        <span className="clear"> <span className="block m-t-xs"> <strong className="font-bold">{this.props.user.username}</strong>
                                         </span>  </span> </a>
                                        <ul className="dropdown-menu animated fadeInRight m-t-xs">
                                            <li><a href="profile.html">Profile</a></li>
                                            <li><a href="contacts.html">Contacts</a></li>
                                            <li><a href="mailbox.html">Mailbox</a></li>
                                            <li className="divider"></li>
                                            <li><a href="login.html">Logout</a></li>
                                        </ul>
                                    </div>
                                    <div className="logo-element">
                                        FW
                                    </div>
                                </li>
                                <li>
                                    <Link to="/providers/Home"><i className="fa fa-th-large"></i> <span className="nav-label">Home</span></Link>
                                </li>
                                <li>
                                    <Link to="/providers/Home/Gigs"><i className="fa fa-shopping-cart"></i> <span className="nav-label">Gigs</span></Link>
                                </li>
                      
                                <li>
                                    <Link to="/providers/Home/Chat"><i className="fa fa-address-book"></i> <span className="nav-label">Clients</span></Link>
                                </li>
                                <li>
                                    <Link to="/providers/Home/Settings"><i className="fa fa-user-circle"></i> <span className="nav-label">User Profile</span></Link>
                                </li>
                            </ul>

                        </div>
                    </nav>

                    <div id="page-wrapper" className="gray-bg dashbard-1">
                    <div className="row border-bottom">
                    <nav className="navbar navbar-static-top" role="navigation" style={{marginBottom: 0}}>
                    <div className="navbar-header">
                        <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i className="fa fa-bars"></i> </a>
                        {/*<form role="search" className="navbar-form-custom" action="search_results.html">
                            <div className="form-group">
                                <input type="text" placeholder="Search for something..." className="form-control" name="top-search" id="top-search"/>
                            </div>
                        </form>*/}
                    </div>
                        <ul className="nav navbar-top-links navbar-right">
                            <li>
                                <span className="m-r-sm text-muted welcome-message">Welcome to FitWorld.</span>
                            </li>
                            <li>
                                <a href="/auth/logout">
                                    <i className="fa fa-sign-out"></i> Log out
                                </a>
                            </li>

                        </ul>

                    </nav>
                    </div>
                    <div className="row  border-bottom  dashboard-header">
                      {this.props.children}

                      </div>

                    </div>
            </div>

        );
    }
})

App.propTypes = {
  dispatch: React.PropTypes.func
};

App.defaultProps = {
  dispatch: () => {}
};

export default connect((state) => ({
  user: state.data.user
}))(App);
