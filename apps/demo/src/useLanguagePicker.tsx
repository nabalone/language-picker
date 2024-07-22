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

// export enum Status {
//   Loading = "loading",
//   Ready = "ready",
// ReadyToSubmit = "readyToSubmit",
// TODO do we still want status? we can now check for script selected...
// MoreSelectionNeeded = "moreSelectionNeeded",
// }

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

interface LanguagePickerState {
  languageDataTree: LanguageTreeNode[];
  selectedLanguageNode: LanguageTreeNode | undefined;
  selectedScriptNode: LanguageTreeNode | undefined;
  // status: Status;
  languageDisplayName: string;
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
    unSelectAll();
    setState({
      ...state,
      languageDataTree: [],
      // status: Status.Loading,
      //   currentlyProcessingTimeoutId: setTimeout(() => {
      //     doSearchAndUpdate(searchString);
      //   }),
    } as LanguagePickerState);
    // setTimeout(() => {
    if (searchString.length > 1) {
      // the query for one character is slow and probably not useful
      doSearchAndUpdate(searchString, modifySearchResults);
    }
    // });
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
    readyToSubmit: readyToSubmit(state),
    onSearchStringChange,
    toggleSelectNode: toggleSelectNode,
    changeLanguageDisplayName,
    unSelectAll,
  };
};
