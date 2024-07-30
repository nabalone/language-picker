import {
  LanguageData,
  ScriptData,
  searchForLanguage,
} from "@languagepicker/ethnolib";
import { useState } from "react";
import { stripDemarcation, stripResultMetadata } from "./searchResultModifiers";
import { FuseResult } from "fuse.js";

export enum NodeType {
  Language = "language",
  Script = "script",
}

export type OptionNode = {
  nodeData: LanguageData | ScriptData | null;
  id: string;
  nodeType: NodeType;
  childNodes: OptionNode[]; // In a language node, this will have all the relevant scripts as nodes
};

// TODO optional vs undefined
export type CustomizableLanguageDetails = {
  displayName?: string;
  scriptOverride?: ScriptData;
  region?: string;
  dialect?: string;
};

export const UNLISTED_LANGUAGE_NODE_ID = "unlisted-language";
const UNLISTED_LANGUAGE_NODE = {
  nodeData: {
    code: "qaa",
    autonym: undefined,
    exonym: "Unknown Lanuage",
    regionNames: "",
    regionCodes: [],
    scripts: [],
    alternativeTags: [],
    names: "",
  } as LanguageData,
  id: UNLISTED_LANGUAGE_NODE_ID,
  nodeType: NodeType.Language,
  childNodes: [],
} as OptionNode;
const SCRIPT_OVERRIDE_NODE_ID = "script-override";

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
  // TODO watch out for null script override case
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

// We show the unlisted language controls unles a language is selected
export function showUnlistedLanguageControls(
  selectedLanguageNode: OptionNode | undefined
) {
  return (
    selectedLanguageNode === undefined ||
    selectedLanguageNode.id === UNLISTED_LANGUAGE_NODE_ID
  );
}
export const useLanguagePicker = (
  searchResultModifier?: (
    results: FuseResult<LanguageData>[],
    searchString: string
  ) => LanguageData[]
) => {
  const [languageDataTree, setLanguageDataTree] = useState([] as OptionNode[]);
  const [selectedLanguageNode, setSelectedLanguageNode] = useState<
    OptionNode | undefined
  >();
  const [selectedScriptNode, setSelectedScriptNode] = useState<
    OptionNode | undefined
  >();
  const [CustomizableLanguageDetails, setCustomizableLanguageDetails] =
    useState<CustomizableLanguageDetails>({
      displayName: "",
      scriptOverride: undefined,
      region: "",
      dialect: "",
    });

  const isReadyToSubmit =
    !!selectedLanguageNode &&
    (!!selectedScriptNode || selectedLanguageNode.childNodes?.length === 0);
  // TODO  selecting langs with no scripts
  // TODO rename childNodes to scripts?

  const onSearchStringChange = (searchString: string) => {
    setLanguageDataTree([]);
    setSelectedLanguageNode(undefined);
    setSelectedScriptNode(undefined);
    setCustomizableLanguageDetails({});
    if (searchString.length > 1) {
      // the query for one character is slow and probably not useful
      doSearchAndUpdate(searchString, searchResultModifier);
    }
  };

  // details should only include the properties it wants to modify
  // TODO test behavior with undefineds
  const saveCustomizableLanguageDetails = (
    details: CustomizableLanguageDetails
  ) => {
    // first check if the script override really is an override
    if (details.scriptOverride) {
      for (const scriptNode of selectedLanguageNode?.childNodes || []) {
        if (
          stripDemarcation(scriptNode.id) ===
          stripDemarcation(details.scriptOverride?.code || "")
        ) {
          // This script is a normal script choice for this language.
          // Select the script card instead of treating it as an override.
          setSelectedScriptNode(scriptNode);
          details.scriptOverride = undefined;
          break;
        }
      }
    }
    // If there really is a script override (we didn't clear it in the last block)
    if (details.scriptOverride) {
      setSelectedScriptNode({
        nodeData: details.scriptOverride,
        id: SCRIPT_OVERRIDE_NODE_ID,
        nodeType: NodeType.Script,
        childNodes: [],
      });
    }
    const updatedDetails = { ...CustomizableLanguageDetails, ...details };
    setCustomizableLanguageDetails(updatedDetails);
  };

  // TODO should this still be async?
  async function doSearchAndUpdate(
    searchString: string,
    searchResultModifier?: (
      results: FuseResult<LanguageData>[],
      searchString: string
    ) => LanguageData[]
  ) {
    const searchResults = searchForLanguage(searchString);
    let languageList: LanguageData[];
    if (searchResultModifier) {
      languageList = searchResultModifier(searchResults, searchString);
    } else {
      // fuse leaves some metadata in the results which search result modifiers might use
      languageList = stripResultMetadata(searchResults);
    }
    const languageDataTree = languageList.map((language) => {
      const languageNode: OptionNode = {
        nodeData: language,
        id: stripDemarcation(language.code),
        // TODO we should not be calling stripDemarcation again on ids
        nodeType: NodeType.Language,
        childNodes: [],
      };

      const scriptNodes = language.scripts.map((script) => {
        return {
          nodeData: script,
          id: script.code,
          nodeType: NodeType.Script,
          childNodes: [],
        } as OptionNode;
      });

      languageNode.childNodes = scriptNodes;
      return languageNode;
    });

    setLanguageDataTree(languageDataTree);
    setSelectedLanguageNode(undefined);
    setSelectedScriptNode(undefined);
    setCustomizableLanguageDetails({});
  }

  const toggleSelectNode = (node: OptionNode) => {
    if (!node) {
      console.error("no node selected");
      return;
    } else if (node.nodeType === NodeType.Language) {
      if (node.id === selectedLanguageNode?.id) {
        // Clicking on the selected language node unselects it and clears data specific to that language
        setSelectedLanguageNode(undefined);
        setSelectedScriptNode(undefined);
        setCustomizableLanguageDetails({});
        return;
      } else {
        setSelectedLanguageNode(node);
        setSelectedScriptNode(
          node.childNodes.length == 1 ? node.childNodes[0] : undefined
        );
        setCustomizableLanguageDetails({
          displayName: stripDemarcation(
            node.nodeData?.autonym || node.nodeData?.exonym || ""
          ),
        } as CustomizableLanguageDetails);
        return;
      }
    } else if (node.nodeType === NodeType.Script) {
      if (node.id === selectedScriptNode?.id) {
        // clicking on the selected script node unselects it
        setSelectedScriptNode(undefined);
        return;
      } else if (node.nodeType === NodeType.Script) {
        setSelectedScriptNode(node);
      }
    }
  };

  const selectUnlistedLanguage = () => {
    setSelectedLanguageNode(UNLISTED_LANGUAGE_NODE);
    setSelectedScriptNode(undefined);
    setCustomizableLanguageDetails({});
  };

  return {
    languageDataTree,
    selectedLanguageNode,
    selectedScriptNode,
    CustomizableLanguageDetails,
    onSearchStringChange,
    toggleSelectNode,
    isReadyToSubmit,
    saveCustomizableLanguageDetails,
    selectUnlistedLanguage,
  };
};
