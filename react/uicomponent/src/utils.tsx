import {
  LanguageData,
  ScriptData,
  Region,
} from "@languagepicker/find-language";
import { cloneDeep } from "lodash";
import { FuseResult } from "fuse.js";

export enum NodeType {
  Language = "language",
  Script = "script",
}

export type OptionNode = {
  nodeData: LanguageData | ScriptData;
  id: string;
  nodeType: NodeType;
  childNodes: OptionNode[]; // In a language node, this will have all the relevant scripts as nodes
};

// TODO optional vs undefined
export type CustomizableLanguageDetails = {
  displayName?: string;
  scriptOverride?: ScriptData;
  region?: Region;
  dialect?: string;
};

export const UNLISTED_LANGUAGE_NODE_ID = "unlisted-language";
export const UNLISTED_LANGUAGE_NODE = {
  nodeData: {
    code: "qaa",
    autonym: undefined,
    exonym: "Unknown Lanuage",
    regionNames: "",
    scripts: [],
    alternativeTags: [],
    names: "",
  } as LanguageData,
  id: UNLISTED_LANGUAGE_NODE_ID,
  nodeType: NodeType.Language,
  childNodes: [],
} as OptionNode;
export const SCRIPT_OVERRIDE_NODE_ID = "script-override";

// TODO put this somewhere else?
export function createTag(
  languageCode?: string,
  scriptCode?: string,
  regionCode?: string,
  dialectCode?: string
) {
  if (!languageCode) {
    // Unlisted language
    return `qaa-x-${dialectCode}`;
  }
  let tag = languageCode;
  if (scriptCode) {
    tag += `-${scriptCode}`;
  }
  if (regionCode) {
    tag += `-${regionCode}`;
  }
  if (dialectCode) {
    tag += `-${dialectCode}`;
  }
  return stripDemarcation(tag);
}

// for marking/bolding the substrings which match the search string
export const START_OF_MATCH_MARKER = "[";
export const END_OF_MATCH_MARKER = "]";

export function demarcateResults(results: FuseResult<LanguageData>[]) {
  const resultsCopy = cloneDeep(results);
  for (const result of resultsCopy) {
    for (const match of result.matches) {
      let lastTrasnferredIndex = 0;
      const newValue = [];
      for (const [matchStart, matchEnd] of match.indices) {
        newValue.push(match.value.slice(lastTrasnferredIndex, matchStart));
        newValue.push(START_OF_MATCH_MARKER);
        newValue.push(match.value.slice(matchStart, matchEnd + 1));
        newValue.push(END_OF_MATCH_MARKER);
        lastTrasnferredIndex = matchEnd + 1;
      }
      newValue.push(match.value.slice(lastTrasnferredIndex));
      result.item[match.key] = newValue.join("");
    }
  }
  return resultsCopy;
}

export function stripDemarcation(str: string): string {
  if (!str) return str;
  return str
    .replaceAll(START_OF_MATCH_MARKER, "")
    .replaceAll(END_OF_MATCH_MARKER, "");
}

// no utils file, things can get their own files, tests go right next to the things they test in .spec .ts
// maybe ILanguage, IScript. Can be exported from something. Index?
// language lookup
