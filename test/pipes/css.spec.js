'use strict';

var path = require('path');

describe('CSS', function() {

  var precompFile    = 'body\n  background-color white';
  var precompFileTwo = 'body\n  background-color black';

  var cssFile = 'body {\n  background-color: white;\n\n } ';
  var cssFileTwo = 'body    {\n  background-color: black;\n }\n\n ';

  it('should be able to lint', function(done) {
    fileStream(precompFile, precompFileTwo)
      .pipe(pipes.css.lint())
      .pipe(assert.length(2))
      .pipe(assert.first(function(d) {
        expect(d.contents.toString()).to.equal(precompFile);
      }))
      .pipe(assert.second(function(d) {
        expect(d.contents.toString()).to.equal(precompFileTwo);
      }))
      .pipe(assert.end(done));
  });

  describe('compile', function() {

    it('should be able to dev-compile', function(done) {
      fileStream(precompFile)
        .pipe(pipes.css.compile())
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var base = path.basename(d.path);
          var compiled = 'body {\n  background-color: #fff;\n}\n\n/*# sourceMappingURL=data:application/json;base64,';

          expect(d.contents.toString().substr(0, compiled.length)).to.equal(compiled);
          expect(base).to.endWith('.css');
          expect(base).to.not.endWith('.min.css');
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile', function(done) {
      fileStream(precompFile)
        .pipe(pipes.css.compile({
          prod: true
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var base = path.basename(d.path);

          expect(d.contents.toString()).to.equal('body{background-color:#fff}');
          expect(base).to.endWith('.css');
          expect(base).to.not.endWith('.min.css');
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile and change extension to .min.js', function(done) {
      fileStream(precompFile)
        .pipe(pipes.css.compile({
          prod: true,
          extmin: true
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var base = path.basename(d.path);

          expect(d.contents.toString()).to.equal('body{background-color:#fff}');
          expect(base).to.endWith('.min.css');
        }))
        .pipe(assert.end(done));
    });

  });

  describe('deps', function() {

    it('should be able to dev-compile', function(done) {
      fileStream(cssFile, cssFileTwo)
        .pipe(pipes.css.deps())
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var compiled = 'body {\n  background-color: white;\n\n } \nbody    {\n  background-color: black;\n }\n\n \n/*# sourceMappingURL=data:application/json;base64,';

          expect(d.contents.toString().substr(0, compiled.length)).to.equal(compiled);
          expect(path.basename(d.path)).to.equal('dependencies.css');
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile', function(done) {
      fileStream(cssFile)
        .pipe(pipes.css.deps({
          prod: true
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var compiled = 'body{background-color:#fff}';

          expect(d.contents.toString()).to.equal(compiled);
          expect(path.basename(d.path)).to.equal('dependencies.css');
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile with specific name', function(done) {
      fileStream(cssFile)
        .pipe(pipes.css.deps({
          prod: true,
          name: 'test'
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var compiled = 'body{background-color:#fff}';

          expect(d.contents.toString()).to.equal(compiled);
          expect(path.basename(d.path)).to.equal('test.css');
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile and change extension to .min.css', function(done) {
      fileStream(cssFile)
        .pipe(pipes.css.deps({
          prod: true,
          extmin: true
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var compiled = 'body{background-color:#fff}';

          expect(d.contents.toString()).to.equal(compiled);
          expect(path.basename(d.path)).to.equal('dependencies.min.css');
        }))
        .pipe(assert.end(done));
    });

  });

});
