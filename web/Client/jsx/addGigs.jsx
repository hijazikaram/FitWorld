var Packages = require("./packages.jsx");
import { connect } from "react-redux";
// Import custom components
import { saveGig } from "../actions/providers";

var GigDetails = React.createClass({
  getStateFromProps(props){
    return Object.assign({
      hideCategoryMind: false,
      hideCategoryBody: false,
      openForm: false,
      packages: [],
      numSessions: null,
      price: null,
      name: "",
      description: "",
      instruction: "",
      primaryCategory: "",
      secondaryCategory: "",
      image: ""
    }, props.gig)
  },
  getInitialState: function() {
    return this.getStateFromProps(this.props);
  },
  componentWillReceiveProps(nextProps){
    this.setState(this.getStateFromProps(nextProps));
  },
  handleSaveGig: function(event) {
      var gig = {
        packages: this.state.packages,
        name: this.state.name,
        description: this.state.description,
        instruction: this.state.instruction,
        primaryCategory: this.state.primaryCategory,
        secondaryCategory: this.state.secondaryCategory,
        image: this.state.image,
        id: this.props.gig.id
      };
      event.preventDefault();
      event.stopPropagation();
      this.props.dispatch(saveGig(gig));

  },
  hideMind(event) {
      this.setState({hideCategoryMind: true, hideCategoryBody: false});
  },
  hideBody(event) {
      this.setState({hideCategoryMind: false, hideCategoryBody: true});
  },
  openForm(event){
    this.setState({openForm: true});
    event.preventDefault();
  },
  addPackage(event) {
      var currentPackages = this.state.packages;
      currentPackages.push({numSessions: this.state.numSessions, price: this.state.price});

      this.setState({packages: currentPackages});
  },
  startPackageRemove(package1, index) {
     //splicing the language from array
     this.state.packages.splice(index, 1);
     this.setState(this.state);
   },
   handlePropChange(prop, event) {
       var stateUpdate = {};
       stateUpdate[prop] = event.target.value;
       this.setState(stateUpdate);

   },
   handleDescriptionChange(event) {
       this.setState({description: event.target.value});
   },
   handleInstructionChange(event) {
       this.setState({instruction: event.target.value});
   },
   handleNameChange(event) {
       this.setState({name: event.target.value});
   },
   handleImageChange(event) {
       this.setState({image: event.target.files[0]});
   },
   handleNumPropChange(prop, event){
     var stateUpdate = {};
     stateUpdate[prop] = parseInt(event.target.value);
     this.setState(stateUpdate);
   },

  onTest: function(){
     this.setState({primaryCategory: "Mind"});
   },
  onTest2: function()
  {
      this.setState({primaryCategory: "Body"});
  },
  onTest3(secondaryCategory){
   this.setState({secondaryCategory: secondaryCategory});
  },
  callTwoFuncs1() {
   this.hideBody();
   this.onTest();
  },
  callTwoFuncs2() {
   this.hideMind();
   this.onTest2();
  },
  render(){
    return (<div className="ibox float-e-margins">
              <div className="ibox-title">
                  <h5>{this.props.name || "Add Gig"}</h5>
                  <div className="ibox-tools">
                      <a className="collapse-link">
                          <i className="fa fa-chevron-up"></i>
                      </a>
                      <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                          <i className="fa fa-wrench"></i>
                      </a>
                      <ul className="dropdown-menu dropdown-user">
                          <li><a href="#">Config option 1</a>
                          </li>
                          <li><a href="#">Config option 2</a>
                          </li>
                      </ul>
                      <a className="close-link">
                          <i className="fa fa-times"></i>
                      </a>
                  </div>
              </div>
              <div className="ibox-content">
                  <form className="form-horizontal">
                      <p>Sign in today for more expirience.</p>
                      <div className="form-group"><label className="col-sm-2 control-label">Choose Category</label>
                        <div className="col-sm-10">
                          <div className="row">
                            <div className="col-md-6"><span className={"btn width " + (this.state.primaryCategory == "Mind" ? "btn-success" : "btn-white") } value={this.state.primaryCategory}onClick={this.callTwoFuncs1}>Mind</span></div>
                            <div className="col-md-6"><span className={"btn width " + (this.state.primaryCategory == "Body" ? "btn-success" : "btn-white") } value={this.state.primaryCategory} onClick={this.callTwoFuncs2}>Body</span></div>
                        </div>
                      </div>
                    </div>
                      {this.state.primaryCategory === "Body"
                          ?
                      <div className="form-group"><label className="col-sm-2 control-label">Sub Category</label>
                        <div className="col-sm-10">
                          <div className="row">
                            <div className="col-md-3 "><span className={"btn width " + (this.state.secondaryCategory == "Personal Trainer" ? "btn-success" : "btn-white") } value={this.state.secondaryCategory}onClick={this.onTest3.bind(null, "Personal Trainer")}>Personal Trainer</span></div>
                            <div className="col-md-3"><span className={"btn width " + (this.state.secondaryCategory == "Health Coach" ? "btn-success" : "btn-white") } value={this.state.secondaryCategory} onClick={this.onTest3.bind(null, "Health Coach")}>Health Coach</span></div>
                            <div className="col-md-3"><span className={"btn width " + (this.state.secondaryCategory == "Nutritionist" ? "btn-success" : "btn-white") } value={this.state.secondaryCategory}onClick={this.onTest3.bind(null, "Nutritionist")}>Nutritionist </span></div>
                            <div className="col-md-3"><span className={"btn width " + (this.state.secondaryCategory == "Dietitian" ? "btn-success" : "btn-white") } value={this.state.secondaryCategory}onClick={this.onTest3.bind(null, "Dietitian")}>Dietitian</span></div>
                          </div>
                        </div>
                      </div>: null}
                      {this.state.primaryCategory == "Mind"
                          ?
                      <div className="form-group"><label className="col-sm-2 control-label">Categories</label>
                        <div className="col-sm-10">
                          <div className="row">

                            <div className="col-md-4"><span className={"btn width " + (this.state.secondaryCategory == "Life Coach" ? "btn-success" : "btn-white") } value={this.state.secondaryCategory}onClick={this.onTest3.bind(null,"Life Coach")}>Life Coach</span></div>
                            <div className="col-md-4"><span className={"btn width " + (this.state.secondaryCategory == "Counselor" ? "btn-success" : "btn-white") } value={this.state.secondaryCategory}onClick={this.onTest3.bind(null, "Counselor")}> Counselor</span></div>
                            <div className="col-md-4"><span className={"btn width " + (this.state.secondaryCategory == "Success Coach" ? "btn-success" : "btn-white") } value={this.state.secondaryCategory}onClick={this.onTest3.bind(null, "Success Coach")}>Success Coach</span></div>
                          </div>
                        </div>
                      </div>: null}
                      {this.state.secondaryCategory
                          ?
                        <div>
                          <div className="form-group">
                            <label className="col-sm-2 control-label">Name</label>
                              <div className="col-sm-10">
                                <div className="row">
                                  <div className="col-md-12">
                                      <input placeholder="Name of the Gig" className="form-control" value={this.state.name} onChange={this.handleNameChange}></input></div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="col-sm-2 control-label">Description</label>
                              <div className="col-sm-10">
                                <div className="row">
                                  <div className="col-md-12"><textarea className="form-control" rows="5" maxLength="300" placeholder="Please provide a description of your gig for the clients" value={this.state.description} onChange={this.handleDescriptionChange}></textarea></div>
                                </div>
                              </div>
                            </div>
                          <div className="form-group">
                            <label className="col-sm-2 control-label">Instructions</label>
                              <div className="col-sm-10">
                                <div className="row">
                                  <div className="col-md-12"><input placeholder="Instructions for the Gig" className="form-control" value={this.state.instruction}onChange={this.handleInstructionChange}></input></div>
                                </div>
                              </div>
                            </div>

                          <div className="form-group"><label className="col-sm-2 control-label">Packages</label>
                            <div className="col-sm-10">
                              <table className="table table-bordered table-responsive">
                                      <thead>
                                          <tr>
                                              <th style={{
                                                  width: "40%"
                                              }}><input placeholder="Number Of Sessions" type="number" className="form-control" onChange={this.handleNumPropChange.bind(null, "numSessions")}/></th>
                                              <th style={{
                                                  width: "30%"
                                              }}>
                                                  <div className="form-group fix-margin" style={{
                                                      marginBottom: "0px"
                                                  }}>
                                                    <input placeholder="Price" type="number" className="form-control" onChange={this.handleNumPropChange.bind(null, "price")} />
                                                  </div>
                                              </th>

                                              <th style={{
                                                  textAlign: "center",
                                                  width: "15%"
                                              }}>
                                                  <button type="button" className="btn btn-default" style={{
                                                      width: "95%"
                                                  }} onClick={this.addPackage}>Add</button>

                                              </th>
                                          </tr>
                                      </thead>
                                  </table>
                            </div>
                            <Packages packages={this.state.packages} onEditClicked={this.startEdit} onAddClicked={this.showTable} onPackageDelete={this.handlePackageRemove} onPackageRemoved={this.startPackageRemove}/>
                            <div className="form-group">
                              <label className="col-sm-2 control-label">Image</label>
                                <div className="col-sm-10">
                                  <div className="row">
                                    <div className="col-md-12"><input type="file" name="image" className="margintop" id="image" onChange={this.handleImageChange}/></div>
                                  </div>
                                </div>
                              </div>
                      </div>
                      <div className="form-group">
                          <div className="col-sm-4 col-sm-offset-2">
                              <button type="button btn-primary" className="btn btn-info" onClick={this.handleSaveGig}>Submit</button>
                          </div>
                      </div>
                    </div>: null}


                  </form>
              </div>
          </div>);
  }
})

var AddGigs = React.createClass({
  getInitialState: function() {
    return{
      gig: null
    }
  },

handleAddGig(e){
  this.setState({gig: {}});
},

//edit the form
handleEditGig(gig, event) {
  this.setState({gig});
},
render: function() {
   var gigs = this.props.user.gigs || [];

   var editGig = gigs.map(gig => (
     <div className='external-event navy-bg row' key={gig.id}>
       <div className="col-sm-9"><h3>{gig.name}</h3></div>
       <div className="col-sm-3"><button onClick={this.handleEditGig.bind(null, gig)} className="btn editGigButton">Edit</button></div>
     </div>
     ));
    console.log(this.state);

      return (
      <div>
        <div className="col-sm-3">
          <div className="ibox float-e-margins">
              <div className="ibox-title">
                  <h5>Gigs</h5>
                  <div className="ibox-tools">
                      <a className="" onClick={this.handleAddGig}>
                          <i className="fa fa-plus"></i>
                      </a>

                  </div>
              </div>
              <div className="ibox-content">
                  <div id='external-events'>

                      {gigs.length ? editGig : <p>You have not created any gigs. Click on the <i className="fa fa-plus"></i> above to add a gig.</p>}

                  </div>
              </div>
          </div>
      </div>
        <div className="col-sm-9">
          {this.state.gig ? <GigDetails {...this.props} gig={this.state.gig} /> : null }
        </div>
      </div>
      );
  }

})

AddGigs.propTypes = {
  dispatch: React.PropTypes.func
};

AddGigs.defaultProps = {
  dispatch: () => {}
};

export default connect((state) => ({
  user: state.data.user
}))(AddGigs);
