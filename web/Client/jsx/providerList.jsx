var ProviderList = React.createClass({
    getInitialState: function() {
        return {skill: "", detailsArray: []};
    },
    handleChange(event) {
        this.setState({value: event.target.value});
    },
    onSkillRemove(){
     this.props.onSkillRemoved();
   },
    onEditClick(skill, event){
      this.props.onEditClicked(skill, event);
    },
    onAddClick(event){
      this.props.onAddClicked(event);
    },
     
    render: function() {
        if (this.props.skills && this.props.skills.length > 0) {

            var rows = this.props.skills.map((skill, index) => (
              <tr>
                <td>{skill.name}</td>

                <td>{skill.level}</td>
                <td>
                  {this.props.hideTable || true
                      ?  <span onClick={this.onEditClick.bind(null, skill)}>edit</span>: null}
                    <span onClick={this.onSkillRemove}>remove</span>
                </td>
            </tr>));

        } else {
            return (
                <span></span>
            );
        }

        return (
          <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-10 padding-left">

                {this.props.skills.length > 0
                    ? <table className="table table-striped table-responsive table-bordered">
                            <thead>
                                <tr>
                                    <th>Skill</th>
                                    <th>Level</th>
                                    <th style={{
                                        textAlign: "right"
                                    }}onClick={this.onAddClick}>+Add New</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>

                        </table>
                    : <span>You suck</span>}

            </div>
          </div>

        );
    }

});
module.exports = ProviderList;
