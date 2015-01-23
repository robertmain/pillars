#Pillars

##Quick Command Reference

- **`gulp app:serve`**  
  Starts the app, builds the app, sets up browsersync and generally does everything you need. If you're looking to get started building ASAP, this is likely what you need

- **`gulp app:build`**  
  Builds a copy of the code, installs all dependencies, and does everything that `gulp app:serve` does but with no web server. This is useful for continuous integration environments (protip: use with the ``--production`` flag for CI!). Runs all tests in development mode and displays a JavaScript code complexity report(not in production mode though).

    - **`gulp app:build:js:src`**  
    Rebuilds a copy of your application's JavaScript code. If you specify `--production`, the code will be minified as well and tests/complexity reports will be skipped. 

    - **`gulp app:build:js:vendor`**  
    As above, however `--production` has no effect on this command (third party JavaScript is _always_ minified)

    - **`gulp app:build:style:src`**  
    Rebuilds a copy of your application's styling code. If you specify `--production`, the code will also be minified. 

    - **`gulp app:build:style:vendor`**  
    As above, however `--production` has no effect on this command (third party CSS is _always_ minified).

    - **`gulp app:build:html:src`**  
    Rebuilds a copy of your application's HTML. If you specify `production`, the code will be minified.

- **`gulp app:test:js`**
  Runs any and all unit tests as specified in `/test`

**Please note: ** The `--production` flag can be applied to any of the above commands (although with any vendor tasks it will have little to no effect)

##Installation and Initial Setup
1. You will require a global installation of gulp and bower. To get these run `npm install -g gulp bower`. On linux this will require super-user access
1. To install the server side dependencies first run: `npm install`
1. To start the app and install any client side dependencies outlined in `bower.json` simply run `gulp app:serve` (see below for exactly what this does).
1. Now all you need to do is write your code in `/frontend/src/`  
   **DO NOT WRITE ANY CODE IN `/frontend/build` OR `/frontend/libraries`**


##Adding Client Side Dependencies
1. If you wish to add any client-side dependencies such as bootstrap, jQuery UI etc. either manually add it to `bower.json` or, run `bower install <bower package>` and re-start the application.
1. Any JS will be automatically minified and added to `/frontend/build/scripts/vendor.json`, any CSS/SASS/SCSS will automatically be compiled and added to `/frontend/build/styles/vendor.css`

##How Does It Work?
After being sick and tired of repeatedly downloading the same dependencies and saving them to file and gunking up the application code with external dependencies such as bootstrap and jQuery, Pillars is written around the idealogy of letting you get coding as quickly as possible and handling as much of the boring stuff for you as posssible.  

For this reason, Pillars ships with AngularJS, AngularJS Mocks (unit testing) and AngularJS UI Router(state based routing for Angular) setup out of the box. All of this can be disabled/removed if you wish (although it is strongly recommended to keep the unit tests!). To remove something, simply delete it's entry in `bower.json` and restart the app

###Under The Hood
When you run `gulp app:serve` several things happen. In order these are:  

####In Development Mode(Default)
1. The entire `frontend/build` directory is erased (to clean up after old builds)
1. Any external client-side dependencies are downloaded, concatenated into one file (`frontend/build/scripts/vendor.js`[in the case of third party styling dependencies such as bootstrap this would be `styles/vendor.css`!]). This is then minified (vendor libraries are _always_ minified, since we shouldn't be debugging them). This is all done in parralell with the concatenation of our app styling code and our app JavaScript.
1. All our app code is then run through a code beautifier to tidy up any indentation issues and formatting issues(yes, even the HTML!). This makes it easier to debug on the client side.
1. A JavaScript code complexity report is shown for `frontend/build/scripts/src.js`
1. Any and all tests are run(these can be found in `/test`)
1. A watch task is then set to watch the relevant files (for example JS) and re-process them if they are edited
1. An express web server is then started to serve up our application. 
1. A proxy is created connecting to our webserver and also providing BrowserSync/AutoReload
1. A localtunnel connection is created for remote debugging purposes
1. The app is running and ready to use!

####In Production Mode
1. Instead of running `gulp app:serve` run `gulp app:serve --production`
1. The entire `frontend/build` directory is erased (to clean up after old builds)
1. Any external client-side dependencies are downloaded, concatenated into one file (`frontend/build/scripts/vendor.js`[in the case of third party styling dependencies such as bootstrap this would be `styles/vendor.css`!]). This is then minified (vendor libraries are _always_ minified, since we shouldn't be debugging them). This is all done in parralell with the concatenation of our app styling code and our app JavaScript.
1. All our app code is then run through a code minifier to compress it as much as possible(yes, even the HTML!). This makes the payload size smaller for deployment to a CDN(or just to make the site load faster).
1. A watch task is then set to watch the relevant files (for example JS) and re-process them if they are edited
1. An express web server is then started to serve up our application. 
1. A proxy is created connecting to our webserver and also providing BrowserSync/AutoReload
1. A localtunnel connection is created for remote debugging purposes
1. The app is running and ready to use!

#####A word on web servers
Since this application includes gulp it is possible to use this to serve up the application in production. However, since this also includes BrowserSync and is not designed with security in mind  
**!!IT IS STRONGLY RECOMENDED THAT YOU DO NOT DO THIS!!**.  
Instead, if you wish to deploy to production, simply use the webserver that comes bundled with Pillars - `frontend.js`. Running `node frontend.js` will start a web server running on port 8000 (or whatever port you specify in `/frontend/config.js`).