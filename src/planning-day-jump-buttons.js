const GROUP_HEADER_SELECTOR = '.notion-frame .notion-collection_view-block';
const BTNS_CONTAINER_WRAPPER_ID = 'tm-notion-day-jump-btns-wrapper';
const BTNS_CONTAINER_ID = 'tm-notion-day-jump-btns-container';
const DAY_JUMP_BUTTON_CLASS = 'tm-notion-day-jump-btn';
const LIST_VIEW_ROOT_SELECTOR =
'.notion-page-content > .notion-selectable.notion-transclusion_reference-block';


export const appendStyles = () => {

	// CSS styling
	const style = document.createElement('style');
	style.textContent = `

		#${BTNS_CONTAINER_WRAPPER_ID} {
			overflow: hidden;
			min-width: 0;
			flex-grow: 0;
			flex-shrink: 1;
			flex-basis: auto;
		}

		#${BTNS_CONTAINER_ID} {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
			gap: 6px;
			flex-wrap: nowrap;
		}

		.${DAY_JUMP_BUTTON_CLASS} {
			padding: 6px 10px;
			border-radius: 20px;
			border: none;
			background: rgb(244,245,247);
			cursor: pointer;
			font-size: 13px;
			text-align: center;
			color: #333;
			white-space: nowrap;
		}

		.${DAY_JUMP_BUTTON_CLASS}.active {
			background: rgb(35,131,226);
			color: #fff;
		}
	`;
	document.head.appendChild(style);

};

const findGroups = () => {
	const candidates = document.querySelectorAll(GROUP_HEADER_SELECTOR);

	const groups = [];

	candidates.forEach(element => {
		// Exclude list items
		if (element.classList.contains('notion-collection-item')) return;

		// Must have a caret button
		const caret = element.querySelector(':scope > div[role="button"]');
		if (!caret) return;

		// Must have a text label (second div, text-only)
		const labelDiv = [...element.children].find(c =>
			c.tagName === 'DIV' &&
			c.children.length === 0 &&
			c.innerText?.trim(),
		);
		if (!labelDiv) return;

		// Must have popup-origin block (count / controls)
		const popup = element.querySelector('[data-popup-origin="true"] div');
		if (!popup) return;

		const main = element.closest('[style*="contain: layout"]');
		if (!main) return;

		groups.push({
			value: labelDiv.innerText.trim(),
			header: element,
			element: main,
		});
	});

	groups.sort(
		(a, b) =>
			a.element.getBoundingClientRect().top -
			b.element.getBoundingClientRect().top,
	);

	return groups;
};



const getScroller = () => {
	return document.querySelector('.notion-frame > .notion-selectable-container > .notion-scroller.vertical');
};

// eslint-disable-next-line no-unused-vars
const scrollToGroup = ({ header, label, element }, event) => {

	const scroller = getScroller();
	if (!scroller) return;

	const scrollerRect = scroller.getBoundingClientRect();
	const elementRect = element.getBoundingClientRect();

	const currentScrollValue = scroller.scrollTop;
	const scrollViewTopFromViewport = scrollerRect.top;
	const nextGroupTopFromViewport = elementRect.top;


	const nextGroupTopFromScrollView = nextGroupTopFromViewport - scrollViewTopFromViewport;
	// const goingup = (nextGroupTopFromScrollView < 0) ? true : false;

	const nextScrollValue = currentScrollValue + nextGroupTopFromScrollView;

	// 		console.log(
	// `%c
	// scrolling ${goingup ? 'up' : 'down'} to group ${label}\n
	// current scroll value: ${currentScrollValue}\n
	// scroll view position from top of VP: ${scrollViewTopFromViewport}\n
	// next group position from top of VP: ${nextGroupTopFromViewport}\n
	// next group position from top of scroll view: ${nextGroupTopFromScrollView}\n
	// next scroll value ${nextScrollValue}\n
	// `, "color:#3b82f6");

	scroller.scrollTo({
		top: nextScrollValue,
		behavior: 'smooth',
	});

	scroller.focus?.();
};

let buttonsContainerWrapper = null;
let buttonsContainer = null;
export const buildDayButtonsContainer = () => {
	if (buttonsContainerWrapper) return buttonsContainerWrapper;

	buttonsContainerWrapper = document.createElement('div');
	buttonsContainerWrapper.id = BTNS_CONTAINER_WRAPPER_ID;

	buttonsContainer = document.createElement('div');
	buttonsContainer.id = BTNS_CONTAINER_ID;

	buttonsContainerWrapper.appendChild(buttonsContainer);

	return buttonsContainerWrapper;
};

const formatValue = (raw) => {
	const d = new Date(raw);
	if (isNaN(d)) return raw;

	return new Intl.DateTimeFormat('fr-FR', {
		weekday: 'long',
		day: 'numeric',
	})
		.format(d)
		.replace(/^\w/, c => c.toUpperCase());
};

