var DeleteModal = React.createClass({
    getInitialState: function() {
         return  {
         };
     },
     componentWillReceiveProps : function(nextProps) {
         var provider = nextProps.provider;
         this.setState(provider)
     },
    show() {
        $(this.refs.deleteModal).modal("show");
    },
    hide() {
        $(this.refs.deleteModal).modal("hide");
    },
    render: function() {
      var provider = this.props.provider || {};
        return (
            <div id="myModal" className="modal fade" role="dialog" ref="deleteModal">
              <div className="modal-dialog">
                <div className="modal-content">
                      <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                              <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                          </button>
                          <h4 className="modal-title custom_align" id="Heading">Delete this entry</h4>
                      </div>
                      <div className="modal-body">

                          <div className="alert alert-danger">
                              <span className="glyphicon glyphicon-warning-sign"></span>
                              Are you sure you want to delete this Provider?</div>

                      </div>
                      <div className="modal-footer ">
                        <form name="deleteproviderForm" action="/providers/adminPage/delete" method="post">
                          <input type="hidden" name="displayName" value={provider.value}/>
                          <button type="submit" className="btn btn-success" >
                              <span className="glyphicon glyphicon-ok-sign"></span>
                              Yes</button>
                          </form>
                          <button type="button" className="btn btn-default" data-dismiss="modal">
                              <span className="glyphicon glyphicon-remove"></span>
                              No</button>
                      </div>
                  </div>
            </div>
          </div>
        );
    }
})
module.exports = DeleteModal;
