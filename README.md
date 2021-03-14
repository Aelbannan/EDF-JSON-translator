# EDF JSON Translator

This should theoretically translate any SGOTT compatible JSON file. Only tried with weapons so far. To obtain the original weapons JSON, use SGOTT to convert WEAPONTEXT(_EN).SGO.

## How to use

There are two main modes, Extract and Inject. There is a manual step in between.

### 1. Extract

Pulls all japanese text out of the JSON for translation.

```
node index.js extract [inputFilename] [outputFilename]
```

`inputFilename` is optional. Defaults to `wep.json`.
`outputFilename` is optional. Defaults to `texts.txt`.

### 2. Translate

Use https://www.onlinedoctranslator.com to translate the output file above.

### 3. Inject into JSON

Injects translated text into json.

```
node index.js inject [originalJsonFilename] [translatedTextFilename] [outputFilename]
```

`originalJsonFilename` is optional. Defaults to `wep.json`.
`translatedTextFilename` is optional. Defaults to `texts.ja.en.txt`.
`outputFilename` is optional. Defaults to `wepeng.json`.
