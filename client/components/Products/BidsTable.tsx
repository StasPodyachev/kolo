import { BidsTableData } from "@/constants/shared";
import { numberWithCommas } from "@/helpers";
import { Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import { NextPage } from "next";

const BidsTable: NextPage = () => {
  return (
    <TableContainer mt="32px">
      <Table variant="simple">
        <Tbody>
          {BidsTableData.map((item) => (
            <Tr key={item.bid}>
              <Td pl={0}>{item.address}</Td>
              <Td textStyle="smallText" color="gray.300">
                {item.date}
              </Td>
              <Td pr={0} isNumeric>
                {numberWithCommas(item.bid)}&nbsp;FIL
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default BidsTable;
