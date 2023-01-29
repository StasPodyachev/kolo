import { BidsTableData } from "@/constants/shared";
import { addressTruncation, numberWithCommas } from "@/helpers";
import { Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import { NextPage } from "next";
import AddressCopy from "../ui/AddressCopy";

const BidsTable: NextPage = () => {
  return (
    <TableContainer mt="32px">
      <Table variant="simple">
        <Tbody>
          {BidsTableData.map((item) => (
            <Tr key={item.bid}>
              <Td pl={0}>
                <AddressCopy address={item.address} />
              </Td>
              <Td textStyle="smallText" color="gray.300" textAlign="center">
                {item.date}
              </Td>
              <Td fontFamily="Roboto Mono" pr={0} color="white" isNumeric>
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
