# Notion Tampermonkey sripts

## Description

Collection of [Tampermonkey](https://github.com/Tampermonkey/tampermonkey) scripts to enhance Notion experience on desktop.

### Wildcard

Script applied to all Notion pages, what it does:
- hide Notion AI assitant

### Planning

Script tailored to a specific "Planning" page on my Notion, what it does:
- add buttons to jump scroll to each day group
- add drop down menu to open set of links in Side Peek

Those buttons are added to Notion top bar

## Dev

### In Chrome

1. `npm run dev`

2. Copy-paste this in Tampermonkey editor

	```js
	// ==UserScript==
	// @require file:///ABSOLUTE_PATH/dist/FILENAME.user.js
	// ==/UserScript==
	```


> 💡 **Info**
>
> file:// works only if Tampermonkey setting “Allow access to file URLs” is enabled


### In Firefox

1. `npm run dev`

2. Tampermonkey > Settings > Utilites > Import from file > Browse. Then select file from dist/. Whenever file is updated you need to manually "Reinstall from file" from Tampermonkey Settings > Utilites.


> 💡 **Info**
>
> about:config → security.fileuri.strict_origin_policy = false

