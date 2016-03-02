CART
====

The merchant portal for Chargeback.com.

## Getting Started

To get you started you can simply clone the chargeback repository and install the dependencies:

### Prerequisites

You need git to clone the chargeback repository. You can get git [here][git].

We also use a number of node.js tools to initialize and test CART. You must have node.js and
its package manager (npm) installed.  You can get them [here][node]. 
We're currently using version 0.12.2. You can use [n][n] if you need to manage nodejs versions.

### Clone CART

Clone the chargeback.com repository using [git][git]:

```
git clone https://github.com/hamidsardar/cart.git
cd cart
```

### Install Dependencies

We have two kinds of dependencies in this project: nodejs tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

If you get an error like "/bin/sh: 1: bower: not found", then run:

```
npm install -g bower
```

to install the bower package.

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `public/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
we've changed this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.*

*Note: if you make any changes to bower.json (add client side lib) or package.json (add npm) you'll need to run "npm install" again. npm install is not autorun due to performance issues and speed of restarting all the time.*


### Install configs

The application needs two config files or ENVs set to work. When running locally you can 
just put these in .env in the document root. When running in production, these should be set
in the environment. Here are the values that need proper config values:

```
PORT=
NODE_ENV=development
SSL=off
TOKEN_SECRET=
MONGO_URI=mongodb://localhost:27017/chargeback
NEWRELIC=
AIRBRAKE=
AWS_KEY=
AWS_SECRET=
BUCKET=chargebackcom
AWS_REGION=us-west-2
S3_ACL=public-read
S3_STORAGE_CLASS=STANDARD
SQS_QUEUE=
SQS_QUEUE_DOCGEN=
CALLBACK_HOST=http://localhost:5000
CDN=
AWS_ACCESS_KEY_ID=$AWS_KEY
AWS_SECRET_ACCESS_KEY=$AWS_SECRET
POSTMARK_API_KEY=
MAIL_FROM_NAME=Chargeback
MAIL_FROM_EMAIL=pull.user@chargeback.com
CODEDEPLOY=
CODEDEPLOY_SECRET=
DOCGEN=https://s3-us-west-2.amazonaws.com/cart-pdfs/
```

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
npm start
```

Now browse to the app at `http://localhost:5000/`.

*Note: In development the server is started with nodemon so any changes to test controllers will automatically restart the nodejs server.*

## Directory Layout

```
.env                    --> ENV variables, including AWS credentials for builds (should not be in repo!!!)
.env-test               --> ENV variables for testing (should not be in repo!!!)
public/                 --> all of the source files for the client side application
  app/                  --> custom CART angular code
    modules/            --> Angular JS modules per view
    templates/          --> HTML files 
    tests/              --> unit tests per controller, run via npm test and during build
  fonts/                --> font assets files
  images/               --> image asset files
  less/                 --> less css files (does not include bootstrap libs installed via bower)  
  lib/                  --> js utilities (directives and services)
  index.html            --> app layout file (the main html template file of the app)
  admin.html            --> admin UI layout file (the main html template file of the admin app)
dist/                   --> dir created by running npm build, stores compiled production files
node_modules/           --> dir created by running npm install, stores npm modules
karma.conf.js           --> config file for running unit tests with Karma
bower.json              --> bower install configuration, or all required libs
Gruntfile.js            --> build recipes to create production files, run via "npm build"
e2e-tests/              --> end-to-end tests
  protractor-conf.js    --> Protractor config file
  scenarios.js          --> end-to-end scenarios to be run by Protractor
lib/                    --> nodejs lib, for testing only
models/                 --> nodejs mongoose model definitions - for test data only
controllers/            --> nodejs files for servering fake REST API
views/                  --> EJS templates for emails
test/                   --> mocha server side unit tests, the main dir contains mostly config options
  tests/                --> individual unit tests 
index.js                --> the main application file
server.js               --> the server launch file (separated out from index for testing purposes)
appspec.yml             --> config for deploying the application in AWS's CodeDeploy
deploy_hooks/           --> scripts called from within appspec.yml for starting and stopping server during CodeDeploy
.travis.yml             --> file that provides travis with proper testing and deployment instructions
newrelic.js             --> new relic config info, newrelic is only run in production
```


