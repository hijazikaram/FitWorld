var Languages = React.createClass({
    getInitialState: function() {
        return {language: ""};
    },
    handleChange(event) {
        this.setState({value: event.target.value});
      },

      onLanguageRemove(){
     this.props.onLanguageRemoved();
   },

    onAddClick(event){
      this.props.onAddClicked(event);
    },
    render: function() {
        if (this.props.languages && this.props.languages.length > 0) {

            var rows = this.props.languages.map((language, index) => (
              <tr>
                <td>{language}</td>
                <td>

                    <span onClick={this.onLanguageRemove}>remove</span>
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

                {this.props.languages.length > 0
                    ? <table className="table table-striped table-responsive table-bordered">
                            <thead>
                                <tr>
                                    <th>Languages</th>
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
module.exports = Languages;
