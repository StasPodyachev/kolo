import { BidsTableData } from "@/constants/shared";
import { numberWithCommas } from "@/helpers";
import { IBidTableData } from "@/types";
import { Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import AddressCopy from "../ui/AddressCopy";

interface IProps {
  data: IBidTableData[];
}

const BidsTable = ({ data }: IProps) => {
  return (
    <TableContainer mt="32px">
      <Table variant="simple">
        <Tbody>
          {data ? data.map((item) => (
            <Tr key={item.currentBid}>
              <Td pl={0}>
                <AddressCopy address={item.address} />
              </Td>
              <Td textStyle="smallText" color="gray.300" textAlign="center">
                {item.date}
              </Td>
              <Td fontFamily="Roboto Mono" pr={0} color="white" isNumeric>
                {numberWithCommas(item.currentBid)}&nbsp;FIL
              </Td>
            </Tr>
          )) : null}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default BidsTable;
