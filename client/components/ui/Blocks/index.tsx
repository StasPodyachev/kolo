import useDevice from "@/hooks/useDevice";
import { IBlock, IChildren } from "@/types";
import { Grid } from "@chakra-ui/react";
import { NextPage } from "next";
import Block from "../Block";

interface IProps {
  items: IBlock[];
}

const Blocks = ({ items }: IProps) => {
  const { isDesktopHeader } = useDevice();
  return (
    <Grid
      gap="32px"
      rowGap="32px"
      justifyContent={isDesktopHeader[0] ? "space-between" : "center"}
      templateColumns="repeat(auto-fit, 220px)"
      templateRows="auto"
    >
      {items.map((block) => (
        <Block key={block.title} title={block.title} value={block.value} />
      ))}
    </Grid>
  );
};

export default Blocks;
