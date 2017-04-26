// <div className="container">
//   <div className="row">
//       <div className="col-md-8 provider">
//           <div className="row">
//               <div className="col-md-3">
//                   <h1 className="available">
//                       Contact
//                   </h1>
//               </div>
//               <div className="col-md-9">
//                   <div className="row">
//                       <div className="col-md-4">
//                         <input placeholder="Contact Number" className="form-control" onChange={this.handleContactNumberChange}/>
//                       </div>
//                       <div className="col-md-4">
//                         <input placeholder="Email" className="form-control"onChange={this.handleContactEmailChange}/>
//                       </div>
//                       </div>
//
//                   </div>
//
//               </div>
//           </div>
//   </div>
//
//         <div className="row">
//             <div className="col-md-8 provider">
//                 <div className="row">
//                     <div className="col-md-3">
//                         <h1 className="available">
//                             Availability
//                         </h1>
//                     </div>
//                     <div className="col-md-9">
//                         <div className="row">
//
//                           <div className="col-md-12">
//                                  <table className="table table-bordered table-responsive">
//                                           <thead>
//                                               <tr>
//                                                   <th style={{
//                                                       width: "30%"
//                                                   }}>
//                                                   <div className="form-group" style={{
//                                                       marginBottom: "0px"
//                                                   }}>
//                                                   <select id="day" className="form-control"
//                                                    onChange={this.handleDayChange} name="day" >
//                                                       <option>Monday</option>
//                                                       <option>Tuesday</option>
//                                                       <option>Wendesday</option>
//                                                       <option>Thursday</option>
//                                                       <option>Friday</option>
//                                                       <option>Saturday</option>
//                                                       <option>Sunday</option>
//                                                   </select>
//                                                 </div>
//
//                                                   </th>
//                                                   <th style={{
//                                                       width: "30%"
//                                                   }}>
//                                                   <div className="form-group" style={{marginBottom: "0px"}}>
//                                                   <select id="from" className="form-control" name="from" onChange={this.handleFromChange} >
//                                                     <option value="0">12:00 am</option>
//                                                     <option value="1">1:00 am</option>
//                                                     <option value="2">2:00 am</option>
//                                                     <option value="3">3:00 am</option>
//                                                     <option value="4">4:00 am</option>
//                                                     <option value="5">5:00 am</option>
//                                                     <option value="6">6:00 am</option>
//                                                     <option value="7">7:00 am</option>
//                                                     <option value="8">8:00 am</option>
//                                                     <option value="9">9:00 am</option>
//                                                     <option value="10">10:00 am</option>
//                                                     <option value="11">11:00 am</option>
//                                                     <option value="12">12:00 pm</option>
//                                                     <option value="13">1:00 pm</option>
//                                                     <option value="14">2:00 pm</option>
//                                                     <option value="15">3:00 pm</option>
//                                                     <option value="16">4:00 pm</option>
//                                                     <option value="17">5:00 pm</option>
//                                                     <option value="18">6:00 pm</option>
//                                                     <option value="19">7:00 pm</option>
//                                                     <option value="20">8:00 pm</option>
//                                                     <option value="21">9:00 pm</option>
//                                                     <option value="22">10:00 pm</option>
//                                                     <option value="23">11:00 pm</option>
//                                                   </select>
//                                                   </div>
//                                                   </th>
//                                                   <th style={{
//                                                       textAlign: "center",
//                                                       width: "30%"
//                                                   }}>
//                                                   <div className="form-group" style={{marginBottom: "0px"}}>
//                                                   <select id="day" className="form-control" name="day" onChange={this.handleToChange}>
//                                                     <option value="0">12:00 am</option>
//                                                     <option value="1">1:00 am</option>
//                                                     <option value="2">2:00 am</option>
//                                                     <option value="3">3:00 am</option>
//                                                     <option value="4">4:00 am</option>
//                                                     <option value="5">5:00 am</option>
//                                                     <option value="6">6:00 am</option>
//                                                     <option value="7">7:00 am</option>
//                                                     <option value="8">8:00 am</option>
//                                                     <option value="9">9:00 am</option>
//                                                     <option value="10">10:00 am</option>
//                                                     <option value="11">11:00 am</option>
//                                                     <option value="12">12:00 pm</option>
//                                                     <option value="13">1:00 pm</option>
//                                                     <option value="14">2:00 pm</option>
//                                                     <option value="15">3:00 pm</option>
//                                                     <option value="16">4:00 pm</option>
//                                                     <option value="17">5:00 pm</option>
//                                                     <option value="18">6:00 pm</option>
//                                                     <option value="19">7:00 pm</option>
//                                                     <option value="20">8:00 pm</option>
//                                                     <option value="21">9:00 pm</option>
//                                                     <option value="22">10:00 pm</option>
//                                                     <option value="23">11:00 pm</option>
//                                                   </select>
//                                                   </div>
//                                                   </th>
//                                                   <th style={{
//                                                       textAlign: "center",
//                                                       width: "15%"
//                                                   }}>
//                                                       <button type="button" className="btn btn-default" style={{
//                                                           width: "95%"
//                                                       }} onClick={this.addAvailability.bind({null})}>Add</button>
//
//                                                   </th>
//                                               </tr>
//                                           </thead>
//                                       </table>
//                               <div>
//                                 <ProviderAvailable availability={this.state.availability} onEditClicked={this.startAvailableEdit} onAddClicked={this.showTable2} onAvailabilityRemoved={this.startAvailabilityRemove} ></ProviderAvailable>
//                               </div>
//                           </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div className="row">
//             <div className="col-md-8 provider">
//                 <div className="row">
//                     <div className="col-md-3">
//                         <h1 className="available">
//                             Language
//                         </h1>
//                     </div>
//                     <div className="col-md-9">
//                         <div className="row">
//
//                           <div className="col-md-12">
//                                  <table className="table table-bordered table-responsive">
//                                           <thead>
//                                               <tr>
//                                                   <th style={{
//                                                       width: "30%"
//                                                   }}>
//                                                   <div className="form-group" style={{
//                                                       marginBottom: "0px"
//                                                   }}>
//                                                   <select id="language" className="form-control" onChange={this.handleLanguageChange}>
//                                                     <option value="English">English</option>
//                                                     <option value="Afrikanns">Afrikanns</option>
//                                                     <option value="Albanian">Albanian</option>
//                                                     <option value="Arabic">Arabic</option>
//                                                     <option value="Armenian">Armenian</option>
//                                                     <option value="Basque">Basque</option>
//                                                     <option value="Bengali">Bengali</option>
//                                                     <option value="Bulgarian">Bulgarian</option>
//                                                     <option value="Catalan">Catalan</option>
//                                                     <option value="Cambodian">Cambodian</option>
//                                                     <option value="Chinese (Mandarin)">Chinese (Mandarin)</option>
//                                                     <option value="Croation">Croation</option>
//                                                     <option value="Czech">Czech</option>
//                                                     <option value="Danish">Danish</option>
//                                                     <option value="Dutch">Dutch</option>
//                                                     <option value="Estonian">Estonian</option>
//                                                     <option value="Fiji">Fiji</option>
//                                                     <option value="Finnish">Finnish</option>
//                                                     <option value="French">French</option>
//                                                     <option value="Georgian">Georgian</option>
//                                                     <option value="German">German</option>
//                                                     <option value="Greek">Greek</option>
//                                                     <option value="Gujarati">Gujarati</option>
//                                                     <option value="Hebrew">Hebrew</option>
//                                                     <option value="Hindi">Hindi</option>
//                                                     <option value="Hungarian">Hungarian</option>
//                                                     <option value="Icelandic">Icelandic</option>
//                                                     <option value="Indonesian">Indonesian</option>
//                                                     <option value="Irish">Irish</option>
//                                                     <option value="Italian">Italian</option>
//                                                     <option value="Japanese">Japanese</option>
//                                                     <option value="Javanese">Javanese</option>
//                                                     <option value="Korean">Korean</option>
//                                                     <option value="Latin">Latin</option>
//                                                     <option value="Latvian">Latvian</option>
//                                                     <option value="Lithuanian">Lithuanian</option>
//                                                     <option value="Macedonian">Macedonian</option>
//                                                     <option value="Malay">Malay</option>
//                                                     <option value="Malayalam">Malayalam</option>
//                                                     <option value="Maltese">Maltese</option>
//                                                     <option value="Maori">Maori</option>
//                                                     <option value="Marathi">Marathi</option>
//                                                     <option value="Mongolian">Mongolian</option>
//                                                     <option value="Nepali">Nepali</option>
//                                                     <option value="Norwegian">Norwegian</option>
//                                                     <option value="Persian">Persian</option>
//                                                     <option value="Polish">Polish</option>
//                                                     <option value="Portuguese">Portuguese</option>
//                                                     <option value="Punjabi">Punjabi</option>
//                                                     <option value="Quechua">Quechua</option>
//                                                     <option value="Romanian">Romanian</option>
//                                                     <option value="Russian">Russian</option>
//                                                     <option value="Samoan">Samoan</option>
//                                                     <option value="Serbian">Serbian</option>
//                                                     <option value="Slovak">Slovak</option>
//                                                     <option value="Slovenian">Slovenian</option>
//                                                     <option value="Spanish">Spanish</option>
//                                                     <option value="Swahili">Swahili</option>
//                                                     <option value="Swedish ">Swedish </option>
//                                                     <option value="Tamil">Tamil</option>
//                                                     <option value="Tatar">Tatar</option>
//                                                     <option value="Telugu">Telugu</option>
//                                                     <option value="Thai">Thai</option>
//                                                     <option value="Tibetan">Tibetan</option>
//                                                     <option value="Tonga">Tonga</option>
//                                                     <option value="Turkish">Turkish</option>
//                                                     <option value="Ukranian">Ukranian</option>
//                                                     <option value="Urdu">Urdu</option>
//                                                     <option value="Uzbek">Uzbek</option>
//                                                     <option value="Vietnamese">Vietnamese</option>
//                                                     <option value="Welsh">Welsh</option>
//                                                     <option value="Xhosa">Xhosa</option>
//                                                   </select>
//                                                 </div>
//
//                                                   </th>
//
//                                                   <th style={{
//                                                       textAlign: "center",
//                                                       width: "15%"
//                                                   }}>
//                                                       <button type="button" className="btn btn-default" style={{
//                                                           width: "95%"
//                                                       }} onClick={this.addLanguage.bind({null})}>Add</button>
//
//                                                   </th>
//                                               </tr>
//                                           </thead>
//                                       </table>
//                               <div>
//                                 <Languages languages={this.state.languages} onAddClicked={this.showTable3} onLanguageRemoved={this.startLanguageRemove}></Languages>
//                               </div>
//                           </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div className="row">
//             <div className="col-md-8 provider">
//                 <div className="row">
//                     <div className="col-md-3">
//                         <h1 className="available">
//                             Skills</h1>
//                     </div>
//                     <div className="col-md-9">
//                         <div className="row">
//                             {this.state.hasSkill != true
//                                 ? <div className="col-md-3 available1">
//                                         <button type="button" className="btn one btn-default" onClick={this.showSkillTable.bind(null, true)}>Yes</button>
//                                         <button type="button" className="btn two btn-default" onClick={this.showSkillTable.bind(null, false)}>No</button>
//                                     </div>
//                                 : null}
//
//                             <div className="col-md-12">
//                                 {this.state.hasSkill == true && this.state.hideTable == false
//                                     ? <table className="table table-bordered table-responsive">
//                                             <thead>
//                                                 <tr>
//                                                     <th style={{
//                                                         width: "40%"
//                                                     }}><input placeholder="Add Skill(E.G. Voice Talent)" className="form-control" value={this.state.name} name="name" id="name" onChange={this.handlePropChange.bind(null, "name")}/></th>
//                                                     <th style={{
//                                                         width: "30%"
//                                                     }}>
//                                                         <div className="form-group" style={{
//                                                             marginBottom: "0px"
//                                                         }}>
//                                                             <select id="level" className="form-control" value={this.state.level} name="level" onChange={this.handlePropChange.bind(null, "level")}>
//                                                                 <option>Beginner</option>
//                                                                 <option>Intermediate</option>
//                                                                 <option>Expert</option>
//                                                             </select>
//                                                         </div>
//                                                     </th>
//                                                     <th style={{
//                                                         textAlign: "center",
//                                                         width: "15%"
//                                                     }}>
//                                                         <button type="button" className="btn btn-default" style={{
//                                                             width: "95%"
//                                                         }}>Cancel</button>
//                                                     </th>
//                                                     <th style={{
//                                                         textAlign: "center",
//                                                         width: "15%"
//                                                     }}>
//                                                         <button type="button" className="btn btn-default" style={{
//                                                             width: "95%"
//                                                         }} onClick={this.addSkill.bind({null})}>Add</button>
//
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                         </table>
//                                     : null}
//                                 <ProviderList skills={this.state.skills} onEditClicked={this.startEdit} onAddClicked={this.showTable} onSkillDelete={this.handleSkillRemove} onSkillRemoved={this.startSkillRemove}/>
//                             </div>
//
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div className="row">
//             <div className="col-md-8 provider">
//                 <div className="row">
//                     <div className="col-md-3">
//                         <h1 className="available">
//                             Education
//                         </h1>
//                     </div>
//                     <div className="col-md-9">
//                         <div className="row">
//
//                           <div className="col-md-12">
//                                  <table className="table table-bordered table-responsive">
//                                           <thead>
//                                               <tr>
//                                                 <th style={{
//                                                     width: "70%"
//                                                 }}><input placeholder="Add Institution" className="form-control" value={this.state.institution} name="institution" id="institution" onChange={this.handleInstitutionChange}/></th>
//                                                 <th style={{
//                                                       width: "30%"
//                                                   }}>
//                                                   <div className="form-group" style={{
//                                                       marginBottom: "0px"
//                                                   }}>
//                                                   <select id="degreeType" className="form-control" onChange={this.handleDegreeChange}>
//                                                     <option value="Associates">Associates</option>
//                                                     <option value="Bachelors">Bachelors</option>
//                                                     <option value="Masters">Masters</option>
//                                                     <option value="PhD">PhD</option>
//                                                   </select>
//                                                 </div>
//
//                                                   </th>
//
//                                                   <th style={{
//                                                       textAlign: "center",
//                                                       width: "15%"
//                                                   }}>
//                                                       <button type="button" className="btn btn-default" style={{
//                                                           width: "95%"
//                                                       }} onClick={this.addEducation.bind({null})}>Add</button>
//
//                                                   </th>
//                                               </tr>
//                                           </thead>
//                                       </table>
//                               <div>
//                                 <Education education={this.state.education} onAddClicked={this.showTable4} onEducationRemoved={this.startEducationRemove}></Education>
//                               </div>
//                           </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div className="row">
//             <div className="col-md-8 provider">
//                 <div className="row">
//                     <div className="col-md-3">
//                         <h1 className="available">
//                             Biography
//                         </h1>
//                     </div>
//                     <div className="col-md-9">
//                         <div className="row">
//                             <textarea className="form-control" onChange={this.handleBiographyChange}  rows="5" maxlength="300" placeholder="Please provide a description of yoursel"></textarea>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div className="row">
//             <div className="col-md-8 provider">
//                 <div className="row">
//                     <div className="col-md-3">
//                         <h1 className="available">
//                             Description
//                         </h1>
//                     </div>
//                     <div className="col-md-9">
//                         <div className="row">
//                             <textarea className="form-control" onChange={this.handleDescriptionChange}  rows="5" maxlength="300" placeholder="Please provide a description of your services for the clients"></textarea>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div className="row">
//             <div className="col-md-8 provider">
//                 <div className="row">
//                     <div className="col-md-3">
//                         <h1 className="available">
//                             Rate
//                         </h1>
//                     </div>
//                     <div className="col-md-9">
//                         <div className="row">
//                             <div className="col-md-4">
//                               <input placeholder="Rate per 1 session" className="form-control" onChange={this.handleRate1Change}/>
//                             </div>
//                             <div className="col-md-4">
//                               <input placeholder="Rate per 3 session" className="form-control"onChange={this.handleRate3Change}/>
//                             </div>
//                             <div className="col-md-4">
//                               <input placeholder="Rate per 12 session" className="form-control"onChange={this.handleRate12Change}/>
//                             </div>
//
//                         </div>
//
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div className="row">
//             <div className="col-md-8 provider">
//                 <div className="row">
//                     <div className="col-md-3">
//                         <h1 className="available">
//                             Free Consultation
//                         </h1>
//                     </div>
//                     <div className="col-md-9">
//                         <div className="row">
//                             <div className="col-md-4 available1">
//                                     <button type="button" className="btn one btn-default" value={"Yes"} onClick={this.handleFreeConsultationChange}>Yes</button>
//                                     <button type="button" className="btn two btn-default" value={"No"}  checked onClick={this.handleFreeConsultationChange}>No</button>
//                             </div>
//                         </div>
//
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div className="row">
//             <div className="col-md-8 provider">
//                 <div className="row">
//                     <div className="col-md-3">
//                         <h1 className="available">
//                             Portfolio
//                         </h1>
//                     </div>
//                     <div className="col-md-9">
//                         <div className="row">
//                             <div className="col-md-4">
//                               <input placeholder="Portfolio" className="form-control" onChange={this.handlePortfolioChange}/>
//                             </div>
//                             <div className="col-md-4">
//                                 <h1 className="available">
//                                     Website
//                                 </h1>
//                             </div>
//                             <div className="col-md-4">
//                               <input placeholder="Website" className="form-control"onChange={this.handleWebsiteChange}/>
//                             </div>
//                             </div>
//
//                         </div>
//
//                     </div>
//                 </div>
//         </div>
//         <div className="row">
//             <div className="col-md-8 provider">
//                 <div className="row">
//                     <div className="col-md-3">
//                         <h1 className="available">
//                             Social Media
//                         </h1>
//                     </div>
//                     <div className="col-md-9">
//                         <div className="row">
//                             <div className="col-md-4">
//                               <input placeholder="LinkedIn" className="form-control" onChange={this.handleLinkedInChange}/>
//                             </div>
//                             <div className="col-md-4">
//                               <input placeholder="FaceBook" className="form-control"onChange={this.handleFacebookChange}/>
//                             </div>
//                             <div className="col-md-4">
//                               <input placeholder="Twitter" className="form-control"onChange={this.handleTwitterChange}/>
//                             </div>
//                             </div>
//
//                         </div>
//
//                     </div>
//                 </div>
//         </div>
//         <div className="row">
//             <div className="col-md-8 provider">
//                 <div className="row">
//                     <div className="col-md-3">
//                         <h1 className="available">
//                             Photo
//                         </h1>
//                     </div>
//                     <div className="col-md-9">
//                         <div className="row">
//                             <label className="btn btn-default btn-file" id="circle">
//                               <input ref="file" type="file" name="user[image]" multiple="true" onChange={this._onChange}/>
//                           {/* Only show first image, for now. */}
//                           <img id="profile-pic"src={this.state.imgSrc}/>
//                             </label>
//                         </div>
//                     </div>
//                     <button type="button" className="btn btn-info" onClick={this.handleProviderSubmit.bind(null, this)}>Submit</button>
//                 </div>
//             </div>
//         </div>
//
//   </div>
