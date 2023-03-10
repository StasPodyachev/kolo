import { Box, Flex, Text, Button } from "@chakra-ui/react";
import Image from "next/image";
import Sheet from "@/icons/cardImages/sheet.svg";
import Lamp from "@/icons/cardImages/lamp.svg";
import Clouds from "@/icons/cardImages/clouds.svg";
import Mountain from "@/icons/cardImages/mountain.svg";
import Plant from "@/icons/cardImages/plant.svg";
import Recycle from "@/icons/cardImages/recycle.svg";
import { FileIcon } from "@/icons";
import Link from "next/link";
import AddressCopy from "../ui/AddressCopy";
interface IProps {
  to: number;
  title: string;
  price: number;
  ownedBy: string;
  saleEndDate: string;
  image?: string;
}

const imagesArray = [Sheet, Lamp, Clouds, Mountain, Plant, Recycle];

const ItemCard = ({
  to,
  title,
  price,
  ownedBy,
  saleEndDate,
  image,
}: IProps) => {
  const randomImage = Math.floor(Math.random() * (imagesArray.length));
  return (
    <Link href={`products/${to.toString()}`}>
      <Box minW="304px" minH="435px" bg="white">
        {image ? (
          <Image src={image} alt="card image" width={304} height={240} />
        ) : (
          <Flex
            justifyContent="center"
            alignItems="center"
            h="240px"
            bg="gray.800"
          >
            <Image src={imagesArray[randomImage]} alt="card image" />
          </Flex>
        )}
        <Flex
          h="195px"
          flexDir="column"
          justifyContent="space-between"
          p="18px 16px"
        >
          <Flex flexDir="column" gap="6px">
            <Flex justifyContent="space-between">
              <Text textStyle="bigText" color="gray.900">
                {title.length > 17 ? `${title.slice(0,17)}...` : title}
              </Text>
              <Text
                fontFamily="Roboto Mono"
                textStyle="bigText"
                color="gray.900"
              >
                {price}&nbsp;FIL
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text textStyle="smallText" color="gray.300">
                Owned by
              </Text>
              <AddressCopy
                address={ownedBy}
                textStyle="smallText"
                color="gray.300"
              />
            </Flex>
            <Flex
              justifyContent="space-between"
              position="relative"
              bottom="112px"
            >
              <Text textStyle="smallText" color="gray.300">
                Sale ends
              </Text>
              <Text textStyle="smallText" color="gray.300">
                {saleEndDate}
              </Text>
            </Flex>
            <Box
              alignSelf="flex-end"
              position="relative"
              bottom="328px"
              left="6px"
            >
              <FileIcon boxSize="32px" />
            </Box>
          </Flex>
            <Button
              w="100%"
              bg="blue.primary"
              color="white"
              borderRadius={0}
              textStyle="button"
              transition="all .3s"
              _hover={{ bg: "blue.hover" }}
            >
              buy
            </Button>
        </Flex>
      </Box>
    </Link>
  );
};

export default ItemCard;
