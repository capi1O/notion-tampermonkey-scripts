// ==UserScript==
// @name         Notion Side Peek buttons
// @match        https://www.notion.so/*
// ==/UserScript==

(() => {
	// CSS styling
	const style = document.createElement('style');
	style.textContent = `

		.tm-notion-side-peek-btn {
			padding: 6px 10px;
			border-radius: 6px;
			border: none;
			background: rgb(244,245,247);
			cursor: pointer;
			font-size: 13px;
			text-align: center;
			color: #333;
		}

		.tm-notion-side-peek-btn > span {
			font-size: 13px !important;
		}


		.tm-notion-side-peek-btn.active {
			background: rgb(35,131,226);
			color: #fff;
		}
	`;
	document.head.appendChild(style);


	const BLOCK_ID = "27a9f56f-f579-41f8-83ea-5147c7f99bb5";
	const PAGE_P_PARAM = "27a9f56ff57941f883ea5147c7f99bb5";
	const BTN_ID = "tm-notion-sidepeek-backlog-btn";

	const NOTION_TOPBAR_SELECTOR = ".notion-topbar";
	const NOTION_TOPBAR_BREADCRUMB_SELECTOR = ".notion-topbar .shadow-cursor-breadcrumb";

	function isSidePeekOpen() {
		return location.search.includes(`p=${PAGE_P_PARAM}`);
	}

	function openSidePeek() {
		const a = document.querySelector(`[data-block-id="${BLOCK_ID}"] a`);
		a?.dispatchEvent(new MouseEvent("click", { altKey: true, bubbles: true }));
	}

	let btn = null;

	function makeButton() {
		if (btn) return btn;

		btn = document.createElement("button");
		btn.id = BTN_ID;
		btn.innerHTML = `
			<span style="font-size:18px;">🗄️</span>
			<span style="font-size:16px;font-weight:600;margin-left:8px;">Backlog</span>
		`;
		btn.classList.add('tm-notion-side-peek-btn');

		btn.onclick = openSidePeek;
		btn.onmouseenter = () => (btn.style.transform = "translateY(-1px)");
		btn.onmouseleave = () => (btn.style.transform = "translateY(0)");

		return btn;
	}

	function refreshStyle() {
		if (!btn) return;

		btn.classList.toggle("active", isSidePeekOpen())
	}


	// TODO: reuse
	function attach(topbar, breadcrumb) {
		if (getComputedStyle(topbar).position === "static") {
			topbar.style.position = "relative";
		}

		const b = makeButton();
		if (!topbar.contains(b)) {
			breadcrumb.after(b);
		}
	}

	// TODO: reuse
	const attachObserver = new MutationObserver(() => {
		const topbar = document.querySelector(NOTION_TOPBAR_SELECTOR);
		if (topbar) {
				const breadcrumb = topbar.querySelector(NOTION_TOPBAR_BREADCRUMB_SELECTOR);
				if (breadcrumb) {
					attachObserver.disconnect();
					// console.log('topbar and breadcrumb found, attaching');
					attach(topbar, breadcrumb);
				}
				// else console.log('breadcrumb not found');

		}
		// else  console.log('topbar not found');
	});

	attachObserver.observe(document.body, { childList: true, subtree: true });

	window.addEventListener("popstate", refreshStyle);
	window.addEventListener("visibilitychange", refreshStyle);
})();
