# rollup-plugin-index
A Rollup plugin to inject you assets into a HTML template.

# Install

    $ npm install -D rollup-plugin-index

# Configure

Add to the plugins section of your rollup.config.js:

    import Index from 'rollup-plugin-index'

    export default {
      input: 'test/main.js',
      output: {
        file: 'dist/bundle.js',
        format: 'es'
      },
      plugins: [
        Index({
          source: 'index.html',
          compact: true
        })
      ]
    }


# Create your HTML template

    <!DOCTYPE html>
    <html>
      <head>
        <title> My Site! </title>
      </head>
      <body>
        <h1> Whoa! </h1>
      </body>
    </html>

# Generate!

    $ npx rollup -c

And you should find something like this in `dist/index.html`:

    <!DOCTYPE html><html><head><title> My Site! </title><script type="module" src="bundle.js"></script></head><body>
      <h1> Whoa! </h1>
    </body></html>

Since ``compact`` was set, all text nodes that are direct children of <html> and <head> are removed.

# Options

source::

    Template to use

compact:: (Default: false)

    Should remove text node children from <html> and <head>.

target::

    Filename / path to write output to.
    If not specified, it will use the basename of the source file.

