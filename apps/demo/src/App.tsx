/* eslint-disable @typescript-eslint/no-unused-vars */
// todo eslint
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { LanguageData, searchForLanguage } from "@languagepicker/ethnolib";
import { LanguageCard } from "./LanguageCard";
import { CardTree } from "./CardTree";
import TextField from "@mui/material/TextField";
import {
  AppBar,
  Icon,
  InputAdornment,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ScriptCard, ScriptData } from "./ScriptCard";
import { ComboBox } from "./ComboBox";

enum NodeType {
  root = "root",
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
// TODO should the root be in the geneology?
function searchAndCreateTree(searchString: string): LanguageTreeNode {
  const rootId = "root";
  const root: LanguageTreeNode = {
    nodeData: null,
    id: rootId,
    nodeGeneology: [],
    nodeType: NodeType.root,
    requiresFurtherSelection: true,
    children: [],
  };
  const languageList = searchForLanguage(searchString);
  for (const language of languageList) {
    const languageNode: LanguageTreeNode = {
      nodeData: language,
      id: language.code,
      nodeGeneology: [language.code],
      nodeType: NodeType.Language,
      requiresFurtherSelection: true,
      children: [],
    };
    root.children.push(languageNode);
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
  }
  return root;
}

function App() {
  const [langSearchString, setLangSearchString] = useState("tok pisin");
  const [languageDataTree, setLanguageDataTree] = useState<LanguageTreeNode>();
  const [selectedNodeGeneology, setSelectedNodeGeneology] = useState<string[]>(
    []
  );

  function selectNode(node: LanguageTreeNode): void {
    //  TODO if there is no node, what should this do?
    if (node) {
      setSelectedNodeGeneology(node.nodeGeneology);
    }
  }

  function getNodeByGeneology(
    geneology: string[]
  ): LanguageTreeNode | undefined {
    if (!languageDataTree) {
      return undefined;
    }
    if (geneology.length === 0) {
      return languageDataTree.children[0];
    }
    let currentNode = languageDataTree.children[0];
    for (const id of geneology) {
      const nextNode = currentNode.children.find((child) => child.id === id);
      if (!nextNode) {
        return undefined;
      }
      currentNode = nextNode;
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
    palette: {
      primary: {
        light: "#E9EDFF",
        main: "#BAC5FF",
        dark: "#4D5DAF",
      },
      secondary: {
        light: "#F9F9F9",
        main: "#DADADA",
      },
    },
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
            background-color: ${theme.palette.secondary.light};
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
              margin-bottom: 30px;
            `}
          >
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Choose Language
              </Typography>
            </Toolbar>
          </AppBar>
          <ComboBox
            getItems={(inputValue) => searchAndCreateTree(inputValue).children}
            itemToString={(item) => item.id ?? "xxxx"}
            //  TODO
            setSelectedItem={selectNode}
            getListItemContent={(item) => {
              // const itemIsSelected = selectedNodeGeneology.includes(item.id);
              const itemIsSelected = true;
              return (
                <>
                  <LanguageCard
                    languageCardData={item.nodeData}
                    // childrenData={[]}
                    isSelected={true}
                    // isSelected={itemIsSelected}
                    // TODO colors
                    colorWhenNotSelected={theme.palette.primary.light}
                    colorWhenSelected={theme.palette.primary.dark}
                  ></LanguageCard>
                  {itemIsSelected &&
                    item.children.map((scriptNode: LanguageTreeNode) => {
                      return <ScriptCard 
                      scriptData={scriptNode.nodeData as ScriptData} 
                      isSelected={true}
                      // TODO colors
                      colorWhenNotSelected={theme.palette.secondary.light}
                      colorWhenSelected={theme.palette.secondary.dark}

                      />;
                    })}
                </>
              );
            }}
          ></ComboBox>
          <label htmlFor="search-bar">
            <Typography>Search by name, code, or country</Typography>
          </label>
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            // label="Search by name, code, or country"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Icon component={SearchIcon} />{" "}
                </InputAdornment>
              ),
            }}
            id="search-bar"
            variant="filled"
            size="small"
            margin="normal"
            //  fullWidth
            value={langSearchString}
            onChange={(e) => setLangSearchString(e.target.value)}
          />
          {/* <CardTree
            data={languageDataTree}
            selectedNodeGeneology={selectedNodeGeneology}
            selectNode={selectNode}
          ></CardTree> */}
        </div>
      </div>
    </ThemeProvider>
  );
}
// TODO set up autoformating, why is it not working

export default App;

// TODOs:
// Why am I making trees from scratch?
// - make the scripts show and hide
// - attempt to make an alternate implementation
// colored text of the text match
// how does sx work?

// we need to make sure we can reopen the tree to a particular expansion state (e.g. language and script)
// - cut off country names after two lines, css rule to add an ellipsis (text overflow). Like as handled in bloom library (e.g. search bloom library covid english).
// - don't cut off alternative names. Pretty or balanced or something to wrap at a nice place
// This is a nice to have. colored text of the text match. If you have an exact match, don't highlight the similar matches. Otherwise hilight the closest matches
// how does sx work?
// check the language search of blorg to see how to debounce searching

// Who should own the languageDataTree state? the CardTree? and then when we setCanSubmit, we need to make sure not to rerender card tree, annoying
// if app owns languageDataTree, then we setLanguageDataCardTree and then the whole thing rerenders,

// IF we just use state for the whole thing, does the whole thing rerender each time anyway? I feel like toggle should be simpler...
