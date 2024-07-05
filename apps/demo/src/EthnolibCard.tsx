/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { CardContent, Card } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { COLORS } from "./Colors";

interface EthnolibCardProps {
  isSelected: boolean;
  //   childrenWhenSelected: React.ReactNode[];
  colorWhenNotSelected: string;
  colorWhenSelected: string;
}

export const EthnolibCard: React.FunctionComponent<
  PropsWithChildren<EthnolibCardProps>
> = (props) => {
  const backgroundColor = props.isSelected
    ? props.colorWhenSelected
    : props.colorWhenNotSelected;
  return (
    <>
      <Card
        variant="outlined"
        css={css`
          position: relative;
          box-shadow: ${COLORS.greys[2]} 0px 5px 5px;
        `}
        sx={{ bgcolor: () => backgroundColor }} // TODO or should this just be bgcolor: color?
        {...props}
      >
        <CardContent>{props.children}</CardContent>
      </Card>
    </>
  );
};
