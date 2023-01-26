import { NotaryTableData } from "@/constants/shared";
import { addressTruncation, numberWithCommas } from "@/helpers";
import { Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import { NextPage } from "next";
import AddressCopy from "../ui/AddressCopy";

const NotaryTable: NextPage = () => {
  return (
    <TableContainer mt="40px">
      <Table variant="simple">
        <Tbody>
          {NotaryTableData.map((item) => (
            <Tr key={item.balance}>
              <Td pl={0}>
                <AddressCopy address={item.address} />
              </Td>
              <Td fontFamily="Roboto Mono" pr={0} isNumeric>
                {numberWithCommas(item.balance)}&nbsp;FIL
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default NotaryTable;
