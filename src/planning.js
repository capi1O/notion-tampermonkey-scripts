// ==UserScript==
// @name         Notion Planning
// @match        https://www.notion.so/*
// ==/UserScript==

import { addDayJumpButtons } from "./planning-day-jump-buttons.js";
import { addSidePeekButtons } from "./planning-side-peek-buttons.js";

addDayJumpButtons();
addSidePeekButtons();
