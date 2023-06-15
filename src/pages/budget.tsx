/* eslint-disable */
/* elint-disable */
import {
  Card,
  CircularProgressLabel,
  CircularProgress,
  Stack,
  Heading,
  Text,
  HStack,
  VStack,
  CardHeader,
  CardBody,
  Flex,
  Box,
  Badge,
  Input,
  Progress,
  Select,
  Button,
  Divider,
  AbsoluteCenter,
  StackDivider,
} from "@chakra-ui/react";
import {DeleteIcon } from "@chakra-ui/icons";
import React from "react";
import { useState } from "react";
import Footer from "~/components/Footer";
import { api } from "~/utils/api";
import { date } from "zod";

const budget = () => {
  const ctx = api.useContext();

  const { data: monthBudget } = api.example.getIncomeMonthly.useQuery();
  const totalMonthlyBudget =
    monthBudget?.[0]?._sum.transactionAmount?.toString();

  const { data: currentExpense } = api.example.getExpenseMonthly.useQuery();
  const totalMonthlyExpense =
    currentExpense?.[0]?._sum.transactionAmount?.toString();

  const { data } = api.example.getAllExpenses.useQuery();

  const [inputExpenseName, setInputExpenseName] = useState("");
  const [inputExpenseAmount, setInputExpenseAmount] = useState("");
  const [inputExpenseType, setInputExpenseType] = useState("");

  const currentBudget =
    Number(totalMonthlyBudget) - Number(totalMonthlyExpense);
  const percentBudget =
    (Number(currentBudget) / Number(totalMonthlyBudget)) * 100;

  const budgetNeeds = Number(totalMonthlyBudget) * (50 / 100);
  const budgetWants = Number(totalMonthlyBudget) * (30 / 100);
  const budgetSavings = Number(totalMonthlyBudget) * (20 / 100);

  const percentExpenses =
    100 - (Number(currentBudget) / Number(totalMonthlyBudget)) * 100;

  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const d = new Date();

  const { mutate, isLoading: isPosting } = api.example.createExpenses.useMutation({
    onSuccess: () => {
      void ctx.example.getAllExpenses.invalidate();
    },
  });

  return (
    <>
      <Stack
        height="100vh"
        backgroundColor="#fafafa"
        display="flex"
        flexDirection="column"
      >
        <Stack position="unset" justifyContent="center" p={3}>
          <Card height="full" position="unset">
            <CardHeader
              paddingTop="20px"
              paddingBottom={0}
              paddingLeft="20px"
              paddingRight="20px"
            >
              <Heading fontSize="md">Monthly Budget</Heading>
            </CardHeader>
            <CardBody>
              <HStack
                spacing={0}
                justifyItems="center"
                justifyContent="space-between"
              >
                <VStack
                  spacing={0}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <CircularProgress
                    size={32}
                    value={percentBudget}
                    color="whatsapp.500"
                    thickness="16px"
                    position="unset"
                  >
                  </CircularProgress>
                  <HStack
                    display="flex"
                    justifyItems="center"
                    alignItems="center"
                  >
                    <Text alignItems="flex-end" fontWeight="bold" fontSize="20">
                      {currentBudget}
                    </Text>
                    <Text
                      alignItems="flex-end"
                      fontWeight="normal"
                      fontSize="20"
                    >
                      / {totalMonthlyBudget} RON
                    </Text>
                  </HStack>
                </VStack>
                <VStack
                  display="flex"
                  justifyContent="space-between"
                  spacing={0}
                  alignItems="flex-start"
                >
                  <VStack
                    display="flex"
                    justifyContent="space-between"
                    spacing={0}
                    alignItems="flex-start"
                    p={2}
                  >
                    <HStack>
                      <CircularProgress
                        size={10}
                        value={percentBudget}
                        color="red"
                        thickness="17px"
                        position="unset"
                      ></CircularProgress>
                      <VStack spacing={0} alignItems="flex-start">
                        <Text textColor="black" fontWeight="medium">
                          Needs
                        </Text>
                        <Text textColor="gray.500" fontSize={12}>
                          50% din Buget
                        </Text>
                      </VStack>
                    </HStack>
                    <HStack>
                      <Text textColor="black" fontWeight="semibold">
                        2300
                      </Text>
                      <Text textColor="black" fontWeight="medium">
                        / {budgetNeeds} RON
                      </Text>
                    </HStack>
                  </VStack>
                  <VStack
                    display="flex"
                    justifyContent="space-between"
                    spacing={0}
                    alignItems="flex-start"
                    p={2}
                  >
                    <HStack>
                      <CircularProgress
                        size={10}
                        value={percentBudget}
                        color="orange"
                        thickness="17px"
                        position="unset"
                      ></CircularProgress>
                      <VStack spacing={0} alignItems="flex-start">
                        <Text textColor="black" fontWeight="medium">
                          Wants
                        </Text>
                        <Text textColor="gray.500" fontSize={12}>
                          30% din Buget
                        </Text>
                      </VStack>
                    </HStack>
                    <HStack>
                      <Text textColor="black" fontWeight="semibold">
                        2300
                      </Text>
                      <Text textColor="black" fontWeight="medium">
                        / {budgetWants} RON
                      </Text>
                    </HStack>
                  </VStack>
                  <VStack
                    display="flex"
                    justifyContent="space-between"
                    spacing={0}
                    alignItems="flex-start"
                    p={2}
                  >
                    <HStack>
                      <CircularProgress
                        size={10}
                        value={percentBudget}
                        color="whatsapp.500"
                        thickness="17px"
                        position="unset"
                      ></CircularProgress>
                      <VStack spacing={0} alignItems="flex-start">
                        <Text textColor="black" fontWeight="medium">
                          Savings
                        </Text>
                        <Text textColor="gray.500" fontSize={12}>
                          20% din Buget
                        </Text>
                      </VStack>
                    </HStack>
                    <HStack>
                      <Text textColor="black" fontWeight="semibold">
                        2300
                      </Text>
                      <Text textColor="black" fontWeight="medium">
                        / {budgetSavings} RON
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
          <Card position="unset">
            <CardHeader
              paddingTop="20px"
              paddingBottom={0}
              paddingLeft="20px"
              paddingRight="20px"
            >
              <Heading fontSize="md">Monthly Expenses</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Flex justifyContent="flex-end">
                  <Box ml="3" justifyItems="flex-start">
                    <Text>
                      Total expenses
                      <Badge fontSize="1em" ml={1} colorScheme="red">
                        {totalMonthlyExpense} RON
                      </Badge>
                    </Text>
                  </Box>
                </Flex>
                <Progress hasStripe colorScheme="red" value={percentExpenses} />
                <Box position="relative" padding={4}>
                  <Divider />
                  <AbsoluteCenter bg="white" px="4">
                    Add Expenses:
                  </AbsoluteCenter>
                </Box>
                <Flex direction="row" justifyContent="center">
                  <Text fontSize={14} variant="outline">Expense Name</Text>
                  <Input
                  focusBorderColor="black"
                  value={inputExpenseName}
                  onChange={(e) => setInputExpenseName(e.target.value)} />
                </Flex>
                <Flex direction="row">
                  <Text fontSize={14} variant="outline">Expense Amount</Text>
                  <Input
                  type="number"
                  focusBorderColor="black"
                  value={inputExpenseAmount}
                  onChange={(e) => setInputExpenseAmount(e.target.value)} />
                </Flex>
                <Flex>
                  <Text fontSize={14}>Expense Type</Text>
                  <Select
                  focusBorderColor="black"
                  value={inputExpenseType}
                  onChange={(e) => setInputExpenseType(e.target.value)}>
                    <option id="need" value="Needs">
                      Needs
                    </option>
                    <option id="wants" value="Wants">
                      Wants
                    </option>
                    <option id="savings" value="Savings">
                      Savings
                    </option>
                  </Select>
                </Flex>
                <Flex>
                  <Button
                    width="100vh"
                    backgroundColor="#e9041e"
                    textColor="white"
                    type="submit"
                    onClick={()=>mutate({
                      transactionName: inputExpenseName,
                      transactionAmount: Number(inputExpenseAmount),
                      transactionTag: inputExpenseType,
                      transactionMonth: month[d.getMonth()] ?? "",
                      transactionType: "Expense",
                      transactionAt: new Date()
                    })}
                  >
                    Submit
                  </Button>
                </Flex>
                <Box position="relative" padding={4}>
                  <Divider />
                  <AbsoluteCenter bg="white" px="4">
                    Expenses List:
                  </AbsoluteCenter>
                </Box>
                <Stack divider={<StackDivider />} spacing="3">
                            {data?.map((budget) => (
                              <>
                              <HStack justifyContent="space-between"
                                textAlign="center" id={budget.transactionId}>
                                <Text textColor="black" fontWeight="medium">
                                  {budget.transactionName}
                                </Text>
                                <Text textColor="gray.500">
                                  {budget.transactionAmount} RON
                                </Text>
                                <Badge colorScheme={
                                  budget.transactionTag === "Needs" ? "red"
                                  : budget.transactionTag === "Wants"? "orange"
                                  : budget.transactionTag === "Savings"? "green" : "gray"}>
                                  {budget.transactionTag}
                                </Badge>
                                <Text textColor="gray.500">
                                  {budget.transactionAt.toDateString()}
                                </Text>
                                <Button
                                  position="unset"
                                  backgroundColor="white">
                                  <DeleteIcon position="unset" textColor="#e9041e" />
                                </Button>
                              </HStack>
                              </>
                            ))}
                </Stack>
              </Stack>
            </CardBody>
          </Card>
        </Stack>
        <Footer />
      </Stack>
    </>
  );
};

export default budget;
