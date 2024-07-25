/* eslint-disable @typescript-eslint/no-unused-vars */
// todo eslint
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { LanguageData, ScriptData } from "@languagepicker/ethnolib";
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
import { ScriptCard } from "./ScriptCard";
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
import { CustomizeLanguageButton } from "./CustomizeLanguageButton";
import { useState } from "react";
import { CustomizeLanguageDialog } from "./CustomizeLanguageDialog";

function App() {
  const {
    languageDataTree,
    selectedLanguageNode,
    selectedScriptNode,
    languageDisplayName,
    currentTag,
    readyToSubmit,
    onSearchStringChange,
    toggleSelectNode,
    changeLanguageDisplayName,
    unSelectAll,
    setOptionalLangTagData,
  } = useLanguagePicker(bloomModifySearchResults);
  // languageDataTree is a list of the top level nodes. There is no root node

  const [customizeLanguageDialogOpen, setCustomizeLanguageDialogOpen] =
    useState(false);

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
                padding: 15px 15px 25px 25px;
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
                  scrollbar-width: thick;
                  flex-basis: 0;
                  flex-grow: 1;
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
                        onClick={() => toggleSelectNode(languageNode)}
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
                          isSelected={
                            languageNode.id === selectedLanguageNode?.id
                          }
                          colorWhenNotSelected={COLORS.white}
                          colorWhenSelected={COLORS.blues[0]}
                          // TODO
                          // onClickAway={() => {
                          // if (isSelectedNode(languageNode)) unSelectAll();
                          // }}
                        ></LanguageCard>
                      </CardActionArea>
                      {languageNode.id === selectedLanguageNode?.id &&
                        languageNode.childNodes.length > 1 && (
                          <List
                            css={css`
                              width: 100%;
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
                                      margin-right: 0;
                                      padding-right: 0;
                                      width: fit-content;
                                    `}
                                  >
                                    <CardActionArea
                                      onClick={() =>
                                        toggleSelectNode(scriptNode)
                                      }
                                    >
                                      <ScriptCard
                                        css={css`
                                          min-width: 175px;
                                        `}
                                        scriptData={
                                          scriptNode.nodeData as ScriptData
                                        }
                                        isSelected={
                                          scriptNode.id ===
                                          selectedScriptNode?.id
                                        }
                                        colorWhenNotSelected={COLORS.white}
                                        colorWhenSelected={COLORS.blues[1]}
                                        // TODO
                                        // onClickAway={() => {
                                        //   if (isSelectedNode(languageNode))
                                        //     unSelectAll();
                                        // }}
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
              <CardActionArea
                css={css`
                  width: fit-content;
                  margin-top: 20px;
                `}
                onClick={() => setCustomizeLanguageDialogOpen(true)}
              >
                <CustomizeLanguageButton
                  selectedLanguageNode={selectedLanguageNode}
                  selectedScriptNode={selectedScriptNode}
                  css={css`
                    min-width: 300px;
                  `}
                ></CustomizeLanguageButton>
              </CardActionArea>
            </div>
            <div
              id="right-pane"
              css={css`
                width: 50%;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                background-color: white;
                padding: 15px 25px 25px 15px;
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
                  value={languageDisplayName}
                  onChange={(e) => {
                    changeLanguageDisplayName(e.target.value);
                  }}
                />
              </div>
              <Typography
                css={css`
                  color: ${COLORS.greys[3]};
                  font-family: "Roboto Mono", monospace;
                `}
              >
                {currentTag}
              </Typography>
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
                  disabled={!readyToSubmit}
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

      <CustomizeLanguageDialog
        open={customizeLanguageDialogOpen}
        selectedLanguageNode={selectedLanguageNode}
        selectedScriptNode={selectedScriptNode}
        searchString={"TODO"}
        onClose={() => setCustomizeLanguageDialogOpen(false)}
        setOptionalLangTagData={setOptionalLangTagData}
      />
    </ThemeProvider>
  );
}

export default App;
