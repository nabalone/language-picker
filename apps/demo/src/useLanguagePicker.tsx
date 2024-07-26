import {
  LanguageData,
  ScriptData,
  searchForLanguage,
} from "@languagepicker/ethnolib";
import { useState } from "react";
import { stripDemarcation, stripResultMetadata } from "./modifySearchResults";
import { FuseResult } from "fuse.js";

export enum NodeType {
  Language = "language",
  Script = "script",
}

export type LanguageTreeNode = {
  nodeData: LanguageData | ScriptData | null;
  id: string;
  nodeGeneology: string[]; // the ids of the path to this node
  nodeType: NodeType;
  // its possible we want to enforce that the user always selects down to a leaf node,
  //  in which case this would be unneccessary and we could just check for the presence
  //  of childNodes. But I think that's not the case and some choices will be optional/have fallbacks
  requiresFurtherSelection: boolean;
  childNodes: LanguageTreeNode[];
};

export type CustomLangTagDetails = {
  displayName?: string;
  scriptOverride?: string;
  region?: string;
  unlistedLanguageName?: string; // combine with dialect?
  dialect?: string;
  // TODO
  // 4.  Variant subtags MUST be registered with IANA according to the
  // rules in Section 3.5 of this document before being used to form
  // language tags.  In order to distinguish variants from other types
  // of subtags, registrations MUST meet the following length and
  // content restrictions:

  // 1.  Variant subtags that begin with a letter (a-z, A-Z) MUST be
  //     at least five characters long.
};

interface LanguagePickerState {
  languageDataTree: LanguageTreeNode[];
  selectedLanguageNode: LanguageTreeNode | undefined;
  selectedScriptNode: LanguageTreeNode | undefined;
  // status: Status;
  languageDisplayName: string;
  customLangTagDetails: CustomLangTagDetails;
  // currentlyProcessingTimeoutId: number | undefined;
}

// TODO get rid of all the tree and node language?

function readyToSubmit(state: LanguagePickerState) {
  // There shouldn't be a selectedScriptNode without a selectedLanguageNode anyway...
  return !!state.selectedLanguageNode && !!state.selectedScriptNode;
}

