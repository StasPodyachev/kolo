import { NotaryTableData } from "@/constants/shared";
import { numberWithCommas } from "@/helpers";
import { INotaryData } from "@/types";
import { Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import AddressCopy from "../ui/AddressCopy";

interface IProps {
  data: INotaryData[] | INotaryData;
}

const NotaryTable = ({ data }: IProps) => {
  return (
    <TableContainer mt="40px">
      <Table variant="simple">
        <Tbody>
          {Array.isArray(data) ? data.map((item) => (
            <Tr key={item.address}>
              <Td pl={0}>
                <AddressCopy address={item.address} />
              </Td>
              <Td fontFamily="Roboto Mono" pr={0} color={item?.balance < 1 ? "#7c8091" : "white"} isNumeric>
                {numberWithCommas(item?.balance)}&nbsp;FIL
              </Td>
            </Tr>
          )) : (
            <Tr>
              <Td pl={0}>
                <AddressCopy address={data?.address} />
              </Td>
              <Td fontFamily="Roboto Mono" pr={0} color="white" isNumeric>
                {numberWithCommas(data?.balance)}&nbsp;FIL
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default NotaryTable;