const parseDate = (v) => new Date(v); // "Jan 8, 2026" → Date

// add or update day buttons
const updateButtons = () => {

	// reset to empty
	// buttonsContainer.innerHTML = "";
	// get existing buttons
	const existingValues = [...buttonsContainer.children].map(btn => btn.value);
	// console.log(`updateButtons - existingLabels: ${existingLabels.join(' ')}`);
	// console.log(`updateButtons - existingLabels`, existingLabels);
	// [...buttonsContainer.children].forEach(btn => console.log(btn.label));

	const groups = findGroups();
	if (!groups.length) {
		// console.log('updateButtons - found no group');
		return;
	}
	// else console.log(`updateButtons - found ${groupElements.length} groups`); 

	groups.forEach(({ value, element, header }) => {
		
		// create button if it does not already exists
		if (!existingValues.includes(value)) {
			const btn = document.createElement('button');
			btn.value = value;
			btn.textContent = formatValue(value);
			btn.classList.add(DAY_JUMP_BUTTON_CLASS);
			btn.onclick = (event) => scrollToGroup({ element, header, value }, event);

			// if first button just add it
			if (existingValues.length === 0) {
				buttonsContainer.appendChild(btn);
			}
			// otherwise find position among existing where to insert new button
			else {
				const nextValues = [...existingValues, value];
				const nextValuesSorted = nextValues.sort((a, b) => parseDate(a) - parseDate(b));
				const position = nextValuesSorted.indexOf(value);
				const childBefore = buttonsContainer.children[position] || null;
				// insert at position (will insert last if childBefore is null)
				buttonsContainer.insertBefore(btn, childBefore);
			}

		}
	});
};

const VISIBILITY_OFFSET = 90; // height of top header .notion-topbar

let lastActiveGroup = null;
const getActiveGroup = (groups) => {

	let activeGroup;

	for (const g of groups) {
		const top = g.element.getBoundingClientRect().top; // top relative to viewport
		if (top - VISIBILITY_OFFSET <= 0) activeGroup = g;
		else break;
	}

	// if no group currently visible, return the last active one or first one if none (on load)
	if (!activeGroup) activeGroup = lastActiveGroup || groups[0];

	if (activeGroup != lastActiveGroup) {
		// keep ref for next run
		lastActiveGroup = activeGroup;
		return activeGroup;
	}
	// otherwise return null to indicate no change
	else return null;

};

const updateActiveButton = () => {
	if (!buttonsContainerWrapper) {
		// console.log('updateActiveButton - found no buttons container');
		return;
	}
	const groups = findGroups();
	if (!groups.length) {
		// console.log('updateActiveButton - found no groups');
		return;
	}

	const activeGroup = getActiveGroup(groups);

	// if no active group returned it means it has not changed, return so we don't update unnecessarily
	if (!activeGroup) {
		// console.log('updateActiveButton - found no active group');
		return;
	}
	// else console.log(`updateActiveButton - found active group "${activeGroup.value}"`);

	[...buttonsContainer.children].forEach(btn =>
		btn.classList.toggle('active', btn.value === activeGroup.value),
	);
};

let listObserver = null;

const observeListView = (cb) => {
	if (listObserver) return;

	const listRoot = document.querySelector(LIST_VIEW_ROOT_SELECTOR);
	if (!listRoot) return;

	listObserver = new MutationObserver(() => {
		cb();
	});

	listObserver.observe(listRoot, {
		childList: true,
		subtree: true,
	});
};

const observeScroll = (cb) => {
	const scroller = getScroller();
	if (!scroller) return;

	scroller.addEventListener('scroll', cb, { passive: true });
};

const waitForListStabilized = (cb, delay = 150) => {
	let last = 0;
	let stableTimer = null;

	const obs = new MutationObserver(() => {
		const groups = findGroups();
		if (!groups.length) return;

		const totalHeight = groups.reduce(
			(s, g) => s + g.element.getBoundingClientRect().height,
			0,
		);

		if (Math.abs(totalHeight - last) < 2) {
			if (!stableTimer) {
				stableTimer = setTimeout(() => {
					obs.disconnect();
					cb();
				}, delay);
			}
		} else {
			clearTimeout(stableTimer);
			stableTimer = null;
			last = totalHeight;
		}
	});

	obs.observe(
		document.querySelector(LIST_VIEW_ROOT_SELECTOR),
		{ childList: true, subtree: true },
	);
};

// const nudgeScroller = () => {updateButtons
// 	const scroller = getScroller();
// 	if (!scroller) return;
// 	scroller.scrollTop += 1;
// 	scroller.scrollTop -= 1;
// };

export const watchContentAndUpdateButtons = () => {

	observeListView(() => { updateButtons(); }); // will trigger updateButtons() if listview changes

	waitForListStabilized(() => { updateActiveButton(); }); // wait for list to load and update

	observeScroll(() => { updateActiveButton(); }); // will trigger updateActiveButton() if scroll

	// nudgeScroller();

};


