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
  OutlinedInput,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ScriptCard, ScriptData } from "./ScriptCard";
import { cx } from "@emotion/css";
import { COLORS } from "./Colors";
import {
  LanguageTreeNode,
  NodeType,
  Status,
  useLanguagePicker,
} from "./useLanguagePicker";

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
    // TODO theme?
  });

  return (
    <ThemeProvider
      theme={theme}
      //  TODO is this the right place to put global styles?
    >
      <div
        css={css`
          position: sticky;
          // TODO why does this not work
          top: 30px;
          background-color: rgb(60, 60, 60);
          width: 100%;
          height: 100vh;
          padding: 10px;

          // TODO put this somewhere better
          // see https://mui.com/material-ui/react-css-baseline/
          // TODO does this upset mui too much?
          box-sizing: border-box;
          *,
          *:before,
          *:after {
            box-sizing: inherit;
          }
        `}
      >
        <div
          id="lang-picker-container"
          css={css`
            width: 1000px;
            background-color: ${COLORS.greys[0]};
            border-radius: 10px;
            position: relative;
            margin-left: auto;
            margin-right: auto;
            overflow: hidden;
            // TODO otherwise things cover the rounded corners. Better way to fix?
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
                // Todo why does this not work
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
                position: relative; // TODO is this necessary?
                display: flex;
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
                `}
                // TODO why is the icon not all the way to the right?

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
                  setTimeout(() => {
                    onSearchStringChange(e.target.value);
                  }, 200); // debounce TODO do we even want this here though?
                }}
              />
              <List
                css={css`
                  overflow-y: auto;
                `}
                className={cx(
                  !languageDataTree.length && "hidden",
                  "!absolute bg-white w-72 shadow-md max-h-80"
                )}
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
                        css={css`
                          margin-left: 0;
                          padding-left: 0;
                        `}
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
                            // TODO should this be another list?
                            return (
                              <ListItem
                                key={scriptNode.id}
                                onClick={() => onSelectNode(scriptNode)}
                                css={css`
                                  margin-left: 0;
                                  padding-left: 0;
                                `}
                              >
                                <ScriptCard
                                  css={css`
                                    min-width: 175px;
                                  `}
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
          <div
            id="buttons-container"
            css={css`
              // TODO should flebox these instead
              position: absolute;
              width: fit-content;
              right: 0;
              bottom: 0;
              padding: 25px;
              // display: flex;
            `}
          >
            <Button
              css={css`
                margin-right: 10px;
                min-width: 100px;
              `}
              variant="contained"
              color="primary"
              //  color={COLORS.blues[0]} TODO
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
// - debounce (status)
// - fix the index - language results querying
// - fix styling

// how does sx work?
// Why am I making trees from scratch?
// colored text of the text match

// x we need to make sure we can reopen the tree to a particular expansion state (e.g. language and script)
// x cut off country names after two lines, css rule to add an ellipsis (text overflow). Like as handled in bloom library (e.g. search bloom library covid english).
// x don't cut off alternative names. Pretty or balanced or something to wrap at a nice place
// This is a nice to have. colored text of the text match. If you have an exact match, don't highlight the similar matches. Otherwise hilight the closest matches
// how does sx work?
// check the language search of blorg to see how to debounce searching

// TODO jeni bister email - searching dialect names should pull up the language also
// maybe a "Variants include" field?
