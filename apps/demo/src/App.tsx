/* eslint-disable @typescript-eslint/no-unused-vars */
// todo eslint
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { LanguageData, searchForLanguage } from "@languagepicker/ethnolib";
import { LanguageCard } from "./LanguageCard";
import TextField from "@mui/material/TextField";
import {
  AppBar,
  Icon,
  InputAdornment,
  List,
  ListItem,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ScriptCard, ScriptData } from "./ScriptCard";
import { useCombobox } from "downshift";
import { cx } from "@emotion/css";
import React from "react";
import { COLORS } from "./Colors";

enum NodeType {
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
  //  of children. But I think that's not the case and some choices will be optional/have fallbacks
  requiresFurtherSelection: boolean;
  children: LanguageTreeNode[];
};

// TODO casing?
// TODO what if no results?
function searchAndCreateTree(searchString: string): LanguageTreeNode[] {
  const languageList = searchForLanguage(searchString);
  const languageNodes = languageList.map((language) => {
    const languageNode: LanguageTreeNode = {
      nodeData: language,
      id: language.code,
      nodeGeneology: [language.code],
      nodeType: NodeType.Language,
      requiresFurtherSelection: true,
      children: [],
    };
    const scriptNodes = language.scripts?.map((script) => {
      const scriptData = {
        code: script,
      } as ScriptData;
      return {
        nodeData: scriptData,
        id: script,
        nodeGeneology: [language.code, script],
        nodeType: NodeType.Script,
        requiresFurtherSelection: false,
        children: [],
      } as LanguageTreeNode;
    });
    languageNode.children = scriptNodes;
    return languageNode;
  });
  return languageNodes;
}

const testScriptNode: LanguageTreeNode = {
  children: [],
  id: "testId",
  nodeData: { code: "Brai" },
  nodeGeneology: ["tpi-Brai", "Brai"],
  nodeType: NodeType.Script,
  requiresFurtherSelection: false,
};

// children: Array [ {…} ]
// id: "tpi-Brai"
// ​
// nodeData: Object { autonym: "Tok Pisin", code: "tpi-Brai", regions: (1) […], … }
// ​
// nodeGeneology: Array [ "tpi-Brai" ]
// ​
// nodeType: "language"
// ​
// requiresFurtherSelection: true
// Put all of the above properties into the testLangNode below
const testLangNode: LanguageTreeNode = {
  children: [testScriptNode],
  id: "tpi-Brai",
  nodeData: {
    autonym: "Tok Pisin",
    code: "tpi-Brai",
    regions: ["Papua New Guinea"],
    names: ["Tok Pisin"],
  },
  nodeGeneology: ["tpi-Brai"],
  nodeType: NodeType.Language,
  requiresFurtherSelection: true,
};

