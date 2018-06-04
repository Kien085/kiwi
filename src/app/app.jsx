// Import external components refrence
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { Provider } from 'react-redux';
import store, { history } from 'configureStore';
import { ConnectedRouter } from 'react-router-redux';

// - Import app components
import Master from 'Master';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// App css
require('applicationStyles');
const supportsHistory = 'pushState' in window.history;

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
				<Master />
			</MuiThemeProvider>
		</ConnectedRouter>
	</Provider>,
	document.getElementById('app')
);
