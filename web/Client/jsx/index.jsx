// ./src/index.jsx
import { render } from 'react-dom';
// Import routing components
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// Import custom components
import AdminPage from './adminPage.jsx'
// import Dashboard from './common/about.component.jsx'
import Settings from './provider.jsx'
// import Calender from './calender.jsx'
// import Chat from './chat.jsx'
// import Gigs from './gigs.jsx'

import { Provider } from 'react-redux'


import App from './app.jsx'
import SignIn from './signIn.jsx'
import Gigs from './addGigs.jsx'
import Home from './home.jsx'
import ProviderChat from './providerChat.jsx'
import ProviderCalendar from './providerCalendar.jsx'
import configureStore from "../store/configure-store";
const store = configureStore();

var HomePage = React.createClass({
  componentDidMount(){
    //action to get current user

  },
  render: function() {
      return (
        <Provider store={store}>
          <Router history={browserHistory}>
            <Route path="/providers/Home" component={App}>
              <IndexRoute component={Home}>
              </IndexRoute>
              <Route path="/providers/Home/Settings" component={Settings}>
              </Route>
              <Route path="/providers/Home/Gigs" component={Gigs}>
              </Route>
              <Route path="/providers/Home/Chat(/:clientId)" component={ProviderChat}>
              </Route>
              <Route path="/providers/Home/Calendar" component={ProviderCalendar}>
              </Route>
            </Route>
          </Router>
        </Provider>
      );
  }
})


module.exports = HomePage;
