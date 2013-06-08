# jsbuild

Build tool for the [JS.Packages](http://jsclass.jcoglan.com/packages.html)
module system. Consumes manifests and uses the dependency data to build bundles
for deployment.


## Installation

```
$ npm install -g jsbuild
```


## Usage

A common setup when using JS.Packages for web development is to include the
package loader and your package manifest using `script` tags, then using
`JS.require()` to load components as you need them.

```html
<script type="text/javascript" src="/js-packages.js"></script>
<script type="text/javascript" src="/manifest.js"></script>

<script type="text/javascript">
    JS.require('Application', function() {
        // ...
    });
</script>
```

In this case `manifest.js` might contain:

```js
JS.packages(function() { with(this) {
    file('https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.js')
        .provides('jQuery');

    file('/app.js')
        .provides('Application')
        .requires('jQuery');
}});
```

This setup makes it really easy to load the JavaScript modules you need during
development, but in production you often benefit from bundling all the
JavaScript for a page into a single file.

`jsbuild` is a command-line program that takes your package manifest and a list
of modules you want to use, and will output a single JavaScript file containing
those modules and all their dependencies. The modules can come from your local
file system or from the web.

You run `jsbuild` as follows:

```
$ jsbuild --manifest MANIFEST --root ROOT [OPTIONS] module1 [module2 ...]
```

The options available are:

* `--manifest`, `-m`: the path to your package manifest. If you have several
  manifests, use `-m` multiple times.
* `--root`, `-r`: the directory containing your application's JavaScript files.
  Paths in the manifest are resolved relative to this directory.
* `--external`, `-e`: unless this option is passed, the build will skip files
  that come from the web rather than the local filesystem.
* `--no-packages`, `-P`: if this is set, the `JS.Packages` code will not be
  included in the build. Including it means your `JS.require()` calls will
  carry on working.
* `--bundles`, `-b`: optional path to bundle definition file (see 'Organising
  bundles' below).
* `--output`, `-o`: the type of output required, either `code` (default) or
  `paths`. Using `code` makes `jsbuild` output the combined source code, and
  `paths` makes it output the paths to the bundled files.
* `--directory`, `-d`: a directory to trim from paths output when using `-o
  paths`. For example passing `-d public/js` will make `jsbuild` output
  `app.js` rather than `public/js/app.js`.

For example to build a bundle to support our application, we can run this
command to produce a single script containing `JS.Packages`, `jQuery` and
`Application`, since `Application` depends on `jQuery`:

```
$ jsbuild --manifest public/js/manifest.js \
          --root public/js/ \
          --external \
          Application
```

The resulting script is printed to stdout. Note that `jsbuild` does not do any
minification of the files your provide, it simply locates the required modules
and concatenates them. You should deal with minifying the resulting file
separately.


### Organising bundles

As a project grows, it often becomes likely that you don't want _all_ your
modules and their dependencies in one file. Although this minimizes HTTP
round-trips, it means the entire bundle must be re-downloaded when any part of
it changes. For this reason many people keep stable libraries in one bundle and
their more volatile application code in another. `jsbuild` lets you create such
bundles using a simple JSON file.

The file lists a number of bundles, each of which has an `include` field and an
optional `exclude` field, both of which can be a list or a single item. The
`include` field specifies which objects from the manifest should go into that
bundle, while `exclude` specifies which dependencies should be skipped, usually
because they are provided by another bundle you will load separately.  Items
given to `exlude` can be object names from the manifest, or other bundle names
to exclude everything provided by that bundle and any bundle it depends on.

For example, let's split our files into stable libraries and our application
code:

```js
// bundles.json
{
    "libs": {
        "include": [ "jQuery" ]
    },
    "app": {
        "exclude": "libs",
        "include": "Application"
    }
}
```

We can then pass bundle names instead of object names to `jsbuild` to create
the bundled files. Remember to pass `-b bundle.json` to tell it where your
bundles are stored.

```
$ jsbuild -m public/js/manifest.js -b bundles.json -r public/js -o paths libs
https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.js

$ jsbuild -m public/js/manifest.js -b bundles.json -r public/js -o paths app
public/js/app.js
```

If we removed the line `"exclude": "libs"` from the `app` bundle, we would
instead get this output, where jQuery has been included before our own files:

```
$ jsbuild -m public/js/manifest.js -b bundles.json -r public/js -o paths app
https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.js
public/js/app.js
```


## License

(The MIT License)

Copyright (c) 2007-2013 James Coglan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

