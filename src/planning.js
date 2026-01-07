// ==UserScript==
// @name         Notion Planning
// @match        __PLANNING_URL__
// ==/UserScript==

import { addDayJumpButtons } from "./planning-day-jump-buttons.js";
import { addSidePeekButtons } from "./planning-side-peek-buttons.js";

addDayJumpButtons();
addSidePeekButtons();
