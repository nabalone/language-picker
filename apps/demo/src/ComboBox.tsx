// based on https://www.downshift-js.com/use-combobox
/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO
import { css, cx } from "@emotion/css";
import { Box, FormLabel, Icon, Input, InputAdornment, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { useCombobox } from "downshift";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";


// TODO pull out the language search specific stuff and turn this into a generic combobox?
export const ComboBox: React.FunctionComponent<{
  getItems: (inputValue) => any[];
  itemToString: (item) => string;
  getListItemContent: (item) => React.ReactNode;
  setSelectedItem: (item) => void;
}> = (props) => {
  const [items, setItems] = React.useState<any[]>([]);
  const {
    inputValue,
    selectedItem,
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    getInputProps,
  } = useCombobox({
    items,
    onInputValueChange({inputValue}) {
        setItems(props.getItems(inputValue));
      },
      itemToString(item) {
        return props.itemToString(item);
      },
  });

  props.setSelectedItem(selectedItem);

  return (
    <Box>
      <Box className="w-72 flex flex-col gap-1">
        <FormLabel className="w-fit" {...getLabelProps()} css={css`color:black`}>
        <Typography>Search by name, code, or country</Typography>
        </FormLabel>
        <Box className="flex shadow-sm bg-white gap-0.5">
          {/* <Input
            placeholder="Tok Pisin" // TODO
            className="w-full p-1.5"
            {...getInputProps({ refKey: "inputRef" })} // TODO what is this refKey?
          /> */}
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
            ...getInputProps({ refKey: "inputRef" }) // TODO what is this refKey?
            }}
            id="search-bar"
            variant="filled"
            size="small"
            margin="normal"
            //  fullWidth
            // value={langSearchString}
            // onChange={(e) => setLangSearchString(e.target.value)}
          />
        </Box>
      </Box>
      <List
        className={cx(
          (!items.length) && "hidden",
          "!absolute bg-white w-72 shadow-md max-h-80 overflow-scroll"
        )}
        {...getMenuProps()}
      >
        {items.map((item, index) => {
            return (
              <ListItem
                // className={cx(
                //   highlightedIndex === index && "bg-blue-300",
                //   selectedItem === item && "font-bold",
                //   "py-2 px-3 shadow-sm"
                // )}
                key={item.id}
                {...getItemProps({
                  item,
                  index,
                })}
              >
                { props.getListItemContent(item) }
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
};
