/** @jsxImportSource @emotion/react */
// import { css } from "@emotion/react";
import { CardContent, Card } from "@mui/material";
import React, { PropsWithChildren } from "react";

interface EthnolibCardProps {
  isSelected: boolean;
  //   childrenWhenSelected: React.ReactNode[];
  colorWhenNotSelected: string;
  colorWhenSelected: string;
}

export const EthnolibCard: React.FunctionComponent<
  PropsWithChildren<EthnolibCardProps>
> = (props) => {
  const color = props.isSelected
    ? props.colorWhenSelected
    : props.colorWhenNotSelected;
  return (
    <>
      <Card
        variant="outlined"
        sx={{ bgcolor: () => color }} // TODO or should this just be bgcolor: color?
      >
        <CardContent>{props.children}</CardContent>
      </Card>
      {/* {props.isSelected && 
        <EthnolibCard
            isSelected={false} // TODO

        >
            <p>hi</p>
            {props.childrenWhenSelected} 
            {/* // TODO flexbox these into a row */}
      {/* </EthnolibCard>} */}
    </>
  );
};
