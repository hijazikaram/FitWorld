var React = require("react");
var DeleteModal = require("./deleteModal.jsx");
var AdminPage = React.createClass({
  getInitialState:function () {

    return{
      providerApplicants: [],
      declinedApplicants: [],
      acceptedApplicants: [],
      open: true,
      declined: false,
      accepted: false
    }
  },
  onOpenClick() {
    this.setState({open: true, declined: false})
  },
  onDeclinedClick() {
    this.setState({open: false, declined: true})
  },
  onAcceptedClick() {
    this.setState({open: false, declined: false, accepted:true})
  },
  componentWillReceiveProps : function(nextProps) {
         var status = nextProps.status;
         this.setState(status)
     },
   componentDidMount: function() {
     $.ajax({
      type: 'GET',
      url: '/providers/GetOpenProviderApplicants',
      success: function(data) {
          console.log("yess");
          console.log("redirecting from react3454e");
          this.setState({providerApplicants: data.openApplicants, declinedApplicants: data.declinedApplicants, acceptedApplicants: data.acceptedApplicants})
      }.bind(this),
      error: function(xhr, status, err) {
          console.error( status, err.toString());
      }.bind(this)
    });
  },
  deleteApp(id, applicant) {
    console.log(id);
    console.log(this.state);
    $.post( "/providers/adminPage/delete", {_id: id, email:applicant.email}, function(data) {
      console.log("finished");
    });
    var providerApplicants = this.state.providerApplicants;
    var index = providerApplicants.indexOf(applicant);
    providerApplicants.splice(index, 1);
    var declined = this.state.declinedApplicants;
    var accepted = this.state.acceptedApplicants;
    declined.push(applicant);
    this.setState({providerApplicants: providerApplicants, declinedApplicants: declined});
 },
 acceptApp(id, applicant) {
   console.log(id);
   console.log(this.state);
   $.post( "/providers/adminPage/accept", {_id: id, email:applicant.email}, function(data) {
     console.log("accept finished");
   });
   var providerApplicants = this.state.providerApplicants;
   var index = providerApplicants.indexOf(applicant);
   providerApplicants.splice(index, 1);
   var accepted = this.state.acceptedApplicants;
   accepted.push(applicant);
   this.setState({providerApplicants: providerApplicants, acceptedApplicants: accepted});
},
  showDeleteModal(provider) {
       this.forceUpdate();
       this.refs.DeleteModal.show();
   },

    render: function() {
      console.log(this.state);
      var arrayToMap;
      if (this.state.open) {
        arrayToMap = this.state.providerApplicants;
      } else if (this.state.declined) {
        arrayToMap = this.state.declinedApplicants;
      }else{
        arrayToMap = this.state.acceptedApplicants;
      }
      var rows = arrayToMap.map(applicant => (
        <tr className="table-color" >
          <td>{applicant.firstName}</td>

          <td>{applicant.lastName}</td>
          <td>
            {applicant.email}
          </td>
          <td>{applicant.phoneNumber}</td>
          <td><a href={'/providers/ProvidersResume/' + applicant.resumeId}target="_blank">{applicant.resumeName}</a></td>


          <td><button onClick={this.acceptApp.bind(this, applicant._id, applicant)}>YES</button><button onClick={this.deleteApp.bind(this, applicant._id, applicant)}>NO</button></td>
      </tr>));

        return (
            <div className="container" style={{backgroundColor: "white"}}>
              <DeleteModal provider={this.props.provider} ref="DeleteModal"/>
                <h1>Admin Page</h1>
                <p>Click on the buttons below to see applications by status:</p>
                  <button onClick={this.onOpenClick}>Open</button>
                  <button onClick={this.onAcceptedClick}>Accepted</button>
                  <button onClick={this.onDeclinedClick}>Declined</button>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Email</th>
                            <th>PhoneNumber</th>
                            <th>Resume</th>
                            <th>Accept</th>

                        </tr>
                    </thead>
                    <tbody>
                      {rows}

                    </tbody>
                </table>


            </div>

        );
    }
});

module.exports = AdminPage;
