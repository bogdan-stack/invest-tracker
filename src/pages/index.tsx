/* eslint-disable */
/* elint-disable */

import { type NextPage } from "next";
import { useState, useEffect } from "react";
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
import Footer from "~/components/Footer";
import Navbtn from "~/components/Navbtn";

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

  const message = api.example.hello.useQuery().data?.greeting;
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
    setLiveSwitch(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getInfo();
    };
    fetchData();
  }, []);

  if (!userLoaded) return (
  <div>
    <h1>Sorry!</h1>
  </div>
  )

  return (
    <>
      <Head>
        <title>BRD Invesment Tracker</title>
        <meta name="description" content="Investment Tracker App" />
        <link rel="icon" href="/ico_logo-mob.svg" />
      </Head>
        <Navbtn />
        <Stack height="100vh" backgroundColor="#fafafa">
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        <Stack  height="100vh" backgroundColor="#fafafa" display="flex" flexDirection="column">
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
              {!!isSignedIn && (
              <motion.div variants={container}>
                <Card w="99%" alignSelf="center" backgroundColor="white" position='unset'>
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
                        {!infoDataCotatie && (
                          <Stack padding={0}>
                            <Skeleton height="15px" />
                            <Skeleton height="15px" />
                            <Skeleton height="15px" />
                            <Skeleton height="15px" />
                          </Stack>
                        )}
                        { infoDataCotatie && (
                          <>
                            <motion.div variants={item}>
                              <Text textAlign="center">{infoDataCotatie}</Text>
                              <VStack
                              divider={<StackDivider borderColor="gray.200"/>}
                              justifyItems="space-between"
                              alignItems="stretch">
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
                              </VStack>
                            </motion.div>
                          </>
                        )}
                    </motion.div>
                  </CardBody>
                </Card>
              </motion.div>)}
              {!!isSignedIn && (
                <motion.div variants={container}>
                  <Card w="99%" alignSelf="center" backgroundColor="white" position="unset">
                    <CardHeader
                      paddingTop="20px"
                      paddingBottom={0}
                      paddingLeft="20px"
                      paddingRight="20px"
                    >
                      <Heading fontSize="md">Investments</Heading>
                    </CardHeader>
                    {!data && (
                      <Stack position="unset" padding={4}>
                        <Skeleton position="unset" height="15px" />
                        <Skeleton position="unset" height="15px" />
                        <Skeleton position="unset" height="15px" />
                        <Skeleton position="unset" height="15px" />
                      </Stack>
                    )}
                    {data && (
                      <CardBody position="unset">
                        <motion.div variants={item}>
                          <Stack divider={<StackDivider />} spacing="3">
                            {data?.map((post) => (
                              <div key={post.id}>
                              <HStack
                                justifyContent="space-between"
                                textAlign="center"
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
                                  {post.investAt.toDateString()}{" "}
                                </Text>
                                <Button
                                  position="unset"
                                  backgroundColor="white"
                                  onClick={() => {
                                    mutateDelete(post.id);
                                  }}
                                >
                                  <DeleteIcon position="unset" textColor="#e9041e" />
                                </Button>
                              </HStack>
                              </div>
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
                  <Card position="unset" w="99%" alignSelf="center" backgroundColor="white">
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
                        <CardBody position="unset">
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
                                  <div key={item.fondName}>
                                    <Text
                                      textColor="black"
                                      fontSize="15"
                                      fontWeight="medium"
                                    >
                                      {item.fondName}:
                                    </Text>
                                    <Text textColor="gray.500" fontSize="2xl">
                                      {item._sum.investAmount} RON
                                    </Text>
                                  </div>
                                ))}
                                {sumActiuni?.map((item) => (
                                  <div key={item.fondName}>
                                    <Text
                                      textColor="black"
                                      fontSize="15"
                                      fontWeight="medium"
                                    >
                                      Nr. de U.F. deținute:
                                    </Text>
                                    <Text textColor="gray.500" fontSize="2xl">
                                      {item._sum.nrUf?.toFixed(4)} U.F.
                                    </Text>
                                  </div>
                                ))}
                                </motion.div>
                              </VStack>
                              {infoUfVal2 && (
                                <motion.div variants={item}>
                                  <Card
                                    position="unset"
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
                                  position="unset"
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
          </motion.div>
          <Footer />
        </Stack>
      </Stack>
    </>
  );
};

export default Home;
