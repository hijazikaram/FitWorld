var Education = React.createClass({
    getInitialState: function() {
        return {institution: "", degree: ""};
    },
    handleChange(event) {
        this.setState({value: event.target.value});
      },

      onEducationRemove(){
       this.props.onEducationRemoved();
     },

    onAddClick(event){
      this.props.onAddClicked(event);
    },
    render: function() {
        if (this.props.education && this.props.education.length > 0) {

            var rows = this.props.education.map((education, index) => (
              <tr>
                <td>{education.institution}</td>
                <td>{education.degree}</td>
                <td>
                    <span onClick={this.onEducationRemove}>remove</span>
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

                {this.props.education.length > 0
                    ? <table className="table table-striped table-responsive table-bordered">
                            <thead>
                                <tr>
                                    <th>Institution</th>
                                    <th>Degree</th>
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
module.exports = Education;