function App() {
  const [langSearchString, setLangSearchString] = useState("tok pisin");
  const [languageDataTree, setLanguageDataTree] = useState<LanguageTreeNode[]>(
    []
  ); // This is a list of the top level nodes. There is no root node
  const [selectedNodeGeneology, setSelectedNodeGeneology] = useState<string[]>(
    []
  );

  const stateReducer = React.useCallback((state, actionAndChanges) => {
    const { type, changes } = actionAndChanges;
    switch (type) {
      case useCombobox.stateChangeTypes.InputChange: {
        setSelectedNodeGeneology([]); // unselect everything
        return {
          // return normal changes.
          ...changes,
          items: searchAndCreateTree(changes.inputValue),
        };
      }
      case useCombobox.stateChangeTypes.ItemClick:
      case useCombobox.stateChangeTypes.InputKeyDownEnter: {
        console.log("selectedItem", changes.selectedItem);
        selectNode(changes.selectedItem);
        return state; //Discard all the other proposed changes
      }
      default:
        return changes; // otherwise business as usual.
    }
  }, []);

  const combobox = useCombobox({
    items: [testLangNode, ...languageDataTree],
    onInputValueChange({ inputValue }) {
      setLanguageDataTree(searchAndCreateTree(inputValue));
    },
    stateReducer,
  });

  function selectNode(node: LanguageTreeNode): void {
    //  TODO if there is no node, what should this do?
    if (node) {
      setSelectedNodeGeneology(node.nodeGeneology);
    } else {
      console.error("no node selected");
    }
  }

  function isSelectedNode(node: LanguageTreeNode): boolean {
    return selectedNodeGeneology.includes(node.id);
  }

  function getNodeByGeneology(
    geneology: string[]
  ): LanguageTreeNode | undefined {
    // to make typescript happy
    if (
      !languageDataTree ||
      languageDataTree.length == 0 ||
      !geneology ||
      geneology?.length
    ) {
      return undefined;
    }

    let currentNodeList = languageDataTree;
    let currentNode = undefined;
    for (const id of geneology) {
      currentNode = currentNodeList.find((node) => node.id === id);
      if (!currentNode) {
        return undefined;
      }
      currentNodeList = currentNode.children;
    }
    return currentNode;
  }

  const canSubmit = !getNodeByGeneology(selectedNodeGeneology)
    ?.requiresFurtherSelection;

  useEffect(() => {
    setLanguageDataTree(searchAndCreateTree(langSearchString));
  }, [langSearchString]); // TODO is this the correct use of useEffect? I'm pretty sure there's a better way. Populate only on [], and then call a method after a delay?
  // TODO set up a time delay so typing doesn't immediately trigger it
  const theme = createTheme({
    // TODO theme?
  });

  return (
    <ThemeProvider theme={theme}>
      <div
        css={css`
          position: sticky;
          // TODO why does this not work
          top: 30px;
          background-color: rgb(60, 60, 60);
          width: 100%;
          height: 100vh;
          padding: 10px;
        `}
      >
        <div
          css={css`
            width: 1000px;
            height: 1000px;
            background-color: ${COLORS.greys[0]};
            border-radius: 10px;
            position: relative;
            margin-left: auto;
            margin-right: auto;
          `}
        >
          <AppBar
            position="static"
            css={css`
              background-color: white;
              // margin-bottom: 30px;
            `}
          >
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Choose Language
              </Typography>
            </Toolbar>
          </AppBar>
          <div
            id="left-pane"
            css={css`
              padding: 10px;
              width: 50%;
            `}
          >
            <label htmlFor="search-bar">
              <Typography>Search by name, code, or country</Typography>
            </label>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <Icon component={SearchIcon} />{" "}
                  </InputAdornment>
                ),
                ...combobox.getInputProps({ refKey: "inputRef" }), // TODO what is this refKey?
              }}
              id="search-bar"
              variant="filled"
              size="small"
              margin="normal"
              //  fullWidth
              // value={langSearchString}
              // onChange={(e) => setLangSearchString(e.target.value)}
            />
            {/* TODO move this to a new component? */}
            <List
              className={cx(
                !languageDataTree.length && "hidden",
                "!absolute bg-white w-72 shadow-md max-h-80 overflow-scroll"
              )}
              {...combobox.getMenuProps()}
            >
              {languageDataTree.map((languageNode) => {
                if (languageNode.nodeType !== NodeType.Language) {
                  console.error(
                    "unexpected node is not language node: ",
                    languageNode.id
                  );
                  return <></>;
                }
                return (
                  <>
                    <ListItem
                      // TODO
                      // className={cx(
                      //   highlightedIndex === index && "bg-blue-300",
                      //   selectedItem === item && "font-bold",
                      //   "py-2 px-3 shadow-sm"
                      // )}
                      key={languageNode.id}
                      {...combobox.getItemProps({
                        item: languageNode,
                      })}
                      css={css`
                        margin-left: 0;
                        padding-left: 0;
                      `}
                    >
                      <LanguageCard
                        languageCardData={languageNode.nodeData as LanguageData}
                        isSelected={isSelectedNode(languageNode)}
                        colorWhenNotSelected={COLORS.white}
                        colorWhenSelected={COLORS.blues[0]}
                      ></LanguageCard>
                    </ListItem>
                    {isSelectedNode(languageNode) &&
                      languageNode.children.map(
                        // TODO rename "children"
                        (scriptNode: LanguageTreeNode) => {
                          if (scriptNode.nodeType !== NodeType.Script) {
                            // this shouldn't happen
                            console.error(
                              "unexpected node is not script: ",
                              scriptNode.id
                            );
                            return <></>;
                          }
                          console.log("scriptNode", scriptNode);
                          return (
                            <ListItem
                              key={scriptNode.id}
                              {...combobox.getItemProps({
                                // item: scriptNode,
                                item: testLangNode,
                                // item: testScriptNode,
                              })}
                              css={css`
                                margin-left: 0;
                                padding-left: 0;
                              `}
                            >
                              <ScriptCard
                                scriptData={scriptNode.nodeData as ScriptData}
                                isSelected={isSelectedNode(scriptNode)}
                                colorWhenNotSelected={COLORS.white}
                                colorWhenSelected={COLORS.blues[1]}
                              />
                            </ListItem>
                          );
                        }
                      )}
                    {/* </List> */}
                  </>
                );
              })}
            </List>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

// TODOs:
// - make selecting script nodes work
// - work on moving toward headless
// - why is the header broken?
// - make submit button
// - why can't i get onInputValueChange into the statereducer?
// - fix index and index2
// - fix refkey
// - fix the index - language results querying
// - fix styling

// how does sx work?
// Why am I making trees from scratch?
// colored text of the text match

// we need to make sure we can reopen the tree to a particular expansion state (e.g. language and script)
// - cut off country names after two lines, css rule to add an ellipsis (text overflow). Like as handled in bloom library (e.g. search bloom library covid english).
// - don't cut off alternative names. Pretty or balanced or something to wrap at a nice place
// This is a nice to have. colored text of the text match. If you have an exact match, don't highlight the similar matches. Otherwise hilight the closest matches
// how does sx work?
// check the language search of blorg to see how to debounce searching

// TODO jeni bister email - searching dialect names should pull up the language also
// maybe a "Variants include" field?
