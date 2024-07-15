import { LanguageData, searchForLanguage } from "@languagepicker/ethnolib";
import { useState } from "react";
import { ScriptData } from "./ScriptCard";

export enum NodeType {
  Language = "language",
  Script = "script",
}

export enum Status {
  Loading = "loading",
  ReadyToSubmit = "readyToSubmit",
  MoreSelectionNeeded = "moreSelectionNeeded",
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

interface LanguagePickerState {
  languageDataTree: LanguageTreeNode[];
  selectedNodeGeneology: string[];
  status: Status;
  languageDisplayName: string;
  // currentlyProcessingTimeoutId: number | undefined;
}

function getNodesInGeneology(
  geneology: string[],
  languageDataTree: LanguageTreeNode[]
): LanguageTreeNode[] {
  const nodesInGeneology = [] as LanguageTreeNode[];

  let currentNodeList = languageDataTree;
  for (const id of geneology) {
    const currentNode = currentNodeList.find((node) => node.id === id);
    if (!currentNode) {
      return nodesInGeneology;
    }
    nodesInGeneology.push(currentNode);
    currentNodeList = currentNode.childNodes;
  }
  return nodesInGeneology;
}

function getNodeByGeneology(
  geneology: string[],
  languageDataTree: LanguageTreeNode[]
): LanguageTreeNode | undefined {
  const nodesInGeneology = getNodesInGeneology(geneology, languageDataTree);
  return nodesInGeneology && nodesInGeneology[nodesInGeneology.length - 1];
}

function readyToSubmit(state: LanguagePickerState) {
  const node = getNodeByGeneology(
    state.selectedNodeGeneology,
    state.languageDataTree
  );
  return node && !node.requiresFurtherSelection;
}

export const useLanguagePicker = (
  modifySearchResults?: (results: LanguageData[]) => LanguageData[]
) => {
  const [state, setState] = useState({
    languageDataTree: [] as LanguageTreeNode[],
    selectedNodeGeneology: [] as string[],
    status: Status.MoreSelectionNeeded,
    languageDisplayName: "",
    // currentlyProcessingTimeoutId: undefined as number | undefined, // TODO what is the default number?
  } as LanguagePickerState);

  const onSearchStringChange = (searchString: string) => {
    // if (state.currentlyProcessingTimeoutId) {
    //   clearTimeout(state.currentlyProcessingTimeoutId);
    // }
    setState({
      ...state,
      languageDataTree: [],
      selectedNodeGeneology: [],
      status: Status.Loading,
      //   currentlyProcessingTimeoutId: setTimeout(() => {
      //     doSearchAndUpdate(searchString);
      //   }),
    } as LanguagePickerState);
    // setTimeout(() => {
    doSearchAndUpdate(searchString, modifySearchResults);
    // });
  };

  async function doSearchAndUpdate(
    searchString: string,
    modifySearchResults?: (results: LanguageData[]) => LanguageData[]
  ) {
    let languageList = searchForLanguage(searchString);
    if (modifySearchResults) {
      languageList = modifySearchResults(languageList);
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
        const scriptData = {
          code: script,
        } as ScriptData;
        return {
          nodeData: scriptData,
          id: script,
          nodeGeneology: [language.code, script],
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
      selectedNodeGeneology: [] as string[],
      status: Status.MoreSelectionNeeded,
      languageDisplayName: "",
      //   currentlyProcessingTimeoutId: undefined,
    } as LanguagePickerState);
  }

  const onSelectNode = (node: LanguageTreeNode) => {
    if (node) {
      setState({
        ...state,
        selectedNodeGeneology: node.nodeGeneology,
        languageDisplayName:
          node.nodeType === NodeType.Language
            ? node.nodeData?.autonym || ""
            : state.languageDisplayName,
      });
    } else {
      console.error("no node selected");
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
    selectedNodeGeneology: state.selectedNodeGeneology,
    languageDisplayName: state.languageDisplayName,
    status: readyToSubmit(state)
      ? Status.ReadyToSubmit
      : Status.MoreSelectionNeeded,
    onSearchStringChange,
    onSelectNode,
    changeLanguageDisplayName,
  };
};
