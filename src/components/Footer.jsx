import React from 'react'
import { useState, useEffect } from "react";
import { Text, Button, HStack, VStack, Box, FormLabel, Input, NumberInput, NumberInputField, Select, Stack, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from '@chakra-ui/react'
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { api } from "~/utils/api";
import {
    BanknotesIcon,
    ChartBarSquareIcon,
    HomeIcon
  } from "@heroicons/react/24/outline";
import Link from 'next/link';

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
        const res = await fetch('https://invest-tracker-nine.vercel.app/api/trpc/getInfo')
        //const res = await fetch("http://localhost:3000/api/trpc/getInfo");
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
    <>
    {!!isSignedIn && (<HStack
    display="flex"
    position="sticky"
    bottom="0"
    justifyContent="center"
    backgroundColor="white"
    p={1}
    boxShadow="dark-lg"
  > 
    <Link href="/">
     <VStack p={3} alignItems="center"justifyItems="center" spacing={2}>
        <Button
          h={0}
          backgroundColor="white"
          fontWeight="normal"
          textColor="#e9041e"
        >
          <HomeIcon className="w-5 h-5 text-brd-red" />
        </Button>
        <VStack spacing={1.5}>
        <Text textColor="#e9041e" h={1} fontSize={11}>Home</Text>
        <Text textColor="#e9041e" h={1} fontSize={11}></Text>
        </VStack>
      </VStack>
      </Link>
    <VStack p={3} alignItems="center"justifyItems="center" spacing={2}>
        <Button
          h={0}
          backgroundColor="white"
          fontWeight="normal"
          textColor="#e9041e"
          onClick={onOpen}
        >
          <BanknotesIcon className="w-5 h-5 text-brd-red" />
        </Button>
        <VStack spacing={1.5}>
        <Text textColor="#e9041e" h={1} fontSize={11}>New</Text>
        <Text textColor="#e9041e" h={1} fontSize={11}>Investment</Text>
        </VStack>
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
    <Link href="/budget">
    <VStack p={3} alignItems="center"justifyItems="center" spacing={2}>
        <Button
          h={0}
          backgroundColor="white"
          fontWeight="normal"
          textColor="#e9041e"
        >
          <ChartBarSquareIcon className="w-5 h-5 text-brd-red" />
        </Button>
        <VStack spacing={1.5}>
        <Text textColor="#e9041e" h={1} fontSize={11}>Budget</Text>
        <Text textColor="#e9041e" h={1} fontSize={11}>Dashboard</Text>
        </VStack>
      </VStack>
      </Link>
  </HStack>
    )}</>
)}

export default Footer