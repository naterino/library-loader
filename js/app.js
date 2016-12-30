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

	    	if (library.cached === false) {
	    		var dependencies = library.dependencies.map(function (dependency) {
			    	mapLib = libraryStorage[dependency];
			    	return mapLib.callback.apply(this, mapLib.dependencies);
		    	});
      libraryStorage[libraryName].result = library.callback.apply(this, dependencies);
		    	libraryStorage[libraryName].cached = true;
	    	}
		    return libraryStorage[libraryName].result;
	    }
  }

  window.librarySystem = librarySystem;
})();


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

  'It should allow you to load depenencies out of order.': function () {
    librarySystem('workBlurb', ['name', 'company'], function (name, company) {
		  return name + ' works at ' + company;
    });

    librarySystem('name', [], function () {
		  return 'Gordon';
    });

    librarySystem('company', [], function () {
		  return 'Watch and Code';
    });

    var result = librarySystem('workBlurb');

    eq(result, 'Gordon works at Watch and Code');
  }


});

