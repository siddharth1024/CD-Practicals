function Node(letter, tokens) {
	this.letter = letter
	this.transitions = []
	this.isFinal = false
	this.tokens = []
	this.unusedTokens = tokens

	this.addTransition = function (symbol, node) {
		this.transitions.push([symbol, node])
		this.tokens.push(symbol)
		this.unusedTokens.splice(this.unusedTokens.indexOf(symbol, 1), 1)
	}

	this.setFinal = function () {
		this.isFinal = true
	}

	this.parseSymbol = function (symbol) {
		for(var t = 0; t < this.transitions.length; t++) {
			if(this.transitions[t][0] === symbol) {
				return this.transitions[t][1]
			}
		}
		return -1
	}

	this.isTokenUsed = function (token) {
		 return this.tokens.indexOf(token)
	}

	this.isFull = function () {
		return this.unusedTokens.length === 0
	}
}

function RE(s) {
	this.re = s;
	this.letters = ['A', 'B', 'C', 'D', 'E', 'F']
	this.letterPointer = 0;
	this.tokens = ['a', 'b']
	this.nodes = []
	this.currentNode = -1

	this.nextLetter = function () {
		var letter = this.letters[this.letterPointer];
		this.letterPointer++;
		return letter;
	}

	this.getNode = function (letter) {
		var targetNode = -1
		this.nodes.map(function (node) {
			if(node.letter === letter)
				targetNode = node
		})
		return targetNode
	}

	this.getLastNode = function () {
		if(this.nodes.length !== 0) {
			return this.nodes[this.nodes.length - 1]
		}
		console.log("There are no nodes in this RE")
	}

	this.build = function () {
		this.currentNode = new Node(this.nextLetter(), this.tokens);
		this.nodes.push(this.currentNode)

		var s = this.re
		for(var i = 0; i < s.length; i++) {
			if(s[i+1] === "*") {
				if(this.currentNode.isTokenUsed(s[i]) > -1) {
					this.currentNode = new Node(this.nextLetter(), this.tokens);
					this.nodes.push(this.currentNode)
				}
				this.currentNode.addTransition(s[i], this.currentNode.letter)
			}
		}
	}

	this.prettyPrint = function () {
		console.log("RE:", this.re)
		var output = []
		for(var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i]
			var a = []
			for(var j = 0; j < node.transitions.length; j++) {
				a.push(node.letter + " -----" + node.transitions[j][0] + "----> " + node.transitions[j][1])
			}
			output.push(a)
		}
		console.table(output)
	}

	this.validate = function (s) {
		var i = 0;
		var currentNode = this.nodes[0]
		while(currentNode !== -1) {
			var nextNode = this.getNode(currentNode.parseSymbol(s[i]))
			if(nextNode !== -1) {
				currentNode = nextNode
				console.log(">>", currentNode.letter)
			} else {
				console.log("RE is invalid")
				break;
			}
			i++;
		}
	}

	this.build()
	return this.prettyPrint()
}
