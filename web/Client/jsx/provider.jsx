var React = require("react");
var ProviderList = require("./providerList.jsx");
var ProviderAvailable = require("./providerAvailable.jsx");
var Languages = require("./languages.jsx");
var Education = require("./education.jsx");
import { connect } from "react-redux";
// Import custom components
import { getCurrentProvider, providerSettings} from "../actions/providers";
var ProviderPage = React.createClass({
    getStateFromProps: function(props){
      return {
        name:"",
        hasSkill: null,
        hideTable: false,
        hideTable2: false,
        skills: props.user.providerDetails.skills ||[],
        file: props.user.providerDetails.file ||[],
        hours: 'Less than 30 hours a week',
        availability: props.user.providerDetails.availability || [],
        name: props.user.providerDetails.name ||'',
        level: props.user.providerDetails.level ||'beginner',
        description: props.user.providerDetails.description ||'',
        addingAvailability: false,
        editingIndex: -1,
        day: '',
        from: '',
        to: '',
        rate1:props.user.providerDetails.rate1 || '',
        rate3: props.user.providerDetails.rate3 ||'',
        rate12: props.user.providerDetails.rate12 ||'',
        linkedinLink:props.user.providerDetails.linkedinLink ||'',
        facebookLink:props.user.providerDetails.facebookLink ||'',
        twitterLink:props.user.providerDetails.twitterLink ||'',
        contactNumber:props.user.providerDetails.contactNumber ||'',
        contactEmail:props.user.providerDetails.contactEmail ||'',
        portfolioLink:props.user.providerDetails.portfolioLink ||'',
        websiteLink:props.user.providerDetails.websiteLink ||'',
        languages: props.user.providerDetails.languages ||[],
        language: props.user.providerDetails.availability ||'English',
        biography:props.user.providerDetails.biography ||'',
        freeConsulation:props.user.providerDetails.freeConsulation || '',
        education:props.user.providerDetails.education || [],
        degree:props.user.providerDetails.degree || 'Associates',
        institution: props.user.providerDetails.institution ||'',
        loaded: true

      };
    },
    getInitialState: function() {
      if(!this.props.user.providerDetails){
        return {
          loaded: false
        }
      }
      return(this.getStateFromProps(this.props));

    },
    componentWillReceiveProps(nextProps){
      this.setState(this.getStateFromProps(nextProps));
    },
    showSkillTable(hasSkill, e) {
        this.setState({hasSkill: hasSkill});
    },
    handleProviderSubmit: function(event) {
        //this is just an example of how you would submit a form
        //you would have to implement something sepanumSessionsly on the server

        console.log(this.state);
        var data = {
            availability: this.state.availability,
            skills: this.state.skills,
            languages: this.state.languages,
            education: this.state.education,
            description: this.state.description,
            linkedinLink: this.state.linkedinLink,
            facebookLink: this.state.facebookLink,
            twitterLink: this.state.twitterLink,
            contactNumber: this.state.contactNumber,
            contactEmail: this.state.contactEmail,
            portfolioLink: this.state.portfolioLink,
            websiteLink: this.state.websiteLink,
            biography: this.state.biography,
            freeConsulation: this.state.freeConsulation,
            image: this.state.image,
            name: this.state.name
          };
          event.preventDefault();
          event.stopPropagation();
          this.props.dispatch(providerSettings(data));
          window.scroll(0,0);
    },
    handleImageChange(event) {
        this.setState({image: event.target.files[0]});
    },
    hideSkillTable(e) {
        this.setState({hasSkill: null})
    },
    addSkill(event) {
        var currentSkills = this.state.skills;
        currentSkills.push({name: this.state.name, level: this.state.level, value: ""});

        this.setState({skills: currentSkills, hideTable: true});
    },
    addEducation(event) {
        var currentEducation = this.state.education;
        currentEducation.push({institution: this.state.institution, degree: this.state.degree});

        this.setState({education: currentEducation});
    },
    addAvailability(event) {
        var currentAvailability = this.state.availability;
        var obj = {day: this.state.day, from: this.state.from, to: this.state.to};
        if(this.state.editingIndex < 0){
          currentAvailability.push(obj);
        } else {
          currentAvailability[this.state.editingIndex] = obj;
        }

        this.setState({availability: currentAvailability, addingAvailability: false, editingIndex: -1 });
    },
    addLanguage(event) {
        var currentLanguages = this.state.languages;
        currentLanguages.push(this.state.language);

        this.setState({languages: currentLanguages});
    },
    handleNameChange(event) {

        this.setState({name: event.target.value});
    },
    startEdit(skill, event) {
        //show the table
        this.setState({hideTable: false, name: skill.name, level: skill.level});
    },
    startLanguageRemove(language, index) {
       //splicing the language from array
       this.state.languages.splice(index, 1);
       this.setState(this.state);
     },
   startAvailabilityRemove(available, index) {
      //splicing the skill from array
      this.state.availability.splice(index, 1);
      this.setState(this.state);
    },

   startEducationRemove(institution, index) {
       //splicing the education from array
       this.state.education.splice(index, 1);
       this.setState(this.state);
   },
   startSkillRemove(skill, index) {
       //splicing the skill from array
       this.state.skills.splice(index, 1);
       this.setState(this.state);
   },
    startAvailableEdit(available, index, event) {
        //show the table
        this.setState({day: available.day, from: available.from, to: available.to, editingIndex: index, addingAvailability : false});
    },
    showTable(event) {
        //show the table
        this.setState({hideTable: false, name: "", level: "beginner"});
    },
    showTable2(event) {
        //show the table
        this.setState({day: "", from: "", to: ""});
    },
    showTable3(event) {
        //show the table
        this.setState({name: ""});
    },
    showTable4(event) {
        //show the table
        this.setState({institution: ""});
    },
    handleLevelChange(event) {
        this.setState({level: event.target.value});
    },
    handleDescriptionChange(event) {
        this.setState({description: event.target.value});
    },
    handleNameChange(event){
      this.setState({name: event.target.value});
    },
    handleBiographyChange(event) {
        this.setState({biography: event.target.value});
    },
    handleRate1Change(event) {
        this.setState({rate1: event.target.value});
    },
    handleRate3Change(event) {
        this.setState({rate3: event.target.value});
    },
    handleRate12Change(event) {
        this.setState({rate12: event.target.value});
    },
    handleHoursChange(event) {
        this.setState({hours: event.target.value});
    },
    handleNumPropChange(event){
      this.setState({contactNumber: parseInt(event.target.value)});
    },
    handleAvailabilityChange(event) {
        this.setState({availability: event.target.value});
    },
    handleAvailabilityChange(event) {
        this.setState({availability: event.target.value});
    },
    handleLanguageChange(event) {
        this.setState({language: event.target.value});
    },
    handleInstitutionChange(event) {
        this.setState({institution: event.target.value});
    },
    handleDegreeChange(event) {
        this.setState({degree: event.target.value});
    },
    handleEducationChange(event) {
        this.setState({eduction: event.target.value});
    },
    handleDayChange(event) {
        this.setState({day: event.target.value});
    },
    handleFromChange(event) {
        this.setState({from: event.target.value});
    },
    handleToChange(event) {
        this.setState({to: event.target.value});
    },
    handlePropChange(prop, event) {
        console.log(event.target.value);
        var stateUpdate = {};
        stateUpdate[prop] = event.target.value;
        this.setState(stateUpdate);

    },
    handleLinkedInChange(event) {
        this.setState({linkedinLink: event.target.value});
    },
    handleFacebookChange(event) {
        this.setState({facebookLink: event.target.value});
    },
    handleTwitterChange(event) {
        this.setState({twitterLink: event.target.value});
    },
    handleContactNumberChange(event) {
        this.setState({contactNumber: event.target.value});
    },
    handleContactEmailChange(event) {
        this.setState({contactEmail: event.target.value});
    },
    handlePortfolioChange(event) {
        this.setState({portfolioLink: event.target.value});
    },
    handleWebsiteChange(event) {
        this.setState({websiteLink: event.target.value});
    },
    handleFreeConsultationChange(event) {
        this.setState({freeConsulation: event.target.value});
    },
    handleFreeConsultationChange(event) {
        this.setState({freeConsulation: event.target.value});
    },


    amPM: function() {
      var newhr = 0;
      var amPm = "pm"
      if (newhr < 12) {
        amPm = "am"
      }
      if (newhr == 0) {
        amPm = "am"
      }
    },

    render: function() {
      if(!this.state.loaded){
        return <div></div>
      }
      console.log(this.state);
      var user = this.props.user;
        return (
          <div className="col-md-12">
              <div className="row">
              <div className="col-lg-12">
                  <div className="ibox float-e-margins">
                      <div className="ibox-title">
                          <h5>User Profile</h5>
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
                          <form method="get" className="form-horizontal">
                              <div className="form-group"><label className="col-sm-2 control-label" htmlFor="example-search-input">Photo</label>
                                <div className="col-sm-10">
                                  <img alt="image" className="img-circle" style={{width: "100px", height: "100px"}} src={"/providers/CreateProfileImage/" + this.props.user.providerDetails.profileImageId} />
                                  <input className="margintop" type="file" onChange={this.handleImageChange}/>
                                </div>

                              </div>
                              <div className="form-group"><label className="col-sm-2 control-label">Display Name</label>

                                        <div className="col-sm-10">

                                                <input placeholder="Display Name" className="form-control" onChange={this.handleNameChange} defaultValue={user.providerDetails.name} />

                                        </div>
                                    </div>
                              <div className="hr-line-dashed"></div>

                              <div className="form-group"><label className="col-sm-2 control-label">Biography</label>
                                  <div className="col-sm-10"><textarea className="form-control fix-textarea-width" onChange={this.handleBiographyChange}  defaultValue={user.providerDetails.biography}rows="5" maxLength="300" placeholder="Please provide a description of yoursel"></textarea> <span className="help-block m-b-none">A block of help text that breaks onto a new line and may extend beyond one line.</span>
                                  </div>
                              </div>
                              <div className="hr-line-dashed"></div>
                              <div className="form-group"><label className="col-sm-2 control-label">Description</label>

                                  <div className="col-sm-10"><textarea className="form-control fix-textarea-width" onChange={this.handleDescriptionChange}  defaultValue={user.providerDetails.description}rows="5" maxLength="300" placeholder="Please provide a description of your services for the clients"></textarea></div>
                              </div>
                              <div className="hr-line-dashed"></div>
                              <div className="form-group"><label className="col-sm-2 control-label">Availability</label>
                                <div className="col-sm-10">
                                { this.state.editingIndex != -1 || this.state.addingAvailability ?
                                  <table className="table table-bordered table-responsive">
                                      <thead>
                                         <tr>
                                             <th style={{
                                                 width: "30%"
                                             }}>
                                               <div className="form-group fix-margin" style={{
                                                   marginBottom: "0px"
                                               }}>
                                                 <select id="day" className="form-control"
                                                  onChange={this.handleDayChange} name="day" value={this.state.day} >
                                                     <option value=''>Day</option>
                                                     <option>Monday</option>
                                                     <option>Tuesday</option>
                                                     <option>Wendesday</option>
                                                     <option>Thursday</option>
                                                     <option>Friday</option>
                                                     <option>Saturday</option>
                                                     <option>Sunday</option>
                                                 </select>
                                             </div>

                                             </th>
                                             <th style={{
                                                 width: "30%"
                                             }}>
                                             <div className="form-group fix-margin" style={{marginBottom: "0px"}}>
                                             <select id="from" className="form-control" name="from" onChange={this.handleFromChange} value={this.state.from} >
                                               <option value=''>From</option>
                                               <option value="0">12:00 am</option>
                                               <option value="1">1:00 am</option>
                                               <option value="2">2:00 am</option>
                                               <option value="3">3:00 am</option>
                                               <option value="4">4:00 am</option>
                                               <option value="5">5:00 am</option>
                                               <option value="6">6:00 am</option>
                                               <option value="7">7:00 am</option>
                                               <option value="8">8:00 am</option>
                                               <option value="9">9:00 am</option>
                                               <option value="10">10:00 am</option>
                                               <option value="11">11:00 am</option>
                                               <option value="12">12:00 pm</option>
                                               <option value="13">1:00 pm</option>
                                               <option value="14">2:00 pm</option>
                                               <option value="15">3:00 pm</option>
                                               <option value="16">4:00 pm</option>
                                               <option value="17">5:00 pm</option>
                                               <option value="18">6:00 pm</option>
                                               <option value="19">7:00 pm</option>
                                               <option value="20">8:00 pm</option>
                                               <option value="21">9:00 pm</option>
                                               <option value="22">10:00 pm</option>
                                               <option value="23">11:00 pm</option>
                                             </select>
                                             </div>
                                             </th>
                                             <th style={{
                                                 textAlign: "center",
                                                 width: "30%"
                                             }}>
                                             <div className="form-group fix-margin" style={{marginBottom: "0px"}}>
                                             <select id="to" className="form-control" name="to" onChange={this.handleToChange} value={this.state.to} >
                                               <option value=''>To</option>
                                               <option value="0">12:00 am</option>
                                               <option value="1">1:00 am</option>
                                               <option value="2">2:00 am</option>
                                               <option value="3">3:00 am</option>
                                               <option value="4">4:00 am</option>
                                               <option value="5">5:00 am</option>
                                               <option value="6">6:00 am</option>
                                               <option value="7">7:00 am</option>
                                               <option value="8">8:00 am</option>
                                               <option value="9">9:00 am</option>
                                               <option value="10">10:00 am</option>
                                               <option value="11">11:00 am</option>
                                               <option value="12">12:00 pm</option>
                                               <option value="13">1:00 pm</option>
                                               <option value="14">2:00 pm</option>
                                               <option value="15">3:00 pm</option>
                                               <option value="16">4:00 pm</option>
                                               <option value="17">5:00 pm</option>
                                               <option value="18">6:00 pm</option>
                                               <option value="19">7:00 pm</option>
                                               <option value="20">8:00 pm</option>
                                               <option value="21">9:00 pm</option>
                                               <option value="22">10:00 pm</option>
                                               <option value="23">11:00 pm</option>
                                             </select>
                                             </div>
                                             </th>
                                             <th style={{
                                                 textAlign: "center",
                                                 width: "15%"
                                             }}>
                                               {
                                                 this.state.day && this.state.from && this.state.to && parseInt(this.state.from) < parseInt(this.state.to) ?
                                                   <button type="button" className="btn btn-primary" style={{
                                                     width: "95%"
                                                 }} onClick={this.addAvailability}>{ this.state.addingAvailability ? 'Add' : 'Save'}</button> :
                                                 null
                                               }
                                               <button type="button" className="btn btn-default" style={{
                                                 width: "95%"
                                             }} onClick={() => this.setState({ from: '', to: '', day: '', editingIndex: -1, addingAvailability: false })}>Cancel</button>

                                             </th>
                                         </tr>
                                     </thead>
                                  </table> :
                                  <button className="btn btn-primary" onClick={() => this.setState({ addingAvailability: true })}>Add Availability</button>
                                }
                                </div>
                                <ProviderAvailable availability={this.state.availability} onEditClicked={this.startAvailableEdit} onAddClicked={this.showTable2} onAvailabilityRemoved={this.startAvailabilityRemove} ></ProviderAvailable>
                            </div>
                              <div className="hr-line-dashed"></div>
                              {  /*
                              <div className="form-group"><label className="col-lg-2 control-label">Languages</label>
                                <div className="col-lg-10">
                                    <table className="table table-bordered table-responsive">
                                      <thead>
                                        <tr>
                                            <th style={{
                                                width: "30%"
                                            }}>
                                            <div className="form-group fix-margin" style={{
                                                marginBottom: "0px"
                                            }}>
                                            <select id="language" className="form-control" onChange={this.handleLanguageChange}>
                                              <option value="English">English</option>
                                              <option value="Afrikanns">Afrikanns</option>
                                              <option value="Albanian">Albanian</option>
                                              <option value="Arabic">Arabic</option>
                                              <option value="Armenian">Armenian</option>
                                              <option value="Basque">Basque</option>
                                              <option value="Bengali">Bengali</option>
                                              <option value="Bulgarian">Bulgarian</option>
                                              <option value="Catalan">Catalan</option>
                                              <option value="Cambodian">Cambodian</option>
                                              <option value="Chinese (Mandarin)">Chinese (Mandarin)</option>
                                              <option value="Croation">Croation</option>
                                              <option value="Czech">Czech</option>
                                              <option value="Danish">Danish</option>
                                              <option value="Dutch">Dutch</option>
                                              <option value="Estonian">Estonian</option>
                                              <option value="Fiji">Fiji</option>
                                              <option value="Finnish">Finnish</option>
                                              <option value="French">French</option>
                                              <option value="Georgian">Georgian</option>
                                              <option value="German">German</option>
                                              <option value="Greek">Greek</option>
                                              <option value="Gujarati">Gujarati</option>
                                              <option value="Hebrew">Hebrew</option>
                                              <option value="Hindi">Hindi</option>
                                              <option value="Hungarian">Hungarian</option>
                                              <option value="Icelandic">Icelandic</option>
                                              <option value="Indonesian">Indonesian</option>
                                              <option value="Irish">Irish</option>
                                              <option value="Italian">Italian</option>
                                              <option value="Japanese">Japanese</option>
                                              <option value="Javanese">Javanese</option>
                                              <option value="Korean">Korean</option>
                                              <option value="Latin">Latin</option>
                                              <option value="Latvian">Latvian</option>
                                              <option value="Lithuanian">Lithuanian</option>
                                              <option value="Macedonian">Macedonian</option>
                                              <option value="Malay">Malay</option>
                                              <option value="Malayalam">Malayalam</option>
                                              <option value="Maltese">Maltese</option>
                                              <option value="Maori">Maori</option>
                                              <option value="Marathi">Marathi</option>
                                              <option value="Mongolian">Mongolian</option>
                                              <option value="Nepali">Nepali</option>
                                              <option value="Norwegian">Norwegian</option>
                                              <option value="Persian">Persian</option>
                                              <option value="Polish">Polish</option>
                                              <option value="Portuguese">Portuguese</option>
                                              <option value="Punjabi">Punjabi</option>
                                              <option value="Quechua">Quechua</option>
                                              <option value="Romanian">Romanian</option>
                                              <option value="Russian">Russian</option>
                                              <option value="Samoan">Samoan</option>
                                              <option value="Serbian">Serbian</option>
                                              <option value="Slovak">Slovak</option>
                                              <option value="Slovenian">Slovenian</option>
                                              <option value="Spanish">Spanish</option>
                                              <option value="Swahili">Swahili</option>
                                              <option value="Swedish ">Swedish </option>
                                              <option value="Tamil">Tamil</option>
                                              <option value="Tatar">Tatar</option>
                                              <option value="Telugu">Telugu</option>
                                              <option value="Thai">Thai</option>
                                              <option value="Tibetan">Tibetan</option>
                                              <option value="Tonga">Tonga</option>
                                              <option value="Turkish">Turkish</option>
                                              <option value="Ukranian">Ukranian</option>
                                              <option value="Urdu">Urdu</option>
                                              <option value="Uzbek">Uzbek</option>
                                              <option value="Vietnamese">Vietnamese</option>
                                              <option value="Welsh">Welsh</option>
                                              <option value="Xhosa">Xhosa</option>
                                            </select>
                                          </div>

                                            </th>

                                            <th style={{
                                                textAlign: "center",
                                                width: "15%"
                                            }}>
                                                <button type="button" className="btn btn-default" style={{
                                                    width: "95%"
                                                }} onClick={this.addLanguage}>Add</button>

                                            </th>
                                        </tr>
                                      </thead>
                                    </table>
                                </div>
                                <Languages languages={this.state.languages} onAddClicked={this.showTable3} onLanguageRemoved={this.startLanguageRemove}></Languages>
                              </div>
                              <div className="hr-line-dashed"></div>

                              <div className="form-group"><label className="col-lg-2 control-label">Education</label>

                                <div className="col-lg-10">
                                  <table className="table table-bordered table-responsive">
                                    <thead>
                                        <tr>
                                          <th style={{
                                              width: "70%"
                                          }}>
                                          <input placeholder="Add Institution" className="form-control" defaultValue={this.state.institution} name="institution" id="institution" onChange={this.handleInstitutionChange}/></th>
                                          <th style={{
                                                width: "30%"
                                            }}>
                                            <div className="form-group fix-margin" style={{
                                                marginBottom: "0px"
                                            }}>
                                            <select id="degreeType" className="form-control" onChange={this.handleDegreeChange.bind(null, "contactNumber")}>
                                              <option value="Associates">Associates</option>
                                              <option value="Bachelors">Bachelors</option>
                                              <option value="Masters">Masters</option>
                                              <option value="PhD">PhD</option>
                                            </select>
                                          </div>

                                            </th>

                                            <th style={{
                                                textAlign: "center",
                                                width: "15%"
                                            }}>
                                                <button type="button" className="btn btn-default" style={{
                                                    width: "95%"
                                                }} onClick={this.addEducation}>Add</button>

                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                                </div>
                                <Education education={this.state.education} onAddClicked={this.showTable4} onEducationRemoved={this.startEducationRemove}></Education>
                              </div>
                              <div className="hr-line-dashed"></div>
                              <div className="form-group"><label className="col-sm-2 control-label">Skills <br/>
                                  </label>

                                  <div className="col-sm-10">
                                    <table className="table table-bordered table-responsive">
                                            <thead>
                                                <tr>
                                                    <th style={{
                                                        width: "40%"
                                                    }}><input placeholder="Add Skill(E.G. Voice Talent)" className="form-control" defaultValue={this.state.name} name="name" id="name" onChange={this.handlePropChange.bind(null, "name")}/></th>
                                                    <th style={{
                                                        width: "30%"
                                                    }}>
                                                        <div className="form-group fix-margin" style={{
                                                            marginBottom: "0px"
                                                        }}>
                                                            <select id="level" className="form-control" defaultValue={this.state.level} name="level" onChange={this.handlePropChange.bind(null, "level")}>
                                                                <option>Beginner</option>
                                                                <option>Intermediate</option>
                                                                <option>Expert</option>
                                                            </select>
                                                        </div>
                                                    </th>
                                                    <th style={{
                                                        textAlign: "center",
                                                        width: "15%"
                                                    }}>
                                                        <button type="button" className="btn btn-default" style={{
                                                            width: "95%"
                                                        }}>Cancel</button>
                                                    </th>
                                                    <th style={{
                                                        textAlign: "center",
                                                        width: "15%"
                                                    }}>
                                                        <button type="button" className="btn btn-default" style={{
                                                            width: "95%"
                                                        }} onClick={this.addSkill}>Add</button>

                                                    </th>
                                                </tr>
                                            </thead>
                                        </table>
                                  </div>
                                   <ProviderList skills={this.state.skills} onEditClicked={this.startEdit} onAddClicked={this.showTable} onSkillDelete={this.handleSkillRemove} onSkillRemoved={this.startSkillRemove}/>
                              </div>
                              <div className="hr-line-dashed"></div>
                              <div className="form-group"><label className="col-sm-2 control-label">Portfolio</label>

                                        <div className="col-sm-10">

                                                <input placeholder="Portfolio" className="form-control" onChange={this.handlePortfolioChange} defaultValue={user.providerDetails.portfolioLink}/>

                                        </div>
                                    </div>
                              <div className="hr-line-dashed"></div>
                            */}
                                <div className="form-group"><label className="col-sm-2 control-label">Website</label>

                                          <div className="col-sm-10">

                                                  <input placeholder="Website" className="form-control"onChange={this.handleWebsiteChange}defaultValue={user.providerDetails.websiteLink}/>

                                          </div>
                                      </div>

                              <div className="hr-line-dashed"></div>
                              <div className="form-group"><label className="col-sm-2 control-label">Social Media</label>

                                  <div className="col-sm-10">
                                      <div className="row">
                                          <div className="col-md-4"><input placeholder="LinkedIn" className="form-control" onChange={this.handleLinkedInChange} defaultValue={user.providerDetails.linkedinLink}/></div>
                                          <div className="col-md-4"><input placeholder="FaceBook" className="form-control"onChange={this.handleFacebookChange}defaultValue={user.providerDetails.facebookLink}/></div>
                                          <div className="col-md-4"><input placeholder="Twitter" className="form-control"onChange={this.handleTwitterChange}defaultValue={user.providerDetails.twitterLink}/></div>
                                      </div>
                                </div>
                              </div>
                              <div className="hr-line-dashed"></div>
                              <div className="form-group"><label className="col-sm-2 control-label">Contact</label>

                                  <div className="col-sm-10">
                                    <div className="row">
                                      <div className="col-md-6"><input defaultValue={user.providerDetails.contactNumber}placeholder="Contact Number"  data-mask="(999) 999-9999"className="form-control" onChange={this.handleNumPropChange} defaultValue={user.providerDetails.contactNumber}/></div>
                                      <div className="col-md-6"><input placeholder="Email" className="form-control"onChange={this.handleContactEmailChange} defaultValue={user.providerDetails.contactEmail}/></div>
                                  </div>
                                </div>
                              </div>


                              <div className="hr-line-dashed"></div>
                              <div className="form-group">
                                  <div className="col-sm-4 col-sm-offset-2">
                                      <button type="button btn-primary" className="btn btn-info" onClick={this.handleProviderSubmit}>Submit</button>
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
ProviderPage.propTypes = {
  dispatch: React.PropTypes.func
};

ProviderPage.defaultProps = {
  dispatch: () => {}
};

export default connect((state) => ({
  user: state.data.user
}))(ProviderPage);
