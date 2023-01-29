import { IBlock } from "@/types";
import { Grid } from "@chakra-ui/react";
import Block from "../Block";

interface IProps {
  items: IBlock[];
}

const Blocks = ({ items }: IProps) => {
  return (
    <Grid
      gap="32px"
      rowGap="32px"
      justifyContent="space-around"
      templateColumns="repeat(auto-fit, 240px)"
      templateRows="auto"
    >
      {items.map((block) => (
        <Block key={block.title} title={block.title} value={block.value} />
      ))}
    </Grid>
  );
};

export default Blocks;
