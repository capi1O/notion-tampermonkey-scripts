// ==UserScript==
// @name         Notion Planning
// @match        __PLANNING_URL__
// ==/UserScript==

import { appendStyles as appendTopBarContainerStyles, repositionTopBarButtonsContainer, attachContainerToNotionTopBarWhenReadyThen } from "./top-bar-container.js";
import { appendStyles as appendDayButtonsStyles, buildDayButtonsContainer, watchContentAndUpdateButtons } from "./planning-day-jump-buttons.js";
import { appendStyles as appendSidePeekMenuStyles, buildSidePeekButton, movePageLinksToMenu, refreshSidePeekStyle } from "./planning-side-peek-menu.js";
import { onUrlChange } from './utils.js';


appendTopBarContainerStyles();
appendSidePeekMenuStyles();
appendDayButtonsStyles();

attachContainerToNotionTopBarWhenReadyThen((topBarButtonsContainer) => {
	const dayButtonsContainer = buildDayButtonsContainer();
	topBarButtonsContainer.appendChild(dayButtonsContainer);
	watchContentAndUpdateButtons();

	const sidePeekButton = buildSidePeekButton();
	topBarButtonsContainer.appendChild(sidePeekButton);
	movePageLinksToMenu();
})



// reactive updates (read-only)
const reactiveObserver = new MutationObserver(() => {
	repositionTopBarButtonsContainer();
	movePageLinksToMenu(); // not really read-only but required to move link on load
	refreshSidePeekStyle();
});
reactiveObserver.observe(document.body, { childList: true, subtree: true });

window.addEventListener("resize", repositionTopBarButtonsContainer); // redundant with reactiveObserver?
window.addEventListener("scroll", repositionTopBarButtonsContainer, true); // redundant with reactiveObserver?
window.addEventListener("resize", movePageLinksToMenu); // redundant with reactiveObserver?
window.addEventListener("scroll", movePageLinksToMenu, true); // redundant with reactiveObserver?

onUrlChange(refreshSidePeekStyle);
window.addEventListener("visibilitychange", refreshSidePeekStyle);
