![logo](https://raw.githubusercontent.com/djblue/pnpm/master/public/pnpm.png)

<a href="https://travis-ci.org/djblue/pnpm">
  <img src="https://travis-ci.org/djblue/pnpm.svg?branch=master"/></a>

[Demo](https://pnpm.herokuapp.com/).

A simple to setup and use private npm registry service. This is intended
for small teams in a corporate environment that want to experiment with
node and use one of its best features for internal code, npm.

    git clone https://github.com/djblue/pnpm.git
    cd pnpm; npm install; npm start

If you need to specify a version of python or msvs depending on your platform:

    npm install --python=python2
    npm install --msvs_version=2013

__NOTE__: since the demo site is using heroku and leveldb uses the file system,
published packages will be removed whenever heroku resets the slug.

# Goals

- Simple to setup (git clone, npm install).
- Cross platform compatibility (linux, windows).

## Supported

- adduser (but no authorization)
- search
- publish
- install (proxy/cache npmjs.org but priority given to locally published
  packages)
- unpublish (working on this)

## Web Frontend

There is also a web front end that allows you to browse your private
packages, just go [here](http://localhost:3000). The interface is borrowed
directly from the [npm website](https://www.npmjs.org/) because I am not
original and they did a good job, so why not borrow?

## Tests

There are two sets of tests, ones that test internal transformations
located in __unit directory__, and ones that test compatibility with the
npm client in __npm directory__. They both use mocha as the test runner
and most of the npm tests are borrowed directly from [npm
registry](https://github.com/npm/npm-registry-couchapp/tree/master/test).

To run all tests, run:

    npm test

__NOTE__: the tests use your current installation of npm, so if tests don't
pass try updating npm. I have only tested against version __1.4.21__.

To check npm version run:

    npm --version
