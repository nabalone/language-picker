import * as React from "react";
import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import {
  CustomizableLanguageDetails,
  OptionNode,
  createTag,
  showUnlistedLanguageControls,
} from "./useLanguagePicker";
import {
  Autocomplete,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { EthnolibTextInput } from "./EthnolibTextInput";
import iso3166 from "iso-3166-1";
import { iso15924 } from "iso-15924";
import { COLORS } from "./Colors";
import { ScriptData } from "@languagepicker/ethnolib";

function getAllRegionOptions() {
  // TODO Congo is duplicated in this list for some reason
  return iso3166.all().map((region) => {
    return {
      label: region.country,
      id: region.alpha2,
    };
  });
}

function getAllScriptOptions() {
  return iso15924.map((script) => {
    return {
      label: script.name,
      id: script.code,
    };
  });
}

export const CustomizeLanguageDialog: React.FunctionComponent<{
  open: boolean;
  selectedLanguageNode: OptionNode | undefined;
  selectedScriptNode: OptionNode | undefined;
  customizableLanguageDetails: CustomizableLanguageDetails;
  saveCustomizableLanguageDetails: (
    details: CustomizableLanguageDetails
  ) => void;
  selectUnlistedLanguage: () => void;
  searchString: string;
  onClose: () => void;
}> = (props) => {
  const isUnlistedLanguageDialog = showUnlistedLanguageControls(
    props.selectedLanguageNode
  );

  // TODO replace all the { label: "", id: "" } with something else? just don't make uncontrolled inputs
  const autocompleteOptionPlaceholder = { label: "", id: "" };

  // Store dialog state. Used to create a tag preview just inside the dialog, before saving anything
  // but these should not persist when the dialog is closed
  const [dialogSelectedScript, setDialogSelectedScriptCode] = React.useState<{
    label: string;
    id: string;
  }>(autocompleteOptionPlaceholder); // Will be set by the useEffect below
  const [dialogSelectedRegion, setDialogSelectedRegionCode] = React.useState<{
    label: string;
    id: string;
  }>(autocompleteOptionPlaceholder); // Will be set by the useEffect below
  const [dialogSelectedDialect, setDialogSelectedDialectCode] =
    React.useState<string>(""); // Will be set by the useEffect below
  React.useEffect(() => {
    setDialogSelectedScriptCode(
      props.selectedScriptNode?.nodeData?.code
        ? {
            label: props.selectedScriptNode.nodeData.name,
            id: props.selectedScriptNode.nodeData.code,
          }
        : autocompleteOptionPlaceholder
    );
    setDialogSelectedRegionCode(
      props.customizableLanguageDetails.region?.code
        ? {
            label: props.customizableLanguageDetails.region.name,
            id: props.customizableLanguageDetails.region.code,
          }
        : autocompleteOptionPlaceholder
    );
    setDialogSelectedDialectCode(
      // if the user has not selected any language, not even the unlisted language button, then
      // there will be no language details and we suggest the search string as a
      // starting point for the unlisted language name (which is actually stored in the dialect field)
      props.selectedLanguageNode
        ? props.customizableLanguageDetails.dialect || ""
        : props.searchString
    );
  }, [
    // TODO would it be better to make this just props?
    props.selectedScriptNode,
    props.open,
    props.selectedLanguageNode,
    props.customizableLanguageDetails.dialect,
    props.searchString,
  ]);

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      css={css`
        padding: 25px;
      `}
    >
      <DialogTitle>
        {isUnlistedLanguageDialog
          ? "Unlisted Language Tag"
          : "Custom Language Tag"}
      </DialogTitle>

      {isUnlistedLanguageDialog && (
        <DialogContent>
          <EthnolibTextInput
            id="unlisted-lang-name-field"
            label="Name"
            value={dialogSelectedDialect}
            onChange={(event) => {
              setDialogSelectedDialectCode(event.target.value);
            }}
          />
          <Typography>
            Tag:
            <span
              css={css`
                font-weight: bold;
              `}
            >{`qaa-x-${props.searchString}`}</span>
          </Typography>
        </DialogContent>
      )}

      {!isUnlistedLanguageDialog && (
        <DialogContent>
          {/* TODO make these fuzzy search */}
          <label htmlFor="customize-script-field">
            <Typography
              css={css`
                color: ${COLORS.greys[3]};
                font-weight: bold;
                margin-bottom: 5px;
              `}
            >
              Script
            </Typography>
          </label>
          <Autocomplete
            value={dialogSelectedScript}
            onChange={(
              event,
              newValue: { label: string; id: string } | null
            ) => {
              setDialogSelectedScriptCode(newValue);
            }}
            disablePortal
            id="combo-box-demo"
            options={getAllScriptOptions()}
            // sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} id="customize-script-field" />
            )}
          />
          <label htmlFor="customize-region-field">
            <Typography
              css={css`
                color: ${COLORS.greys[3]};
                font-weight: bold;
                margin-bottom: 5px;
              `}
            >
              Region
            </Typography>
          </label>
          <Autocomplete
            value={dialogSelectedRegion}
            onChange={(
              event,
              newValue: { label: string; id: string } | null
            ) => {
              setDialogSelectedRegionCode(newValue);
            }}
            disablePortal
            id="combo-box-demo"
            options={getAllRegionOptions()}
            renderInput={(params) => (
              <TextField {...params} id="customize-region-field" />
            )}
          />
          {/* TODO make this also a autocomplete with registered variants */}
          {/* // TODO
          // 4.  Variant subtags MUST be registered with IANA according to the
          // rules in Section 3.5 of this document before being used to form
          // language tags.  In order to distinguish variants from other types
          // of subtags, registrations MUST meet the following length and
          // content restrictions:

          // 1.  Variant subtags that begin with a letter (a-z, A-Z) MUST be
          //     at least five characters long. */}
          <EthnolibTextInput
            id="customize-variant-field"
            label="Variant (dialect)"
            value={dialogSelectedDialect}
            onChange={(event) => {
              setDialogSelectedDialectCode(event.target.value);
            }}
          />
          <Typography>
            Tag:
            <span
              css={css`
                font-weight: bold;
              `}
            >
              {createTag(
                props.selectedLanguageNode?.nodeData?.code,
                dialogSelectedScript?.id,
                dialogSelectedRegion?.id,
                dialogSelectedDialect
              )}
            </span>
          </Typography>
        </DialogContent>
      )}

      {/* // TODO abstract out these buttons which are copied from app.tsx */}
      <DialogActions>
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
            onClick={() => {
              if (isUnlistedLanguageDialog) {
                props.selectUnlistedLanguage();
              }
              // save unlisted language
              props.saveCustomizableLanguageDetails({
                scriptOverride: {
                  code: dialogSelectedScript?.id,
                  name: dialogSelectedScript?.label,
                } as ScriptData,
                region: {
                  code: dialogSelectedRegion?.id,
                  name: dialogSelectedRegion?.label,
                } as Region,
                dialect: dialogSelectedDialect,
              });
              props.onClose();
            }}
          >
            OK
          </Button>
          <Button
            css={css`
              min-width: 100px;
            `}
            variant="outlined"
            color="primary"
            onClick={props.onClose}
          >
            Cancel
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};
