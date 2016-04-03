### A NodeJS application based on the [BART API](http://api.bart.gov/docs/overview/index.aspx)
# BART API MeAN

Writing a web application using the Javascript MeAN Stack. The application is designed to give users access to San Francisco Bay Area Rapid Transit train schedules. All a user has to do is put in their destination. With a destination the app will give them results for a trip to that destination from the closest BART station. The trip details will include the departure time, arrival time, and all stations in between.

# What the app should do?

###### Main.html
1) When the user loads this page the "You are here" dropdown should show the nearest BART Train station
2) If the user clicks on the "You are here" dropdown they should get a list of all the BART Train stations
3) When the user clicks on the "Destination Stations" dropdown they should get a list of all the BART Train stations, 
3.a) minus the station that is already loaded into the "You are here" dropdown
4) If user clicks "Next Train" they get all the times of trains leaving the "You are here" station next
5) If user clicks "Trip Details" they get DETAILS of a trip Originating at the "You are here" station and ending at the "Destination Station" dropdowns
5.a) DETAILS = 
- Train Time leaving "You are here" station next
- All stations on the trip route in order of first to last, including arrival times. Ending with the "Destination Stations" station
- Total trip time from start to end

MEAN Stack ![MEAN Stack_image](https://upload.wikimedia.org/wikipedia/commons/b/b1/Meanstack-624x250.jpg)



What is the MEAN Stack ![MEAN Stack_image_verbose](http://amartam.com/images/mean2.png)