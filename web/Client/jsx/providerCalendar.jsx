import { connect } from "react-redux";
// Import custom components
import { clients } from "../actions/providers";

var ProviderCalendar = React.createClass({
  getInitialState() {
    return {

    }
  },

  render: function() {
      return (
          <div className="wrapper wrapper-content">
            <div className="row animated fadeInDown">
                <div className="col-lg-3">
                    <div className="ibox float-e-margins">
                        <div className="ibox-title">
                            <h5>Draggable Events</h5>
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
                            <div id='external-events'>
                                <p>Drag a event and drop into callendar.</p>
                                <div className='external-event navy-bg'>Go to shop and buy some products.</div>
                                <div className='external-event navy-bg'>Check the new CI from Corporation.</div>
                                <div className='external-event navy-bg'>Send documents to John.</div>
                                <div className='external-event navy-bg'>Phone to Sandra.</div>
                                <div className='external-event navy-bg'>Chat with Michael.</div>
                                <p className="m-t">
                                    <input type='checkbox' id='drop-remove' className="i-checks" checked /> <label for='drop-remove'>remove after drop</label>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="ibox float-e-margins">
                        <div className="ibox-content">
                            <h2>FullCalendar</h2> is a jQuery plugin that provides a full-sized, drag & drop calendar like the one below. It uses AJAX to fetch events on-the-fly for each month and is
                            easily configured to use your own feed format (an extension is provided for Google Calendar).
                            <p>
                                <a href="http://arshaw.com/fullcalendar/" target="_blank">FullCalendar documentation</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-9">
                    <div className="ibox float-e-margins">
                        <div className="ibox-title">
                            <h5>Striped Table </h5>
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
                            <div id="calendar"></div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

      );
  }
})

ProviderCalendar.propTypes = {
  dispatch: React.PropTypes.func
};

ProviderCalendar.defaultProps = {
  dispatch: () => {}
};

export default connect((state) => ({
  user: state.data.user
}))(ProviderCalendar);
