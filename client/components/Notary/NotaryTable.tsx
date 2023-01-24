import { NotaryTableData } from "@/constants/shared";
import { numberWithCommas } from "@/helpers";
import { Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import { NextPage } from "next";

const NotaryTable: NextPage = () => {
  return (
    <TableContainer mt="40px">
      <Table variant="simple">
        <Tbody>
          {NotaryTableData.map((item) => (
            <Tr key={item.balance}>
              <Td pl={0}>{item.address}</Td>
              <Td pr={0} isNumeric>
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
