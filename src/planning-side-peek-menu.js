
// SIDE PEEK MENU
// const SIDE_PEEK_MENU_ID = "tm-notion-side-peek-menu";
const SIDE_PEEK_BUTTON_ID = 'tm-notion-side-peek-button';
const SIDE_PEEK_INDICATOR_ID = 'tm-notion-side-peek-indicator';
const SIDE_PEEK_MENU_ID = 'tm-notion-side-peek-menu';
const SIDE_PEEK_MENU_ARROW_ID = 'tm-notion-side-peek-menu-arrow';
const SIDE_PEEK_MENU_ACTIVE_VALUE_ID = 'tm-notion-side-peek-menu-active-value';
const SIDE_PEEK_MENU_VALUES_ID = 'tm-notion-side-peek-menu-values';

export const appendStyles = () => {

	// CSS styling
	const sidePeekMenuStyle = document.createElement('style');
	sidePeekMenuStyle.textContent = `
		#${SIDE_PEEK_BUTTON_ID} {
			margin-left: 8px;
			display: flex;
			gap: 1px;
			flex-wrap: nowrap;
			/* flex-grow: 1; */
			flex-shrink: 0;
			flex-basis: auto;
		}

		/* side peek icon on the left */
		#${SIDE_PEEK_INDICATOR_ID} {
			border-radius: 20px 0px 0px 20px; /* top-left | top-right | bottom-right | bottom-left */
			color: #333;
			background: rgb(244,245,247);
			padding: 7px 5px 7px 10px; /* top | right | bottom | left*/
		}
		#${SIDE_PEEK_INDICATOR_ID} > svg {
			width: 20px;
			height: 20px;
			display: block;
			flex-shrink: 0;
			fill: #333;
		}
		#${SIDE_PEEK_INDICATOR_ID}.active {
			color: #fff;
			background: rgb(35,131,226);
		}
		#${SIDE_PEEK_INDICATOR_ID}.active > svg {
			fill: #fff;
		}



		/* page links drop down menu */
		#${SIDE_PEEK_MENU_ID} {
			position: relative;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-end;
			min-width: max-content;
			color: #333;
			background: rgb(244,245,247);
			border-radius: 0px 20px 20px 0px; /* top-left | top-right | bottom-right | bottom-left */
			padding: 0px 5px 0px 5px; /* top | right | bottom | left*/
			overflow: hidden;
		}
		#${SIDE_PEEK_MENU_ID}.active {
			color: #fff;
			background: rgb(35,131,226);
		}
		/* if side peek not opened */
		#${SIDE_PEEK_INDICATOR_ID}:not(.active) + #${SIDE_PEEK_MENU_ID} {
			filter: grayscale(1);
			opacity: 0.5;
		}
		#${SIDE_PEEK_INDICATOR_ID}:not(.active) + #${SIDE_PEEK_MENU_ID} a {
			cursor: all-scroll !important;
		}
		#${SIDE_PEEK_MENU_ID}.open {
			overflow: visible;
		}

		/* link */
		#${SIDE_PEEK_MENU_ACTIVE_VALUE_ID} {
			color: inherit;
			background: none;
		}
		#${SIDE_PEEK_MENU_ACTIVE_VALUE_ID} > a {
			font-size: 13px;
			color: inherit !important;
			background: none;
		}

		/* menu values */
		#${SIDE_PEEK_MENU_VALUES_ID} {
			position: absolute;
			top: 15px;
			left: 0px;
			width: 100%;
			padding: 20px 0px 10px 5px; /* top | right | bottom | left*/
			overflow: hidden;
			z-index: -1;
			height: 0px;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			color: inherit;
			background: inherit;
			border-radius: 0px 0px 20px 20px; /* top-left | top-right | bottom-right | bottom-left */
			border: none;
		}

		#${SIDE_PEEK_MENU_ID}.open > #${SIDE_PEEK_MENU_VALUES_ID} {
			height: auto;
		}

		#${SIDE_PEEK_MENU_VALUES_ID} > a {
			border: none;
			padding-right: 6px;
			cursor: pointer;
			font-size: 13px;
			text-align: center;
			color: inherit !important;
			background: none;
			/* border: 1px solid transparent; */
		}

		/* arrow button */
		#${SIDE_PEEK_MENU_ARROW_ID} {
			padding: 7px;
			cursor: pointer;
		}
		#${SIDE_PEEK_MENU_ARROW_ID} > svg {
			width: 0.8em;
			height: 0.8em;
			display: block;
			flex-shrink: 0;
			color: inherit;
			transition: transform 200ms ease-out;
			transform: rotateZ(0deg);
			opacity: 1;
			fill: #333;
		}
		#${SIDE_PEEK_MENU_ID}.open > #${SIDE_PEEK_MENU_ARROW_ID} > svg,
		#${SIDE_PEEK_MENU_ARROW_ID}:hover > svg {
			fill: rgb(35,131,226);
		}
		#${SIDE_PEEK_MENU_ID}.active > #${SIDE_PEEK_MENU_ARROW_ID} > svg {
			fill: #fff;
		}
		#${SIDE_PEEK_MENU_ID}.active.open > #${SIDE_PEEK_MENU_ARROW_ID} > svg,
		#${SIDE_PEEK_MENU_ID}.active > #${SIDE_PEEK_MENU_ARROW_ID}:hover > svg {
			fill: red;
		}
	`;
	document.head.appendChild(sidePeekMenuStyle);
};

