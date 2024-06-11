/* eslint-disable @typescript-eslint/no-unused-vars */
// todo eslint
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
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
import { ScriptData } from "./ScriptCard";

export type LanguageTreeNode = {
  nodeData: LanguageData | ScriptData;
  id: string;
  nodeGeneology: string[]; // the ids of the path to this node

  // its possible we want to enforce that the user always selects down to a leaf node,
  //  in which case this would be unneccessary and we could just check for the presence
  //  of children. But I think that's not the case and some choices will be optional/have fallbacks
  requiresFurtherSelection: boolean; 
  children: LanguageTreeNode[];
}


function App() {
  const [langSearchString, setLangSearchString] = useState("tok pisin");
  const [languageDataTree, setLanguageDataTree] = useState([]);
  const [selectedNodeGeneology, setSelectedNodeGeneology] = useState([]);

  function selectNode(nodeGeneology: string[]) : void {
    setSelectedNodeGeneology(nodeGeneology);
  }

  const canSubmit =
    !getNodeByGeneology(selectedNodeList)?.requiresFurtherSelection;
  
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
          <CardTree data={languageDataTree} selectedNodeGeneology={ selectedNodeGeneology } selectNode={ selectNode }></CardTree>
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

