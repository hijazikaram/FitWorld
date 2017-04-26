var ProviderAvailable = React.createClass({
    getInitialState: function() {
        return {available: "", detailsArray: []};
    },
    handleChange(event) {
        this.setState({value: event.target.value});
    },
    onEditClick(available, index, event){
      this.props.onEditClicked(available, index, event);
      event.preventDefault();
      event.stopPropagation();
    },
    addAvailable(event){
      this.props.addAvailability(event);
    },

   onAvailabilityRemove(available, index, event){
     this.props.onAvailabilityRemoved(available, index, event);
     event.preventDefault();
     event.stopPropagation();
   },
   getTime(timeNumber){
     if(timeNumber == 0)
      return "12:00 am";

      if(timeNumber == 12)
        return "12:00 pm"

     if(timeNumber < 12)
      return timeNumber + ":00 am";

     return (timeNumber - 12) + ":00 pm";
   },
    render: function() {
        if (this.props.availability && this.props.availability.length > 0) {

            var rows = this.props.availability.map((available, index) => (
              <tr key={index}>
                <td>{available.day}</td>
                <td>{this.getTime(available.from)}</td>
                <td>{this.getTime(available.to)}</td>
                <td>
                  <button className="btn btn-primary" onClick={this.onEditClick.bind(null, available, index)}>Edit</button>
                  <button style={{ marginLeft: 10 }} className="btn btn-default" onClick={this.onAvailabilityRemove.bind(null, available, index)}>Remove</button>
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
                {this.props.availability.length > 0
                    ? <table className="table table-striped table-responsive table-bordered">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th style={{
                                        textAlign: "right"
                                    }}></th>
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
module.exports = ProviderAvailable;
