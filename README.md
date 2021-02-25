# Coursework
coffida server for coffee review app

My git repository is available in the master branch at:

https://github.com/TianneMarshall/Coursework/tree/master

I followed the Airbnb style guide to improve my code quality. I used ESLint to give errors where the code quality was poor or could be improved to adhere to the Airbnb style guide. For example, I imported PropTypes from 'prop-types' and defined all props in my code to remove an error that the linter displayed to me: 'prop is missing in props validation'. The linter would often automatically fix the code that gave errors when I clicked 'Quick fix' which presented a list of options that would fix the code or remove the error. However, there are a few changes that I had to make manually where the linter did not offer to automatically fix the issue. For example, I got en error that one of my methods should be placed after another method. This I had to do myself because the linter did not offer to do this automatically. I also converted all of my fetch requests that require string concatenation to the Airbnb template.

I disabled the style rule that requires camelCase because the object properties in the database are written using underscores. I also disabled the no use before define rule because linter gave errors where I used a stylesheet because I defined my stylesheets at the end of each file. 

When navigating to myLocation.js in my app after selecting the second icon in the search bar on the homescreen, the app will request permission to use the device's location. I experienced a bug sometimes which means the user must click 'Allow', then click the back button, then navigate back to the myLocation.js screen and then select 'ok' to access the location services of the app.
