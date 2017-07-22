/**
 * Created by sidx1024 on 19-07-2017.
 */

Array.prototype.unique = function () {
	return this.filter(function (elem, index, self) {
		return index === self.indexOf(elem);
	})
}

Array.prototype.stripNull = function () {
	return this.filter(function (elem) {
		return elem !== '^'
	})
}

var Grammar

function FF(rulesArray) {
	Grammar = this
	this.productionsRules = []

	this.isTerminal = function (l) {
		for (var i = 0; i < this.productionsRules.length; i++)
			if (this.productionsRules[i].letter === l)
				return false
		return true
	}

	this.getRule = function (l) {
		for (var i = 0; i < this.productionsRules.length; i++)
			if (this.productionsRules[i].letter === l)
				return this.productionsRules[i]
		return false
	}

	this.print = function () {
		this.productionsRules.map(function (r) { r.print() })
	}

	for (var i = 0; i < rulesArray.length; i++) {
		var r = rulesArray[i].split("->")
		this.productionsRules.push(new ProductionRule(r[0], r[1]))
	}
}

function ProductionRule(letter, str) {
	this.letter = letter
	this.rules = str.split("/")

	this.print = function () {
		var out = []
		out.letter = this.letter
		out.follow = out.first = out.rules = ""

		for (var i = 0; i < this.rules.length; i++) {
			out.rules += "[" + this.rules[i] + "]"
		}

		out.first += "[" + this.first() + "]"
		out.follow += "[" + this.follow() + "]"

		console.table([out])
	}

	this.first = function () {
		var firsts = []
		for (var i = 0; i < this.rules.length; i++) {
			var ruleLetter = this.rules[i][0]
			if (Grammar.isTerminal(ruleLetter)) {
				firsts.push(ruleLetter)
			} else {
				var rule = Grammar.getRule(ruleLetter)
				if (rule) {
					firsts = firsts.concat(rule.first())
					if (this.rules[i].length > 1) {
						var nextLetter = this.rules[i][1]
						if (this.isNullable()) {
							firsts = firsts.concat(Grammar.getRule(nextLetter).first())
						}
					}
				} else {
					console.error("ProductionRule ", ruleLetter, "not found.")
				}
			}
		}
		return firsts.unique().sort()
	}

	this.isNullable = function () {
		for (var i = 0; i < this.rules.length; i++)
			for (var r = 0; r < this.rules[i].length; r++) {
				var rule = Grammar.getRule(this.rules[i][r])
				if (rule && rule.first().indexOf("^") > -1)
					return true
			}
		return false
	}

	this.follow = function () {
		var follows = []
		for (var n = 0; n < Grammar.productionsRules.length; n++) {
			var rules = Grammar.productionsRules[n].rules
			for (var i = 0; i < rules.length; i++) {
				var ruleLetter = this.letter
				var letterIndex = rules[i].indexOf(ruleLetter)
				if (letterIndex > -1) {
					var nextIndex = letterIndex + 1
					var nextLetter = rules[i][nextIndex]
					if (nextIndex < rules[i].length) {
						if (Grammar.isTerminal(nextLetter)) {
							follows.push(nextLetter)
						} else {
							var rule = Grammar.getRule(nextLetter)
							follows = follows.concat(rule.first())
							if (rule.isNullable()) {
								follows = follows.concat(Grammar.getRule(rules[i][nextIndex + 1]).first())
							}
						}
					} else if (ruleLetter !== Grammar.productionsRules[n].letter) {
						follows = follows.concat(Grammar.productionsRules[n].follow())
					}
				}
			}
		}
		follows.push("$")
		return follows.unique().stripNull().sort()
	}
}