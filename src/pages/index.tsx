/* eslint-disable */
/* elint-disable */

import { type NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import {
  Stack,
  Card,
  CardHeader,
  CardBody,
  Text,
  StackDivider,
  Heading,
  HStack,
  Button,
  VStack,
  Box,
  Skeleton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  FormLabel,
  Input,
  Select,
  Avatar,
  NumberInput,
  NumberInputField,
  AvatarBadge,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { api } from "~/utils/api";
import StatsPage from "./stats";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  const [infoUfVal, setInfo] = useState<string>("");
  const [infoFoName, setInfoFoName] = useState<string>("");
  const [infoUfVal2, setInfo2] = useState<string>("");
  const [infoFoName2, setInfoFoName2] = useState<string>("");
  const [infoDataCotatie, setInfoDataCotatie] = useState<string>("");
  const [liveSwitch, setLiveSwitch] = useState<boolean>(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputAmount, setInputAmount] = useState<number>(0);
  const [inputFond, setInputFond] = useState<string>("");
  const [inputIdToDelete, setInputIdToDelete] = useState<string>("");

  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.example.create.useMutation({
    onSuccess: () => {
      void ctx.example.getAll.invalidate();
      void ctx.example.getSumAct.invalidate();
      void ctx.example.getSumSim.invalidate();
    },
  });
  const { mutate: mutateDelete } = api.example.delete.useMutation({
    onSuccess: () => {
      void ctx.example.getAll.invalidate();
      void ctx.example.getSumAct.invalidate();
      void ctx.example.getSumSim.invalidate();
    },
  });

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  const { data } = api.example.getAll.useQuery();

  const { data: sumSimfonia } = api.example.getSumSim.useQuery();
  const totalSim = sumSimfonia?.[0]?._sum.investAmount?.toString();
  const totalUfSim = sumSimfonia?.[0]?._sum.nrUf?.toString();

  const { data: sumActiuni } = api.example.getSumAct.useQuery();
  const totalAct = sumActiuni?.[0]?._sum.investAmount?.toString();
  const totalUfAct = sumActiuni?.[0]?._sum.nrUf?.toString();

  const calculateUf = () => {
    if (inputFond === "BRD Simfonia") {
      return inputAmount / parseFloat(infoUfVal2);
    } else {
      return inputAmount / parseFloat(infoUfVal);
    }
  };

  const ufValue = () => {
    if (inputFond === "BRD Simfonia") {
      return parseFloat(infoUfVal2);
    } else {
      return parseFloat(infoUfVal);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1,
      },
    },
  };

  const getInfo = async () => {
    setLiveSwitch(false);
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
    setLiveSwitch(true);
  };

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>BRD Invesment Tracker</title>
        <meta name="description" content="Investment Tracker App" />
        <link rel="icon" href="/ico_logo-mob.svg" />
      </Head>
      <main>
        <Stack>
          <HStack
            backgroundColor="white"
            display="flex"
            position="sticky"
            justifyContent="space-between"
            padding="3"
            paddingBottom={1}
            paddingTop={1}
            shadow="md"
          >
            {!isSignedIn && (
              <>
                <Text>Please sign in!</Text>
                <SignInButton>
                  <Button
                    backgroundColor="#e9041e"
                    textColor="white"
                    fontSize="sm"
                    padding="1.5"
                    height="-webkit-fit-content"
                    alignSelf="center"
                  >
                    <ArrowLeftOnRectangleIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </Button>
                </SignInButton>
              </>
            )}
            {!!isSignedIn && (
              <Avatar size="sm" bg="#e9041e">
                <AvatarBadge boxSize="1.25em" bg="green.500" />
              </Avatar>
            )}

            {!!isSignedIn && (
              <Text padding={2} textColor="black" fontWeight="bold">
                Hello Bogdan!
              </Text>
            )}
            {!!isSignedIn && (
              <SignOutButton>
                <Button
                  backgroundColor="#e9041e"
                  textColor="white"
                  fontSize="sm"
                  padding="1.5"
                  height="-webkit-fit-content"
                  alignSelf="center"
                >
                  <ArrowRightOnRectangleIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </Button>
              </SignOutButton>
            )}
          </HStack>
        </Stack>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        <Stack backgroundColor="#fafafa" display="flex" flexDirection="column">
          <motion.div variants={container} initial="hidden" animate="visible">
            <Stack justifyContent="center" p={3}>
              {!!isSignedIn && (
                <StatsPage
                  totalSim={totalSim}
                  totalUfSim={totalUfSim}
                  totalAct={totalAct}
                  totalUfAct={totalUfAct}
                  infoUfVal2={infoUfVal2}
                  infoUfVal={infoUfVal}
                />
              )}
              <motion.div variants={container}>
                <Card w="99%" alignSelf="center" backgroundColor="white">
                  <CardHeader
                    paddingTop="20px"
                    paddingBottom={0}
                    paddingLeft="20px"
                    paddingRight="20px"
                  >
                    <Heading fontSize="md">Live Info</Heading>
                  </CardHeader>
                  <CardBody>
                    <motion.div variants={item}>
                      <Stack divider={<StackDivider />} spacing="3">
                        {liveSwitch == false && (
                          <Stack padding={0}>
                            <Skeleton height="15px" />
                            <Skeleton height="15px" />
                            <Skeleton height="15px" />
                            <Skeleton height="15px" />
                          </Stack>
                        )}
                        {liveSwitch == true && (
                          <>
                            <motion.div variants={item}>
                              <Text textAlign="center">{infoDataCotatie}</Text>
                              <HStack
                                justifyContent="space-between"
                                textAlign="left"
                                display={infoFoName ? "flex" : "none"}
                              >
                                <VStack alignItems="flex-start" spacing={0}>
                                  <Text textColor="black" fontWeight="medium">
                                    {" "}
                                    {infoFoName}
                                  </Text>
                                  <Text textColor="gray.500" fontSize={14}>
                                    Valoare unitară titlu
                                  </Text>
                                </VStack>
                                <Text textColor="gray.500">
                                  {" "}
                                  {parseFloat(infoUfVal)} RON
                                </Text>
                              </HStack>
                              <HStack
                                justifyContent="space-between"
                                textAlign="left"
                                display={infoFoName ? "flex" : "none"}
                              >
                                <VStack alignItems="flex-start" spacing={0}>
                                  <Text textColor="black" fontWeight="medium">
                                    {" "}
                                    {infoFoName2}
                                  </Text>
                                  <Text textColor="gray.500" fontSize={14}>
                                    Valoare unitară titlu
                                  </Text>
                                </VStack>
                                <Text textColor="gray.500">
                                  {" "}
                                  {parseFloat(infoUfVal2)} RON
                                </Text>
                              </HStack>
                            </motion.div>
                          </>
                        )}
                        <Button
                          backgroundColor="#e9041e"
                          textColor="white"
                          onClick={getInfo}
                        >
                          Live Feed
                        </Button>
                      </Stack>
                    </motion.div>
                  </CardBody>
                </Card>
              </motion.div>
              {!!isSignedIn && (
                <motion.div variants={container}>
                  <Card w="99%" alignSelf="center" backgroundColor="white">
                    <CardHeader
                      paddingTop="20px"
                      paddingBottom={0}
                      paddingLeft="20px"
                      paddingRight="20px"
                    >
                      <Heading fontSize="md">Investments</Heading>
                    </CardHeader>
                    {!data && (
                      <Stack padding={4}>
                        <Skeleton height="15px" />
                        <Skeleton height="15px" />
                        <Skeleton height="15px" />
                        <Skeleton height="15px" />
                      </Stack>
                    )}
                    {data && (
                      <CardBody>
                        <motion.div variants={item}>
                          <Stack divider={<StackDivider />} spacing="3">
                            {data?.map((post) => (
                              <HStack
                                justifyContent="space-between"
                                textAlign="center"
                                key={post.id}
                              >
                                <Text textColor="black" fontWeight="medium">
                                  {" "}
                                  {post.investAmount} RON
                                </Text>
                                <Text textColor="gray.500">
                                  {" "}
                                  {post.fondName}{" "}
                                </Text>
                                <Text textColor="gray.500">
                                  {" "}
                                  {post.createdAt.toDateString()}{" "}
                                </Text>
                                <Button
                                  backgroundColor="white"
                                  onClick={() => {
                                    mutateDelete(post.id);
                                  }}
                                >
                                  <DeleteIcon textColor="#e9041e" />
                                </Button>
                              </HStack>
                            ))}
                          </Stack>
                        </motion.div>
                      </CardBody>
                    )}
                  </Card>
                </motion.div>
              )}
              {!!isSignedIn && (
                <motion.div variants={container}>
                  <Card w="99%" alignSelf="center" backgroundColor="white">
                    <CardHeader
                      paddingTop="20px"
                      paddingBottom={0}
                      paddingLeft="20px"
                      paddingRight="20px"
                    >
                      <Heading fontSize="md">Your stats</Heading>
                    </CardHeader>
                    <motion.div variants={item}>
                      {!data && (
                        <Stack padding={4}>
                          <Skeleton height="15px" />
                          <Skeleton height="15px" />
                          <Skeleton height="15px" />
                          <Skeleton height="15px" />
                        </Stack>
                      )}
                        <CardBody>
                          <Stack divider={<StackDivider />} spacing="3">
                            <HStack
                              justifyContent="space-between"
                              textAlign="center"
                            >
                              <VStack
                                alignItems="flex-start"
                                textAlign="left"
                                spacing={0}
                              >
                                <motion.div variants={item}>
                                {sumActiuni?.map((item) => (
                                  <>
                                    <Text
                                      key={item.fondName}
                                      textColor="black"
                                      fontSize="15"
                                      fontWeight="medium"
                                    >
                                      {item.fondName}:
                                    </Text>
                                    <Text textColor="gray.500" fontSize="2xl">
                                      {item._sum.investAmount} RON
                                    </Text>
                                  </>
                                ))}
                                {sumActiuni?.map((item) => (
                                  <>
                                    <Text
                                      key={item.fondName}
                                      textColor="black"
                                      fontSize="15"
                                      fontWeight="medium"
                                    >
                                      Nr. de U.F. deținute:
                                    </Text>
                                    <Text textColor="gray.500" fontSize="2xl">
                                      {item._sum.nrUf?.toFixed(4)} U.F.
                                    </Text>
                                  </>
                                ))}
                                </motion.div>
                              </VStack>
                              {infoUfVal2 && (
                                <motion.div variants={item}>
                                  <Card
                                    alignItems="center"
                                    padding="1rem"
                                    align="flex-start"
                                    backgroundColor="whatsapp.500"
                                    borderRadius="lg"
                                  >
                                    <VStack
                                      alignItems="center"
                                      align="center"
                                      spacing={0}
                                    >
                                      {sumActiuni?.map((item) => {
                                        const nrUf =
                                          Number(item._sum?.nrUf).toFixed(4) ??
                                          0;
                                        const ufVal =
                                          Number(infoUfVal).toFixed(4) ?? 0;
                                        const investAmount =
                                          Number(item._sum?.investAmount) ?? 0;
                                        const totalInvestment = (
                                          Number(parseFloat(nrUf)) *
                                          Number(parseFloat(ufVal))
                                        ).toFixed(2);
                                        const profit = (
                                          Number(
                                            parseFloat(totalInvestment).toFixed(
                                              2
                                            )
                                          ) - investAmount
                                        ).toFixed(2);
                                        return (
                                          <>
                                            <Text
                                              textColor="white"
                                              fontSize="15"
                                              fontWeight="medium"
                                            >
                                              Valoarea totală a investiției:
                                            </Text>
                                            <Text
                                              key={item._sum?.nrUf}
                                              textColor="white"
                                              fontSize="2xl"
                                              fontWeight="medium"
                                            >
                                              {totalInvestment} RON
                                            </Text>
                                            <Text
                                              textColor="white"
                                              fontSize="15"
                                              fontWeight="medium"
                                            >
                                              Profit:
                                            </Text>
                                            <Text
                                              textColor="white"
                                              fontSize="2xl"
                                              fontWeight="medium"
                                            >
                                              {profit} RON
                                            </Text>
                                          </>
                                        );
                                      })}
                                    </VStack>
                                  </Card>
                                </motion.div>
                              )}
                            </HStack>
                          </Stack>
                        </CardBody>
                        <CardBody>
                          <Stack divider={<StackDivider />} spacing="3">
                            <HStack
                              justifyContent="space-between"
                              textAlign="center"
                            >
                              <VStack
                                alignItems="flex-start"
                                textAlign="left"
                                spacing={0}
                              >
                                {sumSimfonia?.map((item) => (
                                  <>
                                    <Text
                                      key={item.fondName}
                                      textColor="black"
                                      fontSize="15"
                                      fontWeight="medium"
                                    >
                                      {item.fondName}:
                                    </Text>
                                    <Text textColor="gray.500" fontSize="2xl">
                                      {item._sum.investAmount} RON
                                    </Text>
                                  </>
                                ))}
                                {sumSimfonia?.map((item) => (
                                  <>
                                    <Text
                                      key={item.fondName}
                                      textColor="black"
                                      fontSize="15"
                                      fontWeight="medium"
                                    >
                                      Nr. de U.F. deținute:
                                    </Text>
                                    <Text textColor="gray.500" fontSize="2xl">
                                      {item._sum.nrUf?.toFixed(4)} U.F.
                                    </Text>
                                  </>
                                ))}
                              </VStack>
                              {infoUfVal2 && (
                                <motion.div variants={item}>
                                  <Card
                                    alignItems="center"
                                    padding="1rem"
                                    align="flex-start"
                                    backgroundColor="whatsapp.500"
                                    borderRadius="lg"
                                  >
                                    <VStack
                                      alignItems="center"
                                      align="center"
                                      spacing={0}
                                    >
                                      {sumSimfonia?.map((item) => {
                                        const nrUf =
                                          Number(item._sum?.nrUf).toFixed(4) ??
                                          0;
                                        const ufVal2 =
                                          Number(infoUfVal2).toFixed(4) ?? 0;
                                        const investAmount =
                                          Number(item._sum?.investAmount) ?? 0;
                                        const totalInvestment2 = (
                                          Number(parseFloat(nrUf)) *
                                          Number(parseFloat(ufVal2))
                                        ).toFixed(2);
                                        const profit2 = (
                                          Number(
                                            parseFloat(
                                              totalInvestment2
                                            ).toFixed(2)
                                          ) - investAmount
                                        ).toFixed(2);
                                        return (
                                          <>
                                            <Text
                                              textColor="white"
                                              fontSize="15"
                                              fontWeight="medium"
                                            >
                                              Valoarea totală a investiției:
                                            </Text>
                                            <Text
                                              key={item._sum?.nrUf}
                                              textColor="white"
                                              fontSize="2xl"
                                              fontWeight="medium"
                                            >
                                              {totalInvestment2} RON
                                            </Text>
                                            <Text
                                              textColor="white"
                                              fontSize="15"
                                              fontWeight="medium"
                                            >
                                              Profit:
                                            </Text>
                                            <Text
                                              textColor="white"
                                              fontSize="2xl"
                                              fontWeight="medium"
                                            >
                                              {profit2} RON
                                            </Text>
                                          </>
                                        );
                                      })}
                                    </VStack>
                                  </Card>
                                </motion.div>
                              )}
                            </HStack>
                          </Stack>
                        </CardBody>
                        </motion.div>
                  </Card>
                </motion.div>
              )}
            </Stack>
            <HStack
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
                          mutate({
                            investAmount: inputAmount ?? 0,
                            fondName: inputFond,
                            nrUf: calculateUf(),
                            ufValue: ufValue(),
                          });
                          onClose();
                        }}
                      >
                        Invest
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </VStack>
            </HStack>
          </motion.div>
        </Stack>
      </main>
    </>
  );
};

export default Home;
