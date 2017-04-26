var React = require("react");
var BecomeProvider = React.createClass({
    getInitialState: function() {
        return {firstName: '', lastName: '', email: '', phoneNumber: ''};
    },
    handleFirstNameChange(event) {
        var newState = {};
        newState.firstName = event.target.value;
        this.setState({firstName: event.target.value});
    },
    handleLastNameChange(event) {
        var newState = {};
        newState.lastName = event.target.value;
        this.setState({lastName: event.target.value});
    },
    handleEmailChange(event) {
        var newState = {};
        newState.email = event.target.value;
        this.setState({email: event.target.value});
    },
    handlePhoneNumberChange(event) {
        var newState = {};
        newState.phoneNumber = event.target.value;
        this.setState({phoneNumber: event.target.value});
    },
    handleResumeChange(event) {
        this.setState({resume: event.target.value});
    },
    render: function() {
        return (
            <div className="signUp-div">
              <div className="row">
                <div className="col-md-5 centerDiv">
                    <div className="ibox float-e-margins">
                        <div className="ibox-title" style={{borderColor: "transparent"}}>
                          <div style={{textAlign: "center"}}><img style={{width: "70%"}} src="/img/mainLogo.png" class="center-login-main-logo"/></div>
                            <h2 className="login-title">Become a FitWorld Provider</h2>
                        </div>
                        <div className="ibox-content">
                            <form className="form-horizontal" method="post" action="/auth/ProvidersResume" encType="multipart/form-data">
                                <div className="form-group"><label className="col-lg-3 control-label">First Name</label>

                                    <div className="col-lg-9"><input placeholder="First Name" className="form-control" type="text" id="firstName" name="firstName" onChange={this.handleFirstNameChange}></input>
                                    </div>
                                </div>
                                <div className="form-group"><label className="col-lg-3 control-label">Last Name</label>

                                    <div className="col-lg-9"><input placeholder="Last Name" className="form-control" type="text" id="lastName" name="lastName" onChange={this.handleLastNameChange}></input></div>
                                </div>
                                <div className="form-group"><label className="col-lg-3 control-label">Email</label>

                                    <div className="col-lg-9"><input placeholder="Email" className="form-control" type="text" id="email" name="email" onChange={this.handleEmailChange}></input>
                                    </div>
                                </div>
                                <div className="form-group"><label className="col-lg-3 control-label">Phone Number</label>

                                    <div className="col-lg-9"><input placeholder="Phone Number" type="text" className="form-control" onChange={this.handlePhoneNumberChange}/>
                                    </div>
                                </div>
                                <div className="form-group"><label className="col-lg-3" style={{textAlign: "right"}}>Resume</label>

                                    <div className="col-lg-9"><input type="file" name="resume" id="resume"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-lg-offset-1 col-lg-10">
                                        <button className="btn btn-sm btn-red" type="submit" value="submit">Apply</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </div>


        );
    }
});
module.exports = BecomeProvider;
