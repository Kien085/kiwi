$(document).ready(function() {

	firebase.initializeApp(config);
	var database = firebase.database();

	function populateTotalUserChart(totalUsers) {

		var ref = database.ref('/users/');

		ref.on("value", function(snapshot) {

			var totalUsers = snapshot.numChildren();
			
			// Generate dates
			var i;
			var dates = [];
			var today = new Date();
			for(i = 6; i >= 0; i--) {
				var date = new Date();
	  			date.setDate(today.getDate() - i);
	  			var str = date.getMonth() + "/" + date.getDate();
	  			dates.push(str);  
			}

			// Generate points
			var points = [];
			for(i = 0; i < 7; i++) {
				points[6 - i] = Math.ceil(totalUsers / (2 ** i));
			}

			main_chart = document.getElementById('main-chart');
			var data = [{ x: dates, y: points }];
			Plotly.purge(main_chart);
			Plotly.plot( main_chart, data, { margin: { t: 0 } } );


		}, function (error) {
   			console.log("Error: " + error.code);
		});

	}

	function populateDailyActiveUserChart() {

		var ref = database.ref('/dailyActiveUsers/');

		ref.on("value", function(snapshot) {

			var weekLabels = [];
			var weekUserCounts = [];

			var thisWeek = getWeek();

			thisWeek.forEach( (day) => {

				var formattedDay = moment(day).format("YYYY-MM-DD");

				if(snapshot.hasChild(formattedDay)) {

					weekLabels.push(formattedDay);
					weekUserCounts.push(snapshot.child(formattedDay).numChildren());

				}

			});

			main_chart = document.getElementById('main-chart');
			var data = [{ x: weekLabels, y: weekUserCounts }];
			Plotly.purge(main_chart);
			Plotly.plot( main_chart, data, { margin: { t: 0 } } );

		});
	}
	

	function getDateArray(duration) {

		var i;
		var dates = [];
		var today = new Date();
		if(duration == "week") {

			// This past week MM/DD
			for(i = 6; i >= 0; i--) {
				var date = new Date();
			  	date.setDate(today.getDate() - i);
			  	var str = date.getMonth() + "/" + date.getDate();
			  	dates.push(str);  
			}
			return dates;

		} else if(duration == "month") {

			// This past month MM/DD
			for(i = 31; i >= 0; i--) {
				var date = new Date();
			  	date.setDate(today.getDate() - i);
			  	var str = date.getMonth() + "/" + date.getDate();
			  	dates.push(str);  
			}
			return dates;

		} else if(duration == "year") {

			// This past year M
			for(i = 12; i >= 0; i--) {
				var date = new Date();
			  	date.setDate(today.getDate() - i);
			  	var str = date.getMonth() + "/" + date.getDate();
			  	dates.push(str);  
			}
			return dates;

		}
	}

	function loadTopViews() {

		// Top info
		var totalUsers = $("#top-total-users");
		var usersOnline = $("#top-users-online");

		var ref = database.ref('/users/');

		// Update total users
		ref.on("value", function(snapshot) {
			totalUsers.text(snapshot.numChildren());
		});

		var todayStr = moment().format("YYYY-MM-DD");
		ref = database.ref('/dailyActiveUsers/' + todayStr);
		ref.on("value", function(snapshot) {
			usersOnline.text(snapshot.numChildren());
		});

	}


	function updateView(type) {

		loadTopViews();

		// Main chart
		var graphTitle = $("#graph-title");
		var graphSubtitle = $("#graph-subtitle");

		var today = new Date();
		var months = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];
		graphSubtitle.text(months[today.getMonth() + 1] + " " + today.getFullYear());

		if(type === "num-users") {

			graphTitle.text("Total Number of Users");
			populateTotalUserChart();

		} else if(type === "daily-active") {

			graphTitle.text("Daily Active Users");
			populateDailyActiveUserChart();

		} else if(type === "subscriptions") {

			graphTitle.text("Number of Subscriptions");

		} else if(type === "advertising") {

			graphTitle.text("Advertising");

		} else {
			console.log("Error: Unknown Content Requested")
		}
	}

	function getWeek(){

		var startOfWeek = moment().startOf('week');
		var endOfWeek = moment().endOf('week');

		var days = [];
		var day = startOfWeek;

		while (day <= endOfWeek) {
    		days.push(day.toDate());
    		day = day.clone().add(1, 'd');
		}

		return days;

	}   

	// Add handlers
	$("#num-users-nav").on('click', () => updateView('num-users'));
	$("#daily-active-nav").on('click', () => updateView('daily-active'));
	// $("#subscriptions-nav").on('click', () => updateView('subscriptions'));
	// $("#advertising-nav").on('click', () => updateView('advertising'));


	updateView("num-users");

});