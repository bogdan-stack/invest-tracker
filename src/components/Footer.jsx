import React from 'react'
import { useState, useEffect } from "react";
import { Button, HStack, VStack, Box, FormLabel, Input, NumberInput, NumberInputField, Select, Stack, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from '@chakra-ui/react'
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { api } from "~/utils/api";

const Footer = () => {
    const [infoUfVal, setInfo] = useState("");
    const [infoFoName, setInfoFoName] = useState("");
    const [infoUfVal2, setInfo2] = useState("");
    const [infoFoName2, setInfoFoName2] = useState("");
    const [infoDataCotatie, setInfoDataCotatie] = useState("");
    const { isLoaded: userLoaded, isSignedIn } = useUser();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [inputAmount, setInputAmount] = useState(0);
    const [inputFond, setInputFond] = useState("");
    const ctx = api.useContext();
    const { mutate, isLoading: isPosting } = api.example.create.useMutation({
        onSuccess: () => {
          void ctx.example.getAll.invalidate();
          void ctx.example.getSumAct.invalidate();
          void ctx.example.getSumSim.invalidate();
        },
      });

      const getInfo = async () => {
        //const res = await fetch('https://invest-tracker-nine.vercel.app/api/trpc/getInfo')
        const res = await fetch("http://localhost:3000/api/trpc/getInfo");
        const {
          infoUfVal,
          infoFoName,
          infoUfVal2,
          infoFoName2,
          liveSwitch,
          infoDataCotatie,
        } = await res.json();
        setInfo(infoUfVal);
        setInfoFoName(infoFoName);
        setInfo2(infoUfVal2);
        setInfoFoName2(infoFoName2);
        setInfoDataCotatie(infoDataCotatie);
      };

      useEffect(() => {
        const fetchData = async () => {
          await getInfo();
        };
        fetchData();
      }, []);

      const calculateUf = () => {
        if (inputFond === "BRD Simfonia") {
          return inputAmount / parseFloat(infoUfVal2);
        } else {
          return inputAmount / parseFloat(infoUfVal);
        }
      };

      const nrUfAch = Number(calculateUf());

      const ufValue = () => {
        if (inputFond === "BRD Simfonia") {
          return parseFloat(infoUfVal2);
        } else {
          return parseFloat(infoUfVal);
        }
      };

  return (
    <HStack
    position="sticky"
    bottom="0"
    justifyContent="center"
    backgroundColor="white"
    p={1}
    marginTop="auto"
    shadow="md"
  >
    <VStack>
      {!!isSignedIn && (
        <Button
          leftIcon={<AddIcon />}
          backgroundColor="#e9041e"
          textColor="white"
          onClick={onOpen}
        >
          New Investment
        </Button>
      )}
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Make New Investment
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="investDate">Date</FormLabel>
                <Input
                  id="investDate"
                  type="date"
                  focusBorderColor="black"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="investAmount">Amount</FormLabel>
                <NumberInput focusBorderColor="black">
                  <NumberInputField
                    id="investAmount"
                    type="number"
                    placeholder="Please enter the investment amount"
                    value={inputAmount}
                    onChange={(e) =>
                      setInputAmount(Number(e.target.value))
                    }
                  />
                </NumberInput>
              </Box>
              <Box>
                <FormLabel htmlFor="investFond">Found</FormLabel>
                <Select
                  id="investFond"
                  placeholder="Select a found"
                  focusBorderColor="black"
                  value={inputFond}
                  onChange={(e) => setInputFond(e.target.value)}
                >
                  <option id="Sim" value="BRD Simfonia">
                    BRD Simfonia
                  </option>
                  <option id="Act" value="BRD Actiuni">
                    BRD Actiuni
                  </option>
                </Select>
              </Box>
            </Stack>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              backgroundColor="#e9041e"
              textColor="white"
              onClick={() => {
                getInfo().then(() => {
                mutate({
                  investAmount: inputAmount ?? 0,
                  fondName: inputFond,
                  nrUf: Number(calculateUf()),
                  ufValue: Number(ufValue()),
                });
                onClose();
              });
            }}
            >
              Invest
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </VStack>
  </HStack>
  )
}

export default Footer