/* eslint-disable @typescript-eslint/no-unused-vars */
// todo eslint
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { LanguageData } from "@languagepicker/ethnolib";
import { LanguageCard } from "./LanguageCard";
import {
  AppBar,
  Button,
  CardActionArea,
  Icon,
  InputAdornment,
  List,
  ListItem,
  OutlinedInput,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ScriptCard, ScriptData } from "./ScriptCard";
import { COLORS } from "./Colors";
import {
  LanguageTreeNode,
  NodeType,
  Status,
  useLanguagePicker,
} from "./useLanguagePicker";
import { debounce } from "lodash";
import "./styles.css";
import { bloomModifySearchResults } from "./modifySearchResults";

const testScriptData: ScriptData = {
  code: "TestScript",
};

function App() {
  const {
    languageDataTree,
    selectedNodeGeneology,
    status,
    onSearchStringChange,
    onSelectNode,
  } = useLanguagePicker(bloomModifySearchResults);
  // languageDataTree is a list of the top level nodes. There is no root node

  function isSelectedNode(node: LanguageTreeNode): boolean {
    return selectedNodeGeneology.includes(node.id);
  }
  const theme = createTheme({
    palette: {
      primary: {
        main: COLORS.blues[2],
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div
        // TODO this is just a placeholder background
        css={css`
          background-color: rgb(60, 60, 60);
          width: 100%;
          height: 100vh;
          padding: 17px;
        `}
      >
        <div
          id="lang-picker-container"
          css={css`
            width: 1500px;
            background-color: ${COLORS.greys[0]};
            border-radius: 10px;
            position: relative;
            margin-left: auto;
            margin-right: auto;
            overflow: hidden; // TODO otherwise things cover the rounded corners. Better way to fix?
          `}
        >
          <AppBar
            position="static"
            css={css`
              background-color: white;
              box-shadow: none;
              border-bottom: 2px solid ${COLORS.greys[1]};
            `}
          >
            <Toolbar
              disableGutters
              css={css`
                padding-left: 15px;
              `}
            >
              <Typography
                variant="h6"
                component="div"
                css={css`
                  color: black;
                  font-weight: bold;
                `}
              >
                Choose Language
              </Typography>
            </Toolbar>
          </AppBar>
          <div
            id="lang-picker-body"
            css={css`
              height: 750px;
              display: flex;
              padding: 15px 25px 25px 25px;
            `}
          >
            <div
              id="left-pane"
              css={css`
                width: 50%;
                height: 100%;
                position: relative;
                display: flex; // to make the language list overflow scroll work
                flex-direction: column;
                padding-right: 13px;
              `}
            >
              <label htmlFor="search-bar">
                <Typography
                  css={css`
                    color: ${COLORS.greys[3]};
                    font-weight: bold;
                    margin-bottom: 5px;
                  `}
                >
                  Search by name, code, or country
                </Typography>
              </label>
              <OutlinedInput
                type="text"
                css={css`
                  background-color: white;
                  margin-right: 0;
                  margin-bottom: 10px;
                `}
                endAdornment={
                  <InputAdornment
                    position="end"
                    css={css`
                      margin-right: 0;
                    `}
                  >
                    <Icon component={SearchIcon} />
                  </InputAdornment>
                }
                id="search-bar"
                // size="small"
                fullWidth
                onChange={(e) => {
                  debounce(async () => {
                    onSearchStringChange(e.target.value);
                  }, 0)();
                }}
              />
              <List
                css={css`
                  overflow-y: auto;
                `}
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
                    // <>
                    <ListItem
                      css={css`
                        margin-left: 0;
                        padding-left: 0;
                        flex-direction: column;
                      `}
                      key={languageNode.id}
                    >
                      <CardActionArea
                        onClick={() => onSelectNode(languageNode)}
                        // css={css`
                        //   width: 100%;
                        // `}
                      >
                        <LanguageCard
                          css={css`
                            width: 100%;
                          `}
                          languageCardData={
                            languageNode.nodeData as LanguageData
                          }
                          isSelected={isSelectedNode(languageNode)}
                          colorWhenNotSelected={COLORS.white}
                          colorWhenSelected={COLORS.blues[0]}
                        ></LanguageCard>
                      </CardActionArea>
                      {isSelectedNode(languageNode) &&
                        languageNode.childNodes.length > 1 && (
                          <List
                            css={css`
                              display: flex;
                              flex-direction: row;
                              justify-content: flex-end;
                              flex-wrap: wrap;
                              // TODO do we want to scroll? Or wrap?
                              padding-left: 30px;
                            `}
                          >
                            {languageNode.childNodes.map(
                              (scriptNode: LanguageTreeNode) => {
                                if (scriptNode.nodeType !== NodeType.Script) {
                                  // this shouldn't happen
                                  console.error(
                                    "unexpected node is not script: ",
                                    scriptNode.id
                                  );
                                  return <></>;
                                }
                                return (
                                  <ListItem
                                    key={scriptNode.id}
                                    css={css`
                                      // TODO move this to the card
                                      margin-left: 0;
                                      padding-left: 0;
                                      width: fit-content;
                                    `}
                                  >
                                    <CardActionArea
                                      onClick={() => onSelectNode(scriptNode)}
                                    >
                                      <ScriptCard
                                        css={css`
                                          min-width: 175px;
                                        `}
                                        scriptData={
                                          scriptNode.nodeData as ScriptData
                                        }
                                        isSelected={isSelectedNode(scriptNode)}
                                        colorWhenNotSelected={COLORS.white}
                                        colorWhenSelected={COLORS.blues[1]}
                                      />
                                    </CardActionArea>
                                  </ListItem>
                                );
                              }
                            )}
                          </List>
                        )}
                    </ListItem>

                    // </>
                  );
                })}
              </List>
            </div>
            <div
              id="right-pane"
              css={css`
                width: 50%;
                display: flex; // to make the language list overflow scroll work
                flex-direction: column;
                justify-content: flex-end;
                padding-left: 13px;
              `}
            >
              <div
                id="language-name-bar-container"
                css={css`
                  // padding: 10px 25px;
                  // width: 50%;
                  // height: 100%;
                  // position: relative;
                `}
              >
                <label htmlFor="language-name-bar">
                  <Typography
                    css={css`
                      color: ${COLORS.greys[3]};
                      font-weight: bold;
                    `}
                  >
                    Display this language this way
                  </Typography>
                </label>
                <OutlinedInput
                  type="text"
                  css={css`
                    background-color: white;
                    margin-right: 16px;
                    margin-bottom: 10px;
                  `}
                  id="language-name-bar"
                  fullWidth
                  onChange={(e) => {}}
                />
              </div>
              <div
                id="buttons-container"
                css={css`
                  // position: absolute;
                  width: 100%;
                  display: flex;
                  justify-content: flex-end;
                  padding-top: 15px;
                `}
              >
                <Button
                  css={css`
                    margin-left: auto;
                    margin-right: 10px;
                    min-width: 100px;
                  `}
                  variant="contained"
                  color="primary"
                  disabled={status !== Status.ReadyToSubmit}
                >
                  OK
                </Button>
                <Button
                  css={css`
                    min-width: 100px;
                  `}
                  variant="outlined"
                  color="primary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

// TODOs:

// southern uzbek shows up twice
// english name underneath the autonym

// fix the language name editor
// highlighting of match string
// fix trailing commas

// Special cases: English, no regions list, no script options
// french  - only show francais,
// make a field of top level search but not show?
// make a filter that does all the filtering. Filters out middle french, etc.

// langtag needs to show on the right side

// - performance issues with selecting  due to rerendering all the cards?
// - debounce - what to do (status)

// We could use sx instead of css?
// colored text of the text match

// x we need to make sure we can reopen the tree to a particular expansion state (e.g. language and script)
// x cut off country names after two lines, css rule to add an ellipsis (text overflow). Like as handled in bloom library (e.g. search bloom library covid english).
// x don't cut off alternative names. Pretty or balanced or something to wrap at a nice place
// This is a nice to have. colored text of the text match. If you have an exact match, don't highlight the similar matches. Otherwise hilight the closest matches
// check the language search of blorg to see how to debounce searching

// TODO jeni bister email - searching dialect names should pull up the language also
// maybe a "Variants include" field?
