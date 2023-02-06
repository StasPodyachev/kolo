import { CustomInput } from "@/components/NewPoduct/NewPoduct";
import { FormControl, FormLabel } from "@chakra-ui/react";

interface IProps {
  title: string;
  placeholder: string;
  value: string;
  onChange: any;
}

const PanelInput = ({ title, placeholder, value, onChange }: IProps) => {
  return (
    <FormControl>
      <FormLabel fontSize="20px" lineHeight="28px" color="gray.200">
        {title}
      </FormLabel>
      <CustomInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </FormControl>
  );
};

export default PanelInput;