export const useLanguagePicker = (
  modifySearchResults?: (
    results: FuseResult<LanguageData>[],
    searchString: string
  ) => LanguageData[]
) => {
  const [state, setState] = useState({
    languageDataTree: [] as LanguageTreeNode[],
    selectedLanguageNode: undefined,
    selectedScriptNode: undefined,
    languageDisplayName: "",
    // status: Status.Ready,
    // currentlyProcessingTimeoutId: undefined as number | undefined, // TODO what is the default number?
  } as LanguagePickerState);

  const onSearchStringChange = (searchString: string) => {
    // if (state.currentlyProcessingTimeoutId) {
    //   clearTimeout(state.currentlyProcessingTimeoutId);
    // }
    setState({
      ...state,
      languageDataTree: [],
      selectedLanguageNode: undefined,
      selectedScriptNode: undefined,
      languageDisplayName: "",
    } as LanguagePickerState);
    // setTimeout(() => {
    if (searchString.length > 1) {
      // the query for one character is slow and probably not useful
      doSearchAndUpdate(searchString, modifySearchResults);
    }
    // });
  };

  const saveCustomLangTagDetails = (details: CustomLangTagDetails) => {
    for (const scriptNode of state.selectedLanguageNode?.childNodes || []) {
      if (scriptNode.id === details.scriptOverride) {
        selectNode(scriptNode);
        details["scriptOverride"] = undefined;
        break;
      }
    }
    // TODO deal with presence/absence of fields
    const updatedDetails = { ...state.customLangTagDetails, ...details };
    setState({
      ...state,
      customLangTagDetails: updatedDetails,
    });
  };

  // TODO is this still used?
  const unSelectAll = () => {
    console.log("unselecting all");
    setState({
      ...state,
      selectedLanguageNode: undefined,
      selectedScriptNode: undefined,
      // status: Status.Ready,
      languageDisplayName: "",
      customLangTagDetails: {},
    });
  };

  async function doSearchAndUpdate(
    searchString: string,
    modifySearchResults?: (
      results: FuseResult<LanguageData>[],
      searchString: string
    ) => LanguageData[]
  ) {
    const searchResults = searchForLanguage(searchString);
    let languageList: LanguageData[];
    if (modifySearchResults) {
      languageList = modifySearchResults(searchResults, searchString);
    } else {
      languageList = stripResultMetadata(searchResults);
    }
    const languageDataTree = languageList.map((language) => {
      const languageNode: LanguageTreeNode = {
        nodeData: language,
        id: language.code,
        nodeGeneology: [language.code],
        nodeType: NodeType.Language,
        requiresFurtherSelection: language.scripts.length > 1,
        childNodes: [],
      };

      const scriptNodes = language.scripts.map((script) => {
        return {
          nodeData: script,
          id: script.code,
          nodeGeneology: [language.code, script.code],
          nodeType: NodeType.Script,
          requiresFurtherSelection: false,
          childNodes: [],
        } as LanguageTreeNode;
      });
      languageNode.childNodes = scriptNodes;
      return languageNode;
    });
    setState({
      ...state,
      languageDataTree,
      selectedLanguageNode: undefined,
      selectedScriptNode: undefined,
      languageDisplayName: "",
      // status: Status.Ready,
      //   currentlyProcessingTimeoutId: undefined,
    } as LanguagePickerState);
  }

  const toggleSelectNode = (node: LanguageTreeNode) => {
    if (!node) {
      console.error("no node selected");
      return;
    } else if (node.id === state.selectedLanguageNode?.id) {
      // Clicking on the selected language node unselects it and thus everything
      unSelectAll();
      return;
    } else if (node.id === state.selectedScriptNode?.id) {
      // clicking on the selected script node unselects it
      setState({
        ...state,
        selectedScriptNode: undefined,
      });
      return;
    } else if (node.nodeType === NodeType.Language) {
      setState({
        ...state,
        selectedLanguageNode: node,
        selectedScriptNode:
          node.childNodes.length == 1 ? node.childNodes[0] : undefined,
        languageDisplayName: stripDemarcation(
          node.nodeData?.autonym || node.nodeData?.exonym || ""
        ),
      });
    } else if (node.nodeType === NodeType.Script) {
      setState({
        ...state,
        selectedScriptNode: node,
      });
    }
  };

  const changeLanguageDisplayName = (displayName: string) => {
    setState({
      ...state,
      languageDisplayName: displayName,
    });
  };
  return {
    languageDataTree: state.languageDataTree,
    selectedLanguageNode: state.selectedLanguageNode,
    selectedScriptNode: state.selectedScriptNode,
    languageDisplayName: state.languageDisplayName,
    currentTag: createTag(
      state.selectedLanguageNode?.id || "",
      state.selectedScriptNode?.id,
      state.customLangTagDetails?.region, // TODO code vs name
      state.customLangTagDetails?.dialect
    ),
    readyToSubmit: readyToSubmit(state),
    onSearchStringChange,
    toggleSelectNode: toggleSelectNode,
    changeLanguageDisplayName,
    unSelectAll,
    customLangTagDetails: state.customLangTagDetails,
    saveCustomLangTagDetails, // TODO this is dangerous in potential combinations with other state changes
  };
};

// TODO put this somewhere else
export function createTag(
  languageCode: string,
  scriptCode?: string,
  regionCode?: string,
  dialect?: string
) {
  let tag = languageCode;
  if (scriptCode) {
    tag += `-${scriptCode}`;
  }
  if (regionCode) {
    tag += `-${regionCode}`;
  }
  if (dialect) {
    tag += `-${dialect}`;
  }
  return stripDemarcation(tag);
}
