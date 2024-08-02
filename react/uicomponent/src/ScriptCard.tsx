import { EthnolibCard, EthnolibCardProps } from "./EthnolibCard";
import { Typography } from "@mui/material";
import { ScriptData } from "@languagepicker/find-language";

interface ScriptCardProps extends EthnolibCardProps {
  scriptData: ScriptData;
}

export const ScriptCard: React.FunctionComponent<ScriptCardProps> = (props) => {
  return (
    <EthnolibCard {...props}>
      <Typography variant="h5">{props.scriptData.name}</Typography>
      <Typography variant="body2">TODO sample text</Typography>
    </EthnolibCard>
  );
};