## Testing

There are two kinds of tests in the application: Unit tests and End to End tests.

### Running Unit Tests

*Note: **DO NOT RUN TESTS LOCALLY**. This section is left here for archival purposes, but tests are handled through
[Travis][travis] builds when committing/pull requesting to Github.*

To run tests locally, we'll also need .env-test installed with a copy of the values in the "install configs" section.
However, use a test db when running tests at the tests clear out the entire contents to run tests from scratch.
DO NOT TEST ON ANY REAL DATA!!!! You can copy the above and simply change the MONGO_URI! E.g.,

```
MONGO_URI=mongodb://localhost:27017/chargeback-TEST
```

The app comes preconfigured with unit tests for both the server and the web client.
The client tests are written in [Jasmine][jasmine], which we run with the 
[Karma Test Runner][karma]. We provide a Karma configuration file to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found in the public/app/tests folder

The server tests use Mocha. The Mocha dependency is installed with "npm install".
The individual tests are outlined in test/tests. The easiest way to run the server side
unit tests is to use the supplied npm script:

```
npm test
```

@TODO: unit tests are fully functioning and working well. I have not spent much time on Karma tests!

This script will start the Karma test runner to execute the unit tests. Moreover, Karma will sit and
watch the source and test files for changes and then re-run the tests whenever any of them change.
This is the recommended strategy; if your unit tests are being run every time you save a file then
you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit. A single run test is run during
the build process or via the command below...

```
npm run test-single-run
```


### End to end testing

@TODO: unit tests are fully functioning and working well. I have not spent much time on end-to-end

The app comes with end-to-end tests, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

In addition, since Protractor is built upon WebDriver we need to install this.  The 
project comes with a predefined script to do this:

```
npm run update-webdriver
```

This will download and install the latest version of the stand-alone WebDriver tool.

Once you have ensured that the development web server hosting our application is up and running
and WebDriver is updated, you can run the end-to-end tests using the supplied npm script:

```
npm run protractor
```

This script will execute the end-to-end tests against the application being hosted on the
development server.

## Logging

Logs on production machines can be found in this dir: /var/www/
There are logs for forever (process manager), regular node, and errors.

### Bugs and errors

Errors are being sent to [Airbrake.io][airbrake]. This
service is okay, not sure it is worth keeping, but can be used to detect some important errors.

Username: chargeback@infoshreve.com, Password: achaiV0ien6iech

Free account only allows one user.

### Server information

Servers can be monitored in a variety of ways:

