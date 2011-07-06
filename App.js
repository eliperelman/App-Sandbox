/*
* App Sandbox
*
* Copyright 2011, Eli Perelman
* Licensed under the GPL Version 2 license.
* http://www.gnu.org/licenses/gpl-3.0.html
*/
/*jshint curly: true, eqeqeq: true, noarg: true, undef: true, strict: true */
/*global App: false */
(function (global) {
	'use strict';

	var _App = global.App,
		loadedModules = {},
		App = function (modules, callback) {
			// Make sure that we always create a new sandbox
			// for the current context. Also affords us some
			// syntactic sugar by not having to explicitly
			// construct (new) our sandbox:
			// App([modules], function(app) {  });
			// instead of:
			// new App([modules], function(app) {  });
			if (!(this instanceof App)) {
				return new App(modules, callback);
			}

			var i = modules.length;

			// Execute each module, which in turn adds methods
			// to the current sandbox instance.
			// NOTE: Since modules are supposed to be MODULAR,
			// they aren't loaded in order, just quickly.
			while (i--) {
				loadedModules[modules[i]](this, App);
			}

			// After the modules have added their functionality
			// to the sandbox, pass the sandbox context onto the
			// sandbox execution environment.
			callback(this);
		};

	// Just a quick helper method to easily extend the sandbox
	// with functionality from an object literal.
	App.prototype.extend = function (extensions) {
		for (var prop in extensions) {
			if (extensions.hasOwnProperty(prop)) {
				this[prop] = extensions[prop];
			}
		}
	};

	// Convenience method for application to define modules
	// for later loading into a sandbox.
	App.define = function (name, callback) {
		loadedModules[name] = callback;
	};

	// Give back any globals we introduced into the application.
	App.noConflict = function (clearAll) {
		if (clearAll) {
			delete global.App;
		} else {
			global.App = _App;
		}

		return App;
	};

	// Expose the App sandbox globally.
	global.App = App;
})(this);