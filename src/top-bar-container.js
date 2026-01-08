// TOP BAR BUTTONS CONTAINER
export const NOTION_TOPBAR_SELECTOR = '.notion-topbar';
export const NOTION_BREADCRUMB_SELECTOR = '.shadow-cursor-breadcrumb';
const TOP_BAR_BTNS_CONTAINER_ID = 'tm-notion-top-bar-btns-container';
const NOTION_HIDE_CLASS = 'tm-notion-hide';

// buttons container is added to top bar (.notion-frame) and manually styled to match target width
const TARGET_SELECTOR =
'.notion-frame > .notion-selectable-container > .notion-scroller.vertical > div > .layout > .layout-content';

export const appendStyles = () => {

	// CSS styling
	const buttonsContainerStyle = document.createElement('style');
	buttonsContainerStyle.textContent = `
		#${TOP_BAR_BTNS_CONTAINER_ID} {
			position: absolute;
			top: 6px;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			flex-wrap: nowrap;
			padding-left: 4px;
			padding-right: 12px;
		}

		.${NOTION_HIDE_CLASS}, .shadow-cursor-breadcrumb, .notion-topbar-share-menu, .notion-topbar-favorite-button {
			display: none !important;
		}
	`;
	document.head.appendChild(buttonsContainerStyle);
};

let topBarButtonsContainer = null;
export const buildTopBarButtonsContainer = () => {
	// let buttonsContainer = document.getElementById(BTNS_CONTAINER_ID);
	if (topBarButtonsContainer) return topBarButtonsContainer;
	
	topBarButtonsContainer = document.createElement('div');
	topBarButtonsContainer.id = TOP_BAR_BTNS_CONTAINER_ID;

	return topBarButtonsContainer;
};


// attach container to Notion top bar when it is loaded
export const attachContainerToNotionTopBarWhenReadyThen = (callback) => {

	const attachObserver = new MutationObserver(() => {
		const topbar = document.querySelector(NOTION_TOPBAR_SELECTOR);
		if (topbar) {
			const breadcrumb = topbar.querySelector(NOTION_BREADCRUMB_SELECTOR);
			if (breadcrumb) {
				attachObserver.disconnect();
				// console.log('topbar and breadcrumb found, attaching');

				// if (getComputedStyle(topbar).position === "static") topbar.style.position = "relative";

				const topBarButtonsContainer = buildTopBarButtonsContainer();
					
				// attach to Notion top bar (after breadcrumb)
				if (!topbar.contains(topBarButtonsContainer)) breadcrumb.after(topBarButtonsContainer);

				repositionTopBarButtonsContainer();

				callback(topBarButtonsContainer);
			}
			// else console.log('breadcrumb not found');

			// wait for flexible space to appear then hide it
			hideFlexibleSpace(topbar); // TODO: rename + prevent observer from being added multiple times
		}
		// else  console.log('topbar not found');
	});
	attachObserver.observe(document.body, { childList: true, subtree: true });

};

export const repositionTopBarButtonsContainer = () => {
	if (!topBarButtonsContainer) return;

	const target = document.querySelector(TARGET_SELECTOR);
	if (!target) return;

	const targetRect = target.getBoundingClientRect();
	// console.log('layout content rect:', targetRect);
	topBarButtonsContainer.style.left = `${targetRect.left}px`;
	topBarButtonsContainer.style.width = `${targetRect.width - 2}px`;
};




// hide top bar "flex" div (cannot in CSS only)
export const hideFlexibleSpace = (topbar) => {
	// console.log('hideFlexibleSpace')
	const flexSpaceObserver = new MutationObserver(() => {
		const potentialFlexibleSpace = [...topbar.querySelectorAll('.notion-selectable-container > div > div')];
		// const potentialFlexibleSpace = topbar.querySelector('.notion-selectable-container > div > div [style*="flex-grow: 1"][style*="flex-shrink: 1"]')

		if (potentialFlexibleSpace.length > 0) {
			// console.log(`found ${potentialFlexibleSpace.length} potential flexible space`);

			// const flexibleSpace = potentialFlexibleSpace
			potentialFlexibleSpace
				.forEach(div => {
					// const followedByActionButtons = div.nextElementSibling?.classList.contains('notion-topbar-action-buttons');
					// const style = getComputedStyle(div);
					// const isFlex = style.flexGrow === '1' && style.flexShrink === '1';
					const s = div.getAttribute('style') || '';
					const isFlex = /flex-grow\s*:\s*1/.test(s) && /flex-shrink\s*:\s*1/.test(s);

					if (isFlex) {// && followedByActionButtons
						// console.log('found flexible space')
						flexSpaceObserver.disconnect();
						div.classList.add(NOTION_HIDE_CLASS);
					}
				});
		}
		// else console.log('found no potential flexible space')
	});
	flexSpaceObserver.observe(topbar, { childList: true, subtree: true });
};


