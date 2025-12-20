// ==UserScript==
// @name         Notion Side Peek buttons
// @match        https://www.notion.so/*
// ==/UserScript==

(function () {
	const BLOCK_ID = "27a9f56f-f579-41f8-83ea-5147c7f99bb5";
	const PAGE_P_PARAM = "27a9f56ff57941f883ea5147c7f99bb5"; // p=... in URL when side-peek open
	const BTN_ID = "tm-notion-sidepeek-backlog-btn";

	function openSidePeek() {
		const block = document.querySelector(`[data-block-id="${BLOCK_ID}"] a`);
		if (!block) return;
		block.dispatchEvent(new MouseEvent("click", { altKey: true, bubbles: true }));
	}

	function isSidePeekOpen() {
		return window.location.search.includes(`p=${PAGE_P_PARAM}`);
	}

	// create button element
	function makeButton() {
		if (document.getElementById(BTN_ID)) return document.getElementById(BTN_ID);

		const btn = document.createElement("button");
		btn.id = BTN_ID;
		btn.innerHTML = `<span style="font-size:18px;line-height:1;">🗄️</span>
										 <span style="margin-left:8px;font-weight:600;font-size:16px;line-height:1;">Backlog</span>`;
		Object.assign(btn.style, {
			position: "absolute",         // positioned relative to #main.notion-frame
			top: "-12px",
			right: "12px",
			zIndex: "9999",
			padding: "8px 12px",
			borderRadius: "8px",
			border: "none",
			display: "inline-flex",
			alignItems: "center",
			gap: "8px",
			cursor: "pointer",
			boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
			transition: "background .15s, color .15s, transform .08s",
			transform: "translateZ(0)"
		});
		btn.onclick = openSidePeek;
		btn.onmouseenter = () => btn.style.transform = "translateY(-1px)";
		btn.onmouseleave = () => btn.style.transform = "translateY(0)";
		return btn;
	}

	// apply colors based on active state
	function refreshButtonStyle(btn) {
		if (!btn) return;
		if (isSidePeekOpen()) {
			btn.style.background = "rgb(35,131,226)"; // Notion "New" blue
			btn.style.color = "#fff";
		} else {
			btn.style.background = "rgb(244,245,247)"; // light grey like Notion views
			btn.style.color = "#333";
		}
	}

	// target container (your selector)
	const STABLE_ROOT_SELECTOR = ".notion-frame";
	const TARGET_SELECTOR = ".notion-frame > .notion-selectable-container > .notion-scroller.vertical > div > .layout > .layout-content";

	function findRoot() {
		// return document.querySelector(TARGET_SELECTOR);
		const root = document.querySelector(STABLE_ROOT_SELECTOR);
		if (!root) {
			console.log('findRoot - root not found');
			return;
		}
		else { console.log('findRoot - root found');
			return root;
		}

		// if (getComputedStyle(root).position === "static") {
		// 	root.style.position = "relative";
		// }
	}

	function attachButtonToRoot(root) {
		if (document.getElementById(BTN_ID)) return;


		const btn = makeButton();
		refreshButtonStyle(btn);

		// avoid duplicate
		if (!root.querySelector(`#${BTN_ID}`)) {
				console.log('attachButtonToRoot - attaching button');
				root.appendChild(btn);
		}
		else console.log('attachButtonToRoot - button already exists');


		// watch DOM for route changes to update style (Notion uses history API heavily)
		let lastHref = location.href;
		const routeObserver = new MutationObserver(() => {
			if (location.href !== lastHref) {
				lastHref = location.href;
				refreshButtonStyle(btn);
			}
		});
		routeObserver.observe(document.documentElement, { childList: true, subtree: true });

		// also update when focus/visibility changes (just in case)
		window.addEventListener("visibilitychange", () => refreshButtonStyle(btn));
		window.addEventListener("popstate", () => refreshButtonStyle(btn));


		// position
		function reposition() {
			const target = document.querySelector(TARGET_SELECTOR);
			if (!target) {
				console.log('attachButtonToRoot/reposition - target not found');
				return;
			}
			else console.log('attachButtonToRoot/reposition - target found');


			const r = target.getBoundingClientRect();
			const rr = root.getBoundingClientRect();

			btn.style.position = "absolute";
			btn.style.top = "12px";
			// console.log(`${attachButtonToRoot/reposition - }px`);
			btn.style.right = `${rr.right - r.right + 8}px`;

		}

		reposition();

		// keep position in sync without touching layout DOM
		window.addEventListener("resize", reposition);
		window.addEventListener("scroll", reposition, true);

		// react to Notion navigation
		const mo = new MutationObserver(reposition);
		mo.observe(document.body, { childList: true, subtree: true });
	}

	// Wait for container, then attach button
	function addButton() {

		let lastRoot = null;

		
		function attachIfReady() {
			const root = findRoot();
			if (!root) console.log('addButton - root not found');
			else console.log('addButton - root found');
			if (!root) return;

			// If Notion rebuilt the element, reattach
			if (root !== lastRoot) {
				console.log('addButton - root different than before');
				lastRoot = root;

				attachButtonToRoot(root);
			}
		}


		// Initial poll (Notion loads progressively)
		const poll = setInterval(() => {
			attachIfReady();
			if (lastRoot) clearInterval(poll);
		}, 150);

		// Watch for future DOM rebuilds (Notion router)
		const mo = new MutationObserver(() => {
				const root = findRoot();
				if (root && root !== lastRoot) {
						console.log('waitForRootAndAttach/addButton - DOM change, root found and different than before');
						lastRoot = root;
						attachButtonToRoot(root);
				}
				else console.log('waitForRootAndAttach/addButton - DOM change, root not found or same than before');
		});

		mo.observe(document.body, { childList: true, subtree: true });
	}


	// kick
	addButton();

})();