let sidePeekMenu = null;
let sidePeekIndicator = null;
let activeValue = null;
let values = null;
export const buildSidePeekButton = () => {
	
	const sidePeekButton = document.createElement('div');
	sidePeekButton.id = SIDE_PEEK_BUTTON_ID;

	const sidePeekIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	sidePeekIcon.setAttribute('aria-hidden', 'true');
	sidePeekIcon.setAttribute('role', 'graphics-symbol');
	sidePeekIcon.setAttribute('viewBox', '0 0 20 20');
	sidePeekIcon.classList.add('peekSide', 'directional-icon');
	const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path1.setAttribute('d', 'M10.392 6.125a.5.5 0 0 0-.5.5v6.75a.5.5 0 0 0 .5.5h4.683a.5.5 0 0 0 .5-.5v-6.75a.5.5 0 0 0-.5-.5z');
	const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path2.setAttribute('d', 'M4.5 4.125A2.125 2.125 0 0 0 2.375 6.25v7.5c0 1.174.951 2.125 2.125 2.125h11a2.125 2.125 0 0 0 2.125-2.125v-7.5A2.125 2.125 0 0 0 15.5 4.125zM3.625 6.25c0-.483.392-.875.875-.875h11c.483 0 .875.392.875.875v7.5a.875.875 0 0 1-.875.875h-11a.875.875 0 0 1-.875-.875z');
	sidePeekIcon.appendChild(path1);
	sidePeekIcon.appendChild(path2);
	sidePeekIndicator = document.createElement('div');
	sidePeekIndicator.id = SIDE_PEEK_INDICATOR_ID;
	sidePeekIndicator.appendChild(sidePeekIcon);
	sidePeekButton.appendChild(sidePeekIndicator);


	sidePeekMenu = document.createElement('div');
	sidePeekMenu.id = SIDE_PEEK_MENU_ID;
	sidePeekButton.appendChild(sidePeekMenu);

	activeValue = document.createElement('div');
	activeValue.id = SIDE_PEEK_MENU_ACTIVE_VALUE_ID;
	sidePeekMenu.appendChild(activeValue);

	const arrowIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	arrowIcon.setAttribute('aria-hidden', 'true');
	arrowIcon.setAttribute('role', 'graphics-symbol');
	arrowIcon.setAttribute('viewBox', '0 0 16 16');
	arrowIcon.classList.add('arrowCaretDownFillSmall');
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('d', 'M2.835 3.25a.8.8 0 0 0-.69 1.203l5.164 8.854a.8.8 0 0 0 1.382 0l5.165-8.854a.8.8 0 0 0-.691-1.203z');
	arrowIcon.appendChild(path);
	const arrow = document.createElement('div');
	arrow.id = SIDE_PEEK_MENU_ARROW_ID;
	arrow.appendChild(arrowIcon);
	arrow.onclick = event => {
		event.stopPropagation();
		sidePeekMenu.classList.toggle('open');
	};
	sidePeekMenu.appendChild(arrow);

	values = document.createElement('div');
	values.id = SIDE_PEEK_MENU_VALUES_ID;
	sidePeekMenu.appendChild(values);

	return sidePeekButton;
};

const getActiveLink = () => {
	const activeLink = activeValue.querySelector('a');
	return activeLink;
};

const onLinkClick = (link, event) => {
	
	// 0. check if click linked is not already active
	// eslint-disable-next-line no-extra-boolean-cast
	if (!!link.closest(`.${SIDE_PEEK_MENU_ACTIVE_VALUE_ID}`)) return;

	// 1. get current active link
	const oldActiveLink = getActiveLink();

	// 2. move old to menu
	if (oldActiveLink) values.appendChild(oldActiveLink);

	// 2. move new to active
	// activeValue.innerHTML = "";
	activeValue.appendChild(link);


	sidePeekMenu.classList.remove('open');
};

const isSidePeekOpen = () => {
	return /[?&]p=/.test(location.search);
};

// PAGE LINKS
const pageIds = {
	backlog: '27a9f56f-f579-41f8-83ea-5147c7f99bb5',
	overdue: '74dc1bfe-79a6-822e-b4ac-819b0856981f',
	calendar: '18cc1bfe-79a6-80c3-b86e-daacaf85cd5d',
	codeTasks: '18cc1bfe-79a6-80ca-852d-e4e762e389d8',
	boatTasks: '18cc1bfe-79a6-805c-9f38-fa6b5f790d4e',
	appProjects: '196c1bfe-79a6-801b-afdc-f467feaf038c',
};

const pageParam = (pageId) => {
	const result = pageId.replace(/-/g, '');
	// console.log(`pageParam ${pageId} => ${result}`);
	return result;
};


const isPageOpenInSidePeek = (pgeParam) => {
	const result = location.search.includes(`p=${pgeParam}`);
	// console.log(`isPageOpenInSidePeek, param '${pgeParam}'? ${result}`);
	return result;
};

// Move real notion page link/button in side peek container
export const movePageLinksToMenu = () => {
	Object.entries(pageIds).forEach(([key, pageId]) => {
		const pageLink = document.querySelector(`[data-block-id="${pageId}"] a`);
		if (!pageLink || !sidePeekMenu) return;
		pageLink.id = pageId;
		pageLink.onclick = (event) =>  onLinkClick(pageLink, event);
		// sidePeekMenu.querySelector('.tm-notion-side-peek-menu-values').appendChild(pageLink);
		if (key === 'backlog') activeValue.appendChild(pageLink);
		else values.appendChild(pageLink);
	});
};

// update side peek menu/button / active flag and side peek icon active flag
export const refreshSidePeekStyle = () => {

	if (sidePeekIndicator) {
		sidePeekIndicator.classList.toggle('active', isSidePeekOpen());
	}

	if (sidePeekMenu) {
		const activeLink = getActiveLink();
		if (activeLink) {
			sidePeekMenu.classList.toggle('active', isPageOpenInSidePeek(pageParam(activeLink.id)));
		}
	}
};
