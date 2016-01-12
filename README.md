# Todo App

This is an (almost) empty repository, meant for you to fill (from scratch) to
make a front end app using modern web development build tools.

# Prerequisites

* [node](https://nodejs.org/en/) (you'll need version 4.x or above)
* [npm](https://www.npmjs.com/) (should come with node)
* [bower](http://bower.io/) (install with `npm install -g bower`)
* [git](http://git-scm.com/)
* A command-line terminal
  * OS X - Look in /Applications/Utilities/Terminal.app
  * Windows - When git is installing, select the bash tool and use that.
    Other-wise, use PuTTY, or you're on your own.

# Instructions

## Clone

Fork this repository to your github user account, and clone it to your computer.
Navigate to the project directory in your terminal.

## Project Setup

### `.gitignore`

First, you'll need a `.gitignore` file. This tells git which files to ignore
so you don't accidentally commit them to source control. You usually want to
ignore things like log files, sensitive configuration files, system generated
files like `.DS_Store` and `Thumbs.db` files. In our case, we want to ignore the
`node_modules/` and `bower_components/` directories as well. This is what your
`.gitignore` file should look like:

```
.DS_Store
*.db
*.log
node_modules
bower_components
```

You might note that there is also a folder called `.git/`. This is ignored
always by git. This is where it stores all of the revision information for your
repository and keeps track of where to push your code changes.

### `package.json`

Next, you'll want to have a `package.json` to keep track of your project
dependencies. To auto-generate a `package.json` file, run the following command:

```sh
npm init
```

After you press enter, it will ask you a series of questions, like the project
name, description, version, and other things. It's not super important what you
answer because you can always change them.

After that's done, you should have a `package.json` in your directory. Great!
To make sure that we don't accidentally publish this as an `npm` module, add
`"private": true,` to your `package.json`. So your `package.json` should look
something like this:

```json
{
  "name": "todo-app",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "gh:dgm-ria-fall-2015/todo-app"
  },
  "author": "",
  "license": "ISC"
}
```

### `bower.json`

To initialize your `bower.json`, run:

```
bower init
```

It will go through the same types of questions as `npm init` asked. One of the
last ones will ask you if you want to mark it as private. The default is no,
but you'll want to say yes to that one so you don't accidentally publish it as
a bower component.

Your `bower.json` should look something like this:

```json
{
  "name": "todo-app",
  "version": "0.0.0",
  "authors": [
    "ksmithut <ksmith.ut@gmail.com>"
  ],
  "description": "",
  "main": "",
  "moduleType": [],
  "license": "MIT",
  "homepage": "",
  "private": true,
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ]
}
```

### `src/`

We need to set up our source code directory. This directory will be where we put
the files we'll actually work with. The files we actually want the browser to
use will be minified, concatenated, versioned, and have source maps. So, we need
to have a good folder schema in order to keep track of everything. Here are the
things we need:

* Scripts
* Styles
* Templates
* Other Static Files (such as images and fonts)

So, let's make directories for each of those. Your directory structure should
look something like this:

```
src/
├── scripts/   - This is where our javascript will go
├── static/    - This is where our images and stuff will go
├── styles/    - This is where our css/styles will go
└── templates/ - This is where our templates will go
```

### `gulpfile.js`

We're going to be using [`gulp`](http://gulpjs.org/) as our build process tool.
Gulp facilitates the reading of files and passing them through processing
plugins that modify the contents and then stream the results to an output
directory. We'll use several plugins to help process and minify our code to be
super optimized for downloading and parsing.

Let's start by installing `gulp` as a global module:

```sh
npm install -g gulp
```

Next, let's install some gulp plugins locally so that we can use them in our
project. We're going to use the `--save-dev` flag to save these dependencies as
devDependencies in our `package.json`.

```sh
npm install --save-dev gulp gulp-concat gulp-htmlmin gulp-livereload gulp-load-plugins gulp-pleeease gulp-plumber gulp-sourcemaps gulp-uglify bower-files eslint express
```

Now that we've got our dependencies, go ahead and create a `gulpfile.js` in your
project directory. We're not going to go super in depth as to everything that is
happening here because we need to focus on building awesome apps. If you'd like
to know more of the details about what's going here, contact me and I can go
more in depth

This is what it should look like:

```js
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var express = require('express');
var lib = require('bower-files')({
  overrides: {
    bootstrap: {
      main: [
        'dist/js/bootstrap.js',
        'dist/css/bootstrap.css',
        'dist/fonts/*'
      ]
    }
  }
});

gulp.task('default', [
  'fonts',
  'scripts',
  'styles',
  'static',
  'templates'
]);

gulp.task('watch', [
  'fonts',
  'scripts.watch',
  'styles.watch',
  'static.watch',
  'templates.watch',
  'server',
  'livereload'
]);


gulp.task('scripts', function () {
  return gulp.src(lib.ext('js').files.concat('src/scripts/**/*.js'))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
      .pipe($.concat('app.min.js'))
      .pipe($.uglify())
    .pipe($.sourcemaps.write('../maps'))
    .pipe(gulp.dest('build/js'));
});
gulp.task('scripts.watch', ['scripts'], function () {
  gulp.watch('src/scripts/**/*.js', ['scripts']);
});


gulp.task('styles', function () {
  return gulp.src(lib.ext('css').files.concat('src/styles/**/*.css'))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
      .pipe($.concat('app.min.css'))
      .pipe($.pleeease())
    .pipe($.sourcemaps.write('../maps'))
    .pipe(gulp.dest('build/css'));
});
gulp.task('styles.watch', ['styles'], function () {
  gulp.watch('src/styles/**/*.css', ['styles']);
});


gulp.task('static', function () {
  return gulp.src('src/static/**/*')
    .pipe($.plumber())
    .pipe(gulp.dest('build'));
});
gulp.task('static.watch', ['static'], function () {
  gulp.watch('src/static/**/*', ['static']);
});

gulp.task('fonts', function () {
  return gulp.src(lib.ext(['eot', 'svg', 'ttf', 'woff']).files)
    .pipe($.plumber())
    .pipe(gulp.dest('build/fonts'));
});


gulp.task('templates', function () {
  return gulp.src('src/templates/**/*.html')
    .pipe($.plumber())
    .pipe($.htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('build'));
});
gulp.task('templates.watch', ['templates'], function () {
  gulp.watch('src/templates/**/*.html', ['templates']);
});


gulp.task('server', function () {
  var app = express();
  app.use(express.static('build'));
  app.listen(8000);
});


gulp.task('livereload', function () {
  $.livereload.listen();
  gulp.watch('build/**/*', function (event) {
    $.livereload.changed(event);
  });
});
```

Now that we've got that going, we need to install some bower components
to include in our project.

```sh
bower install --save angular angular-route bootstrap
```

That will install angular, angular-route, and bootstrap into our project.
Our gulpfile will automatically build it into our production assets so we
don't have to worry about those anymore.

Next we can run `gulp watch` and see everything get built for us. The
output should look something like this.

```sh
[08:22:02] Using gulpfile ~/Code/todo-app/gulpfile.js
[08:22:02] Starting 'fonts'...
[08:22:02] Starting 'scripts'...
[08:22:02] Starting 'styles'...
[08:22:02] Starting 'static'...
[08:22:02] Starting 'templates'...
[08:22:02] Starting 'server'...
[08:22:02] Finished 'server' after 5.17 ms
[08:22:02] Starting 'livereload'...
[08:22:02] Finished 'livereload' after 107 ms
[08:22:02] Finished 'static' after 174 ms
[08:22:02] Starting 'static.watch'...
[08:22:02] Finished 'static.watch' after 1.46 ms
[08:22:03] Finished 'styles' after 1.14 s
[08:22:03] Starting 'styles.watch'...
[08:22:03] Finished 'styles.watch' after 827 μs
[08:22:03] Finished 'templates' after 925 ms
[08:22:03] Starting 'templates.watch'...
[08:22:03] Finished 'templates.watch' after 1.45 ms
[08:22:07] /Users/ksmith/Code/todo-app/build/index.html reloaded.
[08:22:07] /Users/ksmith/Code/todo-app/build/css/app.min.css reloaded.
[08:22:07] /Users/ksmith/Code/todo-app/build/fonts/glyphicons-halflings-regular.eot reloaded.
[08:22:07] /Users/ksmith/Code/todo-app/build/fonts/glyphicons-halflings-regular.svg reloaded.
[08:22:07] /Users/ksmith/Code/todo-app/build/fonts/glyphicons-halflings-regular.ttf reloaded.
[08:22:07] /Users/ksmith/Code/todo-app/build/maps/app.min.css.map reloaded.
[08:22:07] /Users/ksmith/Code/todo-app/build/partials/login-controller.html reloaded.
[08:22:07] Finished 'fonts' after 4.98 s
[08:22:07] Finished 'scripts' after 4.93 s
[08:22:07] Starting 'scripts.watch'...
[08:22:07] Finished 'scripts.watch' after 1.67 ms
[08:22:07] Starting 'watch'...
[08:22:07] Finished 'watch' after 7.44 μs
[08:22:07] /Users/ksmith/Code/todo-app/build/fonts/glyphicons-halflings-regular.woff reloaded.
[08:22:07] /Users/ksmith/Code/todo-app/build/js/app.min.js reloaded.
[08:22:07] /Users/ksmith/Code/todo-app/build/maps/app.min.js.map reloaded.
```

If you got errors, then you need to make sure you've got all of your plugins
installed, and that you're running node 4.x. To see if it was successful,
you should see a `build/` folder in your project now.

You may need to, on occasion, restart your build process. To do this, press
`ctrl` + `c` to quit the process. Just type `gulp watch` to restart it
again.