1. AWS OpsWorks - shows status of various machines (dev and production), as well as mongo servers.
You can spin up new instances here and scale things within OpsWorks. (See *AWS* below)
2. [MMS](https://mms.mongodb.com/host/list/54bd6bd6e4b047dcccb3e48d) - the mongo monitoring and configuration tool. This is where mongo should be scaled. This service is on free tier as well.
3. [NewRelic](https://rpm.newrelic.com/accounts/889104/applications/4976726) -  shows requests, timing, traffic, responses, and much much more. We're on free tier right now. There are ping alerts set up to monitor the app here too.
4. GA - CART is being fully tracked inside the main Chargeback GA account.

## Production Build Process

The build process is taken care of by [Travis][travis]. When you push a
commit to github, Travis will automatically build the app and run unit tests (eventually end-to-end tests too).
This will happen on ANY branch you push. If you push to the "dev" branch, then travis will build, test, and deploy
to the dev servers set up in AWS's CodeDeploy. If you push to the "master" branch, then travis will build, test, and deploy
to the production servers set up in AWS's CodeDeploy.

SUGGESTED WORK FLOW:
It is recommended to follow the github pull-request flow. When working on a feature do it in a branch, like
"jgs-user-refactor". When you're done, run npm test locally, see if it passed unit test. Then push the branch
to github, which will trigger the travis build and tests. If they pass, create a "pull-request" inside github
on that branch ("dev" <- "jgs-user-refactor") and have someone do quick code review. If the code review is good,
auto merge the pull-request, which will in turn run another set of unit tests (sort of redundant, but good to
test after a merge) and actually deploy the changes to the dev servers. When deploying to production, create a
large pull-request from "dev" to "master". Review it and when you merge, the system will automatically deploy to
all production machines, since you've in essence just pushed to the master branch.


You can also run the build process manually for debugging purposes...

The build process requires Grunt `~0.4.1` which is installed via npm install (no need to install separately).

If you haven't used [Grunt][grunt] before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. 

Gruntfile.js contains a full configuration to fully build the app for production purposes. Here is a full list of what goes on...

1. jshint - look for any blatant js errors.
2. clean:old - cleans out old dist files
3. copy:html - copy public/index.html to dist/index.html
4. copy:images - copy public/images to dist/images
5. copy:fonts - copy public/fonts to dist/fonts
6. useminPrepare - usemin aggregates and renames files for production
7. ngtemplates - build cacheable angularjs templates into a js file
8. concat:generated - concat all js files into a single js file
9. less:generated - take less files and make single css file
10. uglify - compress and minify js file
11. karma - run karam unit tests on production code (single)
12. cssmin - minify newly created css file into new css file
13. clean:origcss - remove original chargeback.css
14. copy:cssmin - move chargeback.min.css to chargeback.css
15. filerev - get md5 versions for all asset files for cache-busting
16. usemin - usemin swaps out code from index.html to index.html with new settings from above scripts, renames stuff like versioned files
17. clean:tmp - clean up all the generated garbage
18. cdn - swaps in CDN URLs where needed (vs local refs)
19. replace - replace /images in JS files with CDN/images (cdn doesn't do this :( )
20. s3 - copy all dist files to S3

The output of the grunt process is found in ./dist. To run the build process...

```
grunt build --target=(index|admin) // defaults to index if --target it not provided
```

or run with --verbose for more information. Then check ./dist for the results. You can run the following to boot up the nodejs app using the production files for testing. Production mode basically uses ./dist directory versus ./public directory as the root web folder.

## AWS

To deploy a new EC2 instance, do the following:

* Log in to the [AWS console](https://529278774801.signin.aws.amazon.com/console)
* Select OpsWorks, select "cart dev" or "cart prod", select "Instances" from the sidebar, and click `+ Instance`
* Enter a name, select "t2.micro" for the size, leave the other options as is, click "Add Instance", then click `> Start` for the new instance
* Once the instance is started, open a console and ssh into `<username>@<PublicIP>`
    * If you are unable to log in, contact someone to get your key set up
* Edit `/etc/environment` (use `sudo`) and replace the contents with the contents of either `environment-dev` or `environment-prod` (currently found at `office_share/system/files/cart`)
* In AWS, go to CodeDeploy, select "cart", expand "devs" or "production", click the "details" button, and click "edit"
* At the bottom of the table under "Add Instances", add a new "Amazon EC2" entry, with the key being `opsworks:instance` and the value being the name of the new instance. Click "save" at the bottom afterwards.
* Return the "CodeDeploy -> cart" screen, then on the revision list, expand revisions until you find the latest revision that was deployed to your desired group, then select "Deploy This Revision"
* Set "Application" to `cart` and "Deployment Group" to your desired group, leave the rest as is, and click "Deploy Now"
    * After the deployment finishes, you can test the new instance by entering its IP address into your browser

[git]: http://git-scm.com/
[node]: http://nodejs.org/
[n]: https://github.com/tj/n
[npm]: https://www.npmjs.com/
[bower]: http://bower.io/
[jasmine]: http://jasmine.github.io/
[protractor]: https://angular.github.io/protractor/#/
[travis]: https://travis-ci.org/
[karma]: http://karma-runner.github.io/0.13/index.html
[airbrake]: https://cartdev.airbrake.io
[grunt]: http://gruntjs.com/
