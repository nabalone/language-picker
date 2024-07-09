/* eslint-disable @typescript-eslint/no-unused-vars */
// todo eslint
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { LanguageData } from "@languagepicker/ethnolib";
import { LanguageCard } from "./LanguageCard";
import {
  AppBar,
  Button,
  Icon,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
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
  } = useLanguagePicker();
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
            width: 1250px;
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
            `}
          >
            <div
              id="left-pane"
              css={css`
                padding: 10px 25px;
                width: 50%;
                height: 100%;
                position: relative;
                display: flex; // to make the language list overflow scroll work
                flex-direction: column;
              `}
            >
              <label htmlFor="search-bar">
                <Typography
                  css={css`
                    color: ${COLORS.greys[3]};
                    font-weight: bold;
                    margin-bottom: 10px;
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
                      <ListItemButton
                        onClick={() => onSelectNode(languageNode)}
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
                      </ListItemButton>
                      {isSelectedNode(languageNode) && (
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
                          <ListItem
                            key={"a"}
                            css={css`
                              margin-left: 0;
                              padding-left: 0;
                              width: fit-content;
                            `}
                          >
                            <ScriptCard
                              css={css`
                                min-width: 175px;
                              `}
                              scriptData={testScriptData as ScriptData}
                              isSelected={false}
                              colorWhenNotSelected={COLORS.white}
                              colorWhenSelected={COLORS.blues[1]}
                            />
                          </ListItem>{" "}
                          <ListItem
                            key={"c"}
                            css={css`
                              margin-left: 0;
                              padding-left: 0;
                              width: fit-content;
                            `}
                          >
                            <ScriptCard
                              css={css`
                                min-width: 175px;
                              `}
                              scriptData={testScriptData as ScriptData}
                              isSelected={false}
                              colorWhenNotSelected={COLORS.white}
                              colorWhenSelected={COLORS.blues[1]}
                            />
                          </ListItem>{" "}
                          <ListItem
                            key={"b"}
                            css={css`
                              margin-left: 0;
                              padding-left: 0;
                              width: fit-content;
                            `}
                          >
                            <ScriptCard
                              css={css`
                                min-width: 175px;
                              `}
                              scriptData={testScriptData as ScriptData}
                              isSelected={false}
                              colorWhenNotSelected={COLORS.white}
                              colorWhenSelected={COLORS.blues[1]}
                            />
                          </ListItem>
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
                                  onClick={() => onSelectNode(scriptNode)}
                                  css={css`
                                    margin-left: 0;
                                    padding-left: 0;
                                    width: fit-content;
                                  `}
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
                                  {/* </ListItemButton> */}
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
          </div>
          <div
            id="buttons-container"
            css={css`
              position: absolute;
              width: fit-content;
              right: 0;
              bottom: 0;
              padding: 25px;
            `}
          >
            <Button
              css={css`
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
    </ThemeProvider>
  );
}

export default App;

// TODOs:
// - performance issues with selecting  due to rerendering all the cards?
// - debounce - what to do (status)
// - fix the index - language results querying
// - what to do about margin under the search bar?

// We could use sx instead of css?
// colored text of the text match

// x we need to make sure we can reopen the tree to a particular expansion state (e.g. language and script)
// x cut off country names after two lines, css rule to add an ellipsis (text overflow). Like as handled in bloom library (e.g. search bloom library covid english).
// x don't cut off alternative names. Pretty or balanced or something to wrap at a nice place
// This is a nice to have. colored text of the text match. If you have an exact match, don't highlight the similar matches. Otherwise hilight the closest matches
// check the language search of blorg to see how to debounce searching

// TODO jeni bister email - searching dialect names should pull up the language also
// maybe a "Variants include" field?
