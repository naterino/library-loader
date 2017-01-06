
(function () {
  var libraryStorage = {};

  function librarySystem(libraryName, dependencies, callback) {
    if (arguments.length > 1) {
      libraryStorage[libraryName] = {
        dependencies: dependencies,
        callback: callback,
        cached: false
      };
    } else {
      var library = libraryStorage[libraryName];
      var loadedDependencies = [];

      if (library.cached === false) {
        var loadedDependencies = library.dependencies.map(function (dependency) {
            return librarySystem(dependency);
        });

        libraryStorage[libraryName].cachedResult = library.callback.apply(this, loadedDependencies);
        libraryStorage[libraryName].cached = true;
      }
      return libraryStorage[libraryName].cachedResult;
    }
  }
  window.librarySystem = librarySystem;
})();


/*(function () {
  var libraryStorage = {};

  function librarySystem(libraryName, dependencies, callback) {
    if (arguments.length > 1) {
      libraryStorage[libraryName] = {
        dependencies: dependencies,
        callback: callback,
        cached: false,

      };
    } else {
      return dependencyLoader(libraryName);
    }
  }

  function dependencyLoader(libraryName) {
     var dependencies = []
     var storedLibrary = libraryStorage[libraryName];

     if(storedLibrary.dependencies.length) {
        dependencies = storedLibrary.dependencies.map(function(dependencyName){
          return dependencyLoader(dependencyName);
        });
     }

     if(storedLibrary.cached) {
        return storedLibrary.cachedResult;
     }

     var callbackResult = storedLibrary.callback.apply(null, dependencies);
     storedLibrary.cachedResult = callbackResult;
     storedLibrary.cached = true;
     return callbackResult;

  }

  window.librarySystem = librarySystem;
})();
*/
tests({
  'If only provided a library name it should return it.': function () {
    librarySystem('name', [], function () {
		  return 'Nate';
    });

    var result = librarySystem('name');

    eq('Nate', result);
  },

  'It should return only run the callback for each library item once.': function () {
    var runCount = 0;

    librarySystem('testLib', [], function () {
		  runCount++;
    });

    librarySystem('testLib');
    librarySystem('testLib');

    eq(runCount, 1);
  },

  'It should allow you to load depenencies in order': function () {
    librarySystem('name', [], function () {
		  return 'Gordon';
    });

    librarySystem('company', [], function () {
		  return 'Watch and Code';
    });

    librarySystem('workBlurb', ['name', 'company'], function (name, company) {
		  return name + ' works at ' + company;
    });

    var result = librarySystem('workBlurb');

    eq(result, 'Gordon works at Watch and Code');
  },

  'It should allow you to load dependencies out of order.': function () {
    librarySystem('fullBlurb', ['workBlurb2'], function (workBlurb2) {
      return 'Another layer of text: ' + workBlurb2;
    });

    librarySystem('workBlurb2', ['name2', 'company2'], function (name, company) {
		  return name + ' works at ' + company;
    });

    librarySystem('name2', [], function () {
		  return 'Gordon';
    });

    librarySystem('company2', [], function () {
		  return 'Watch and Code';
    });
           
    var result = librarySystem('fullBlurb');

    eq(result, 'Another layer of text: Gordon works at Watch and Code');
  }


});

