/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { searchForLanguage } from "@languagepicker/ethnolib";
import { LanguageCard } from "./LanguageCard";
import { CardTree } from "./CardTree";
import TextField from "@mui/material/TextField";
import { AppBar, Icon, InputAdornment, ThemeProvider, Toolbar, Typography, createTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function App() {
  const [langSearchString, setLangSearchString] = useState("tok pisin");

  const theme = createTheme({
    palette: {
      primary: {
        light: "#E9EDFF",
        main: "#BAC5FF",
        dark: "#4D5DAF"

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
          background-color: ${ theme.palette.secondary.light };
          border-radius: 10px;
          position: relative;
          margin-left: auto;
          margin-right: auto;
        `}
      >
              <AppBar position="static" css={css`background-color: white; margin-bottom: 30px;`}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Choose Language
          </Typography>
        </Toolbar>
      </AppBar>
        <label htmlFor="search-bar"><Typography>Search by name, code, or country</Typography></label>
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
        <CardTree data={searchForLanguage(langSearchString)}></CardTree>
      </div>
    </div>
    </ThemeProvider>
  );
}
// TODO set up autoformating, why is it not working

export default App;


// TODOs:
// - make the scripts show and hide
// - attempt to make an alternate implementation
// colored text of the text match
// how does sx work?