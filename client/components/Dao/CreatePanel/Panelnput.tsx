import { CustomInput } from "@/components/NewPoduct/NewPoduct";
import { FormControl, FormLabel } from "@chakra-ui/react";

interface IProps {
  title: string;
  placeholder: string;
}

const PanelInput = ({ title, placeholder }: IProps) => {
  return (
    <FormControl>
      <FormLabel fontSize="20px" lineHeight="28px" color="gray.200">
        {title}
      </FormLabel>
      <CustomInput placeholder={placeholder} />
    </FormControl>
  );
};

export default PanelInput;
