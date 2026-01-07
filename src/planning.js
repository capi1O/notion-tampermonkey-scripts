// ==UserScript==
// @name         Notion Planning
// @match        __PLANNING_URL__
// ==/UserScript==

import { addDayJumpButtons } from "./planning-day-jump-buttons.js";
import { appendStyles, attach, repositionTopBarButtonsContainer, hideFlexibleSpace } from "./planning-side-peek-buttons.js";
import { buildSidePeekButton, movePageLinksToMenu, refreshSidePeekStyle } from "./planning-side-peek-menu.js";
import { onUrlChange } from './utils.js';

// day jump buttons
addDayJumpButtons();

// side peek buttons
appendStyles();


// TODO: reuse
const attachObserver = new MutationObserver(() => {
	const topbar = document.querySelector(NOTION_TOPBAR_SELECTOR);
	if (topbar) {
			const breadcrumb = topbar.querySelector(NOTION_BREADCRUMB_SELECTOR);
			if (breadcrumb) {
				attachObserver.disconnect();
				// console.log('topbar and breadcrumb found, attaching');
				attach(topbar, breadcrumb);
				repositionTopBarButtonsContainer();
				const sidePeekButton = buildSidePeekButton();
				topBarButtonsContainer.appendChild(sidePeekButton);
				movePageLinksToMenu();
			}
			// else console.log('breadcrumb not found');

			// wait for flexible space to appear then hide it
			hideFlexibleSpace(topbar);
	}
	// else  console.log('topbar not found');
});

attachObserver.observe(document.body, { childList: true, subtree: true });

window.addEventListener("resize", repositionTopBarButtonsContainer);
window.addEventListener("scroll", repositionTopBarButtonsContainer, true);

// reactive updates (read-only)
const reactiveObserver = new MutationObserver(() => {
	repositionTopBarButtonsContainer();
	refreshSidePeekMenuStyle();
	movePageLinksToMenu(); // not really read-only but required to move link on load
	refreshSidePeekStyle();
});

reactiveObserver.observe(document.body, { childList: true, subtree: true });

window.addEventListener("resize", movePageLinksToMenu);
window.addEventListener("scroll", movePageLinksToMenu, true);

onUrlChange(refreshSidePeekStyle);
window.addEventListener("visibilitychange", refreshSidePeekStyle);
