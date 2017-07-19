/**
 * Compiler Design
 * **/

Array.prototype.search = function(needle) {
	var exists = false
	for (var idx = 0; idx < this.length; idx++) {
		if (this[idx] === needle) {
			exists = true
		}
	}
	return exists
}
Object.prototype.prettyPrint = function () {
	for (var item in this) {
		var out = ""
		for (var idx = 0; idx < this[item].length; idx++) {
			out += this[item][idx] + " "
		}
		this[item] = out.slice(0, -1)
	}
	return this
}

var _keywords = ["int", "char", "double", "float", "while", "for", "do"]
var _operators = ["+", "-", "=", "*", "/"]

function lex(s) {
	s += "~"
	var keywords = []
	var tokens = []
	var constants = []
	var identifiers = []
	var operators = []
	var start_index = 0

	for (var i = 0; i < s.length; i++) {
		switch (s[i]) {
			case ',': case ' ':	case '~': case '+':	case '-': case ';': case '=':
				var token = s.slice(start_index, i)
				if(token !== "") {
					if(_keywords.search(token)) {
						keywords.push(token)
					} else if (_operators.search(token)) {
						operators.push(token)
					} else if (!isNaN(Number(token))) {
						while((s[i] === !isNaN(Number(s[i])) || s[i] === ".") && i < s.length) i++
						token = s.slice(start_index, i)
						constants.push(token)
					} else if(!identifiers.search(token)) {
						identifiers.push(token)
					}
				}
				start_index = i + 1
		}
		switch (s[i]) {
			case ';': case '+': case '-': case ',': case '=':
				token = s[i]
			if (_operators.search(token) && !operators.search(token)) {
				operators.push(token)
			}
		}
	}
	return [{
		"keywords": keywords,
		"constants": constants,
		"identifiers": identifiers,
		"tokens": tokens,
		"operators": operators
	}.prettyPrint()]
}

