const fs = require('fs');
const translationFixes = require('./translation-fixes');

// This regex is used to detect if a string contains japanese text
// TODO: some item titles not detected
const japaneseRegex = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g; 
// Seperator used to seperate strings for translation. This string must be unchanged by translation
const SEPERATOR = '\n%%%%%%\n';


function execOnJapaneseText(node, func) {
	// If has children, recurse
	if (node.type === 'ptr') {
		if (node.value) node.value.forEach(c => execOnJapaneseText(c, func));
		return;
	}
	
	// If is japanese string, run func
	if (japaneseRegex.test(node.value)) {
		func(node);
	}
}

function loadJson(filename) {
	return require('./' + filename);
}

function loadTranslation(filename) {
	return fs.readFileSync(filename, 'utf-8').toString();
}

// God forgive me
function fixTranslation(text) {
	for (let tr of translationFixes) {
		text = text.split(tr[0]).join(tr[1]);
	}
	return text;
}

// Pulls Japanese from JSON and outputs txt file
function pullJapanese(inputFilename, outputFilename) {
	// Load weapons JSON
	const weaponsJson = loadJson(inputFilename);
	// list of japanese text that needs translation
	const texts = [];
	// Adds text to array
	const addToArray = (node) => texts.push(node.value);
	
	// Recurse into json and get all japanese text
	weaponsJson.variables.forEach(c => execOnJapaneseText(c, addToArray));
	
	// Save all japanese text to a TXT file, ready for translation
	fs.writeFileSync(outputFilename, texts.join(SEPERATOR));
}

// Injects translation into json file
function injectIntoJson(originalJsonFilename, inputFilename, outputFilename) {
	const weaponsJson = loadJson(originalJsonFilename);
	const translation = loadTranslation(inputFilename);
	const fixedTranslation = fixTranslation(translation);
	
	let splitText = fixedTranslation.split(SEPERATOR);
	
	// Recurse into JSON and replace each japanese string with the english translation
	let i = 0;
	const replaceWithEnglish = node => node.value = splitText[i++];
	weaponsJson.variables.forEach(c => execOnJapaneseText(c, replaceWithEnglish));
	
	//
	fs.writeFileSync(outputFilename, JSON.stringify(weaponsJson));
}

function main() {
	// TODO: use an argument library. positional arguments suck
	switch (process.argv[2]) {
		case "extract":
			pullJapanese(
				process.argv[3] ?? "wep.json", 			// Weapons JSON
				process.argv[4] ?? "texts.txt"			// Output filename
			);
			break;
			
		case "inject":
			injectIntoJson(
				process.argv[3] ?? "wep.json", 			// Original JSON
				process.argv[4] ?? "texts.ja.en.txt", 	// Translated text file
				process.argv[5] ?? "wepeng.json" 		// Output filename
			);
			break;
			
		default: 
			console.log("This function does not exist.");
	}
}
main();
// pullJapanese();
// injectIntoJson();