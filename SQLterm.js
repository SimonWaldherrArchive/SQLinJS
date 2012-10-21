/*
 *  SQLterm
 *  SQL terminal simulator in Javascript (proof of concept)
 *
 *  Copyright 2012, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 */

(function($) {
	var methods = {
		"init" : function() {
			return this.each(function() {
				var $this = $(this),
					data  = $this.data();

				if ( $.isEmptyObject(data) ) {
					$this.data({
						_active_db : null,
						_error_log : [],
						_query_log : [],
						_debug     : false
					});

					$this.SQLterm('initTerminal');
				}

				clearTerminal();

				stdOut("Welcome to SQLterm monitor.  Type 'help' for supported commands");
			});
		},

		"destroy" : function() {
			return this.each(function() {
				$(this).removeData();
			});
		},

		"initTerminal" : function(func) {
			return this.each(function() {
				var $this = $(this);

				var input
					= $('<textarea></textarea>')
						.on('keypress', function(event) {
							if (event.which != 13) return;

							event.preventDefault();

							var str = $(this).val();
							$(this).val(null);

							$this.SQLterm('executeQuery', str);
							$this.focus();
						});

				var console
					= $('<pre></pre>')
						.on('click', function(event) {
							input.focus();
						});

				var terminal
					= $('<div></div>')
						.attr('id','SQLterm')
						.append(console, input);

				$this.append(terminal);

				input.focus();

				runCallback(func);
			});
		},

		"executeQuery" : function(str, func) {
			return this.each(function() {
				var $this = $(this);

				str = $.trim(str);

				stdOut('\nsqlterm> ' + str);

				switch (true) {
					case /^CREATE/i.test(str):
						$this.SQLterm('_Create', str);
					break;

					case /^DELETE/i.test(str):
						$this.SQLterm('_Delete', str);
					break;

					case /^DROP/i.test(str):
						$this.SQLterm('_Drop', str);
					break;

					case /^INSERT/i.test(str):
						$this.SQLterm('_Insert', str);
					break;

					case /^SELECT/i.test(str):
						$this.SQLterm('_Select', str);
					break;

					case /^SHOW/i.test(str):
						$this.SQLterm('_Show', str);
					break;

					case /^USE/i.test(str):
						$this.SQLterm('_Use', str);
					break;

					case /^help/i.test(str):
						viewHelp();
					break;

					default:
						stdErr('Unknown command');
					break;
				}

				$this.data('_query_log').push( logFormat(str) );

				runCallback(func);
			});
		},

		"createDatabase" : function(name, func) {
			return this.each(function() {
				var $this = $(this);

				if ( validName(name) ) {
					$this.data(name, []);

					stdOut('Query OK, 0 rows effected');

					runCallback(func);
				}
				else {
					stdErr("Can't create database '" + name + "'");
				}
			});
		},

		"createTable" : function(name, defs, func) {
			return this.each(function() {
				var $this = $(this);

				if ( validName(name) ) {

					// TODO

					runCallback(func);
				}
			});
		},

		"dropDatabase" : function(name, func) {
			return this.each(function() {
				var $this = $(this);

				if ( validName(name) && $this.data(name) ) {
					$this.removeData(name);

					stdOut('Query OK, 0 rows effected');

					runCallback(func);
				}
				else {
					stdErr("Can't drop database '" + name + "'");
				}
			});
		},

		"dropTable" : function(name, func) {
			return this.each(function() {
				var $this = $(this);

				if ( validName(name) ) {
					var db = $this.data('_active_db');

					$this.data(db[$name], null);

					stdOut('Query OK, 0 rows effected');

					runCallback(func);
				}
				else {
					stdErr("Can't drop table '" + name + "'");
				}
			});
		},

		"showDatabases" : function(func) {
			return this.each(function() {
				var $this = $(this);

				stdTermOut('Databases', $this.data());

				stdOut('Query OK, 0 rows effected');

				runCallback(func);
			});
		},

		"showTables" : function(func) {
			return this.each(function() {
				var $this = $(this);

				var db = $this.data('_active_db');
				if (db) {
					if ($this.data(db).length > 0) {
						stdOut('Query OK, 0 rows effected');

						runCallback(func);
					}
					else {
						stdErr('No tables used');
					}
				}
				else {
					stdErr('No database selected ');
				}
			});
		},

		"useDatabase" : function(name, func) {
			return this.each(function() {
				var $this = $(this);

				if ( validName(name) && $this.data(name) ) {
					$this.data('_active_db', name);

					stdOut('Database changed');

					runCallback(func);
				}
				else {
					stdErr("Unknown database '" + name + "'");
				}
			});
		},

		"_Create" : function(str) {
			return this.each(function() {
				var $this = $(this);

				var type = parseQuery(str)[1];
				var name = parseQuery(str)[2];
				var defs = parseQuery(str)[3];

				switch (true) {
					case /DATABASE/i.test(type):
						$this.SQLterm('createDatabase', name);
					break;

					case /TABLE/i.test(type):
						$this.SQLterm('createTable', name, defs);
					break;

					default:
						stdErr('Unknown command');
					break;
				}
			});
		},

		"_Delete" : function(str) {
			return this.each(function() {
				var $this = $(this);

				// TODO
			});
		},

		"_Drop" : function(str) {
			return this.each(function() {
				var $this = $(this);

				var type = parseQuery(str)[1];
				var name = parseQuery(str)[2];

				switch (true) {
					case /DATABASE/i.test(type):
						$this.SQLterm('dropDatabase', name);
					break;

					case /TABLE/i.test(type):
						$this.SQLterm('dropTable', name);
					break;

					default:
						stdErr('Unknown command');
					break;
				}
			});
		},

		"_Insert" : function(str, func) {
			return this.each(function() {
				var $this = $(this);

				// TODO
			});
		},

		"_Select" : function(str) {
			return this.each(function() {
				var $this = $(this);

				// TODO
			});
		},

		"_Show" : function(str) {
			return this.each(function() {
				var $this = $(this);

				var name = parseQuery(str)[1];

				switch (true) {
					case /DATABASES/i.test(name):
						$this.SQLterm('showDatabases');
					break;

					case /LOGS/i.test(name):
						$this.SQLterm('showLogs');
					break;

					case /TABLES/i.test(name):
						$this.SQLterm('showTables');
					break;

					default:
						stdErr('Unknown command');
					break;
				}
			});
		},

		"_Use" : function(str) {
			return this.each(function() {
				$(this).SQLterm('useDatabase', parseQuery(str)[1]);
			});
		}
	};

	$.fn.SQLterm = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else
		if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on SQLterm');
		}
	};

	/*
	 * Return true if in valid format - [a-zA-Z0-9_]
	 */
	function validName(str) {
		if (!str) { return false }
		return /^\w+$/g.test(str);
	}

	/*
	 * Return an array of SQL statement elements
	 */
	function parseQuery(str) {
		var elms = str.split(' ');
		for (var i = 0; i < elms.length; i++) {
			elms[i] = $.trim(elms[i]);
		}
		return elms;
	}

	/*
	 * Return 'query_log' entry in JSON format
	 */
	function logFormat(str) {
		return { query : str, time : new Date().getTime() };
	}

	/*
	 * Return help menu as a string
	 */
	function viewHelp() {
		stdErr('Help menu is not available');
	}

	/*
	 * Clear all messages in console
	 */
	function clearTerminal() {
		$('#SQLterm pre').empty();
	}

	/*
	 * Print error message to console
	 */
	function stdErr(str) {
		stdOut('Error: ' + str);
	}

	/*
	 * Print message to console; add newline to output
	 */
	function stdOut(str) {
		$('#SQLterm pre').append( ((str) ? str : '') + '\n');
	}

	/*
	 * Print tablular format message to console
	 */
	function stdTermOut(title, data) {
		var size  = 0,
			names = [];

		for (var name in data) {
			//if (/^_/.test(name) ) { continue }

			var len = name.length;
			if (size < len) {
				size = len;
			}
			names.push(name);
		}

		if (names.length > 0) {
			size = size + 2;   // row boundary

			genTermHeader(size, title);

			for (var i = 0; i < names.length; i++) {
				genTermRow(size - names[i].length, names[i]);
			}

			genTermRow(size);
		}
	}

	/*
	 * Print tablular format header to console
	 */
	function genTermHeader(size, title) {
		genTermRow(size);
		genTermRow(size - title.length, title);
		genTermRow(size);
	}

	/*
	 * Print tablular format row to console
	 */
	function genTermRow(size, value) {
		stdOut(
			(value)
				? '+' + value + (new Array(size).join(' ')) + '+'
				: '+' +         (new Array(size).join('-')) + '+'
		);
	}

	/*
	 * Run callback function; die on errors
	 */
	function runCallback(func) {
		try {
			if (typeof func === 'function') {
				func(true);
			}
		}
		catch(err) {
			throwError(err);
		}
	}
	
	/*
	 * Output errors including caller object
	 */
	function throwError(str) {
		throw new Error(
			'\nCaller: \t' + (throwError.caller.name || '-') +
			'\nError:\t'   + str
		);
	}
})(jQuery);
