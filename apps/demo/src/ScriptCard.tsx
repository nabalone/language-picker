import { EthnolibCard } from "./EthnolibCard";
import { Typography } from "@mui/material";
import { ScriptData } from "@languagepicker/ethnolib";

export const ScriptCard: React.FunctionComponent<{
  scriptData: ScriptData;
  isSelected: boolean;
  colorWhenNotSelected: string;
  colorWhenSelected: string;
}> = (props) => {
  return (
    <EthnolibCard {...props}>
      <Typography variant="h5">{props.scriptData.name}</Typography>
      <Typography variant="body2">TODO sample text</Typography>
    </EthnolibCard>
  );
};
