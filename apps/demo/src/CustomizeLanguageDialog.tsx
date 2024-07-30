import * as React from "react";
import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import {
  CustomizableLanguageDetails,
  OptionNode,
  UNLISTED_LANGUAGE_NODE_ID,
  createTag,
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
import { LanguageData, ScriptData } from "@languagepicker/ethnolib";

// export type Region = {
//   name: string;
//   code: string;
// };

// TODO just download these and use...
function getAllRegionOptions() {
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
  const selectedLanguageNodeData = props.selectedLanguageNode
    ?.nodeData as LanguageData;
  const selectedScriptNodeData = props.selectedScriptNode
    ?.nodeData as ScriptData;
  const [dialogSelectedScriptCode, setDialogSelectedScriptCode] =
    React.useState<{
      label: string;
      id: string;
    } | null>(
      selectedScriptNodeData?.code
        ? {
            label: "TODO script name",
            id: selectedScriptNodeData.code,
          }
        : null
    );

  const [dialogSelectedRegionCode, setDialogSelectedRegionCode] =
    React.useState<{
      label: string;
      id: string;
    } | null>(null);
  const [dialogSelectedDialectCode, setDialogSelectedDialectCode] =
    React.useState<string>(
      selectedLanguageNodeData?.code
        ? props.customizableLanguageDetails.dialect || ""
        : props.searchString
    );

  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      css={css`
        padding: 25px;
      `}
    >
      <DialogTitle>
        {selectedLanguageNodeData
          ? "Custom Language Tag"
          : "Unlisted Language Tag"}
      </DialogTitle>

      {(!props.selectedLanguageNode ||
        props.selectedLanguageNode.id === UNLISTED_LANGUAGE_NODE_ID) && (
        <DialogContent>
          <EthnolibTextInput
            id="unlisted-lang-name-field"
            label="Name"
            value={dialogSelectedDialectCode}
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

      {props.selectedLanguageNode && (
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
            value={dialogSelectedScriptCode}
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
            value={dialogSelectedRegionCode}
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
            value={dialogSelectedDialectCode}
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
                selectedLanguageNodeData.code,
                dialogSelectedScriptCode?.id,
                dialogSelectedRegionCode?.id,
                dialogSelectedDialectCode
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
              if (!selectedLanguageNodeData) {
                props.selectUnlistedLanguage();
              }
              // save unlisted language
              props.saveCustomizableLanguageDetails({
                scriptOverride: {
                  code: dialogSelectedScriptCode?.id,
                  name: dialogSelectedScriptCode?.label,
                } as ScriptData,
                region: dialogSelectedRegionCode?.id,
                dialect: dialogSelectedDialectCode,
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
