
var Packages = React.createClass({
    getInitialState: function() {
        return {package1: "", detailsArray: []};
    },
    handleChange(event) {
        this.setState({value: event.target.value});
    },
    onPackageRemove(){
   this.props.onPackageRemoved();
 },
    onEditClick(package1, event){
      this.props.onEditClicked(package1, event);
    },
    onAddClick(event){
      this.props.onAddClicked(event);
    },
    render: function() {
        if (this.props.packages && this.props.packages.length > 0) {
          var packages = this.props.packages.sort((p1, p2) => p1.numSessions - p2.numSessions);

            var rows = packages.map((package1, index) => (
              <tr>
                <td>{package1.numSessions}</td>

                <td>{package1.price}</td>
                <td>

                    <span onClick={this.onPackageRemove}>remove</span>
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

                {this.props.packages.length > 0
                    ? <table className="table table-striped table-responsive table-bordered">
                            <thead>
                                <tr>
                                    <th>Rate</th>
                                    <th>Price</th>
                                    <th></th>
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
module.exports = Packages;
