// ==UserScript==
// @name         Notion Planning
// @match        https://www.notion.so/*
// ==/UserScript==

import { addDayJumpButtons } from "../notion-day-jump-buttons.js";
import { addSidePeekButtons } from "../notion-side-peek-buttons.js";

addDayJumpButtons();
addSidePeekButtons();
