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
import { DeleteIcon } from "@chakra-ui/icons";
import React from "react";
import { useState } from "react";
import Footer from "~/components/Footer";
import Navbtn from "~/components/Navbtn";
import { api } from "~/utils/api";
import { date, optional } from "zod";

const budget = () => {
  const ctx = api.useContext();

  const [selectedMonth, setSelectedMonth] = useState("");
  const [inputExpenseName, setInputExpenseName] = useState("");
  const [inputExpenseAmount, setInputExpenseAmount] = useState("");
  const [inputExpenseType, setInputExpenseType] = useState("");

  const [inputIncomeName, setInputIncomeName] = useState("");
  const [inputIncomeAmount, setInputIncomeAmount] = useState("");

  const generateDates = () => {
    const currentDate = new Date();
    console.log(currentDate);
    const currentYear = currentDate.getFullYear();
    console.log(currentYear);
    const monthIndex = new Date(`${selectedMonth}, ${currentYear}`).getMonth();
    console.log(monthIndex);

    const startDate = new Date(currentYear, monthIndex - 1, 14);
    const endDate = new Date(currentYear, monthIndex, 15);

    return { startDate, endDate };
  };

  const { startDate, endDate } = generateDates();

  const { data: monthBudget } = api.example.getIncomeMonthly.useQuery({
    startDate,
    endDate,
  });
  const totalMonthlyBudget =
    monthBudget?.[0]?._sum.transactionAmount?.toString() || 0;

  const { data: currentExpense } = api.example.getExpenseMonthly.useQuery({
    startDate,
    endDate,
  });
  const totalMonthlyExpense =
    currentExpense?.[0]?._sum.transactionAmount?.toString() || 0;

  const { data: currentNeeds } = api.example.getNeedsMonthly.useQuery({
    startDate,
    endDate,
  });
  const totalMonthlyNeeds =
    currentNeeds?.[0]?._sum.transactionAmount?.toString() || 0;

  const { data: currentWants } = api.example.getWantsMonthly.useQuery({
    startDate,
    endDate,
  });
  const totalMonthlyWants =
    currentWants?.[0]?._sum.transactionAmount?.toString() || 0;

  const { data: currentSavings } = api.example.getSavingsMonthly.useQuery({
    startDate,
    endDate,
  });
  const totalMonthlySavings =
    currentSavings?.[0]?._sum.transactionAmount?.toString() || 0;

  const { data } = api.example.getAllExpenses.useQuery({ startDate, endDate });
  const expenses  = api.example.getAllIncome.useQuery({startDate, endDate })
  const toSelectDates = api.example.getAllMonths.useQuery();

  const currentBudget =
    Number(totalMonthlyBudget) - Number(totalMonthlyExpense);
  const percentBudget =
    (Number(currentBudget) / Number(totalMonthlyBudget)) * 100;

  const budgetNeeds = Number(totalMonthlyBudget) * (50 / 100);
  const budgetWants = Number(totalMonthlyBudget) * (30 / 100);
  const budgetSavings = Number(totalMonthlyBudget) * (20 / 100);

  const percentExpenses =
    100 - (Number(currentBudget) / Number(totalMonthlyBudget)) * 100;

  const difNeeds = Number(budgetNeeds) - Number(totalMonthlyNeeds);
  const percentNeeds = (Number(totalMonthlyNeeds) / Number(budgetNeeds)) * 100;

  const difWants = Number(budgetWants) - Number(totalMonthlyWants);
  const percentWants = (Number(totalMonthlyWants) / Number(budgetWants)) * 100;

  const difSavings = Number(budgetSavings) - Number(totalMonthlySavings);
  const percentSavings = (Number(totalMonthlySavings) / Number(budgetSavings)) * 100;

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date();
  const hasData =
    ((currentExpense !== undefined ? currentExpense.length : 0) ?? 0) > 0 &&
    ((data !== undefined ? data.length : 0) ?? 0) > 0;

  const { mutate, isLoading: isPosting } =
    api.example.createTransactions.useMutation({
      onSuccess: () => {
        void ctx.example.getAllExpenses.invalidate();
        void ctx.example.getAllMonths.invalidate();
        void ctx.example.getAllIncome.invalidate();
        void ctx.example.getExpenseMonthly.invalidate();
        void ctx.example.getIncomeMonthly.invalidate();
        void ctx.example.getNeedsMonthly.invalidate();
        void ctx.example.getWantsMonthly.invalidate();
        void ctx.example.getSavingsMonthly.invalidate();
      },
    });

    const { mutate: mutateDelete } = api.example.deleteExpense.useMutation({
      onSuccess: () => {
        void ctx.example.getAllExpenses.invalidate();
        void ctx.example.getAllMonths.invalidate();
        void ctx.example.getAllIncome.invalidate();
        void ctx.example.getExpenseMonthly.invalidate();
        void ctx.example.getIncomeMonthly.invalidate();
        void ctx.example.getNeedsMonthly.invalidate();
        void ctx.example.getWantsMonthly.invalidate();
        void ctx.example.getSavingsMonthly.invalidate();
      },
    });

  return (
    <>
    <Navbtn />
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
              {" "}
              <HStack>
                <Text>Select Month</Text>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {toSelectDates.data?.map((month) => (
                    <option id={month} value={month}>
                      {month}
                    </option>
                  ))}
                </Select>
              </HStack>
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
                    value={percentBudget < 0 ? 0 : percentBudget}
                    color="whatsapp.500"
                    thickness="16px"
                    position="unset"
                  ></CircularProgress>
                  <HStack
                    display="flex"
                    justifyItems="center"
                    alignItems="center"
                  >
                    <Text alignItems="flex-end" fontWeight="bold" fontSize="20">
                      {isNaN(currentBudget) ? "0" : currentBudget}
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
                        value={percentNeeds < 0 ? 0 : percentNeeds}
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
                        {totalMonthlyNeeds}
                      </Text>
                      <Text textColor="black" fontWeight="medium">
                        / {budgetNeeds} RON
                      </Text>
                    </HStack>
                    <HStack>
                      <Text textColor="gray.500" fontSize={12}>
                        Ramas : {difNeeds} RON
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
                        value={percentWants < 0 ? 0 : percentWants}
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
                        {totalMonthlyWants}
                      </Text>
                      <Text textColor="black" fontWeight="medium">
                        / {budgetWants} RON
                      </Text>
                    </HStack>
                    <HStack>
                      <Text textColor="gray.500" fontSize={12}>
                        Ramas : {difWants.toFixed(1)} RON
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
                        value={percentSavings < 0 ? 0 : percentSavings}
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
                        {totalMonthlySavings}
                      </Text>
                      <Text textColor="black" fontWeight="medium">
                        / {budgetSavings} RON
                      </Text>
                    </HStack>
                    <HStack>
                      <Text textColor="gray.500" fontSize={12}>
                        Ramas : {difSavings} RON
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
            <CardBody >
              <Stack spacing={4} position="unset">
                <Flex justifyContent="flex-end">
                  <Box ml="3" justifyItems="flex-start" position="unset">
                    {hasData ? (
                      <Text >
                        Total expenses
                        <Badge fontSize="1em" ml={1} colorScheme="red">
                          {totalMonthlyExpense} RON
                        </Badge>
                      </Text>
                    ) : (
                      <Text> No expenses! </Text>
                    )}
                  </Box>
                </Flex>
                <Progress
                  position="unset"
                  hasStripe
                  colorScheme="red"
                  value={
                    percentExpenses !== percentExpenses ? 0 : percentExpenses
                  }
                />
                <Box position="relative" padding={4}>
                  <Divider />
                  <Stack position="unset">
                  <AbsoluteCenter position="unset" bg="white" px="4">
                    Add Expenses:
                  </AbsoluteCenter>
                  </Stack>
                </Box>
                <Flex direction="row" justifyContent="center">
                  <Text fontSize={14} variant="outline">
                    Expense Name
                  </Text>
                  <Input
                    focusBorderColor="black"
                    value={inputExpenseName}
                    onChange={(e) => setInputExpenseName(e.target.value)}
                  />
                </Flex>
                <Flex direction="row">
                  <Text fontSize={14} variant="outline">
                    Expense Amount
                  </Text>
                  <Input
                    type="number"
                    focusBorderColor="black"
                    value={inputExpenseAmount}
                    onChange={(e) => setInputExpenseAmount(e.target.value)}
                  />
                </Flex>
                <Flex>
                  <Text fontSize={14}>Expense Type</Text>
                  <Select
                    focusBorderColor="black"
                    value={inputExpenseType}
                    onChange={(e) => setInputExpenseType(e.target.value)}
                  >
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
                    onClick={() =>
                      mutate({
                        transactionName: inputExpenseName,
                        transactionAmount: Number(inputExpenseAmount),
                        transactionTag: inputExpenseType,
                        transactionMonth: `${month[new Date().getMonth()]} - ${
                          month[new Date().getMonth() + 1]
                        }`,
                        transactionType: "Expense",
                        transactionAt: new Date(),
                      })
                    }
                  >
                    Add Expense
                  </Button>
                </Flex>
                <Box position="relative" padding={4}>
                  <Divider />
                  <AbsoluteCenter bg="white" px="4">
                    Expenses List:
                  </AbsoluteCenter>
                </Box>
                {hasData ? (
                  <Stack divider={<StackDivider />} spacing="3">
                    {data?.map((budget) => (
                      <div key={budget.transactionId}>
                        <HStack
                          justifyContent="space-between"
                          textAlign="center"
                        >
                          <Text textColor="black" fontWeight="medium">
                            {budget.transactionName}
                          </Text>
                          <Text textColor="gray.500">
                            {budget.transactionAmount} RON
                          </Text>
                          <Badge
                            colorScheme={
                              budget.transactionTag === "Needs"
                                ? "red"
                                : budget.transactionTag === "Wants"
                                ? "orange"
                                : budget.transactionTag === "Savings"
                                ? "green"
                                : "gray"
                            }
                          >
                            {budget.transactionTag}
                          </Badge>
                          <Text textColor="gray.500">
                            {budget.transactionAt.toDateString()}
                          </Text>
                          <Button position="unset" backgroundColor="white" onClick={()=>mutateDelete(budget.transactionId)}>
                            <DeleteIcon position="unset" textColor="#e9041e" />
                          </Button>
                        </HStack>
                      </div>
                    ))}
                  </Stack>
                ) : (
                  <Text> No expenses! </Text>
                )}
              </Stack>
            </CardBody>
          </Card>
          <Card position="unset">
            <CardHeader
              paddingTop="20px"
              paddingBottom={0}
              paddingLeft="20px"
              paddingRight="20px"
            >
              <Heading fontSize="md">Monthly Income</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Flex justifyContent="flex-end">
                  <Box ml="3" justifyItems="flex-start">
                    {hasData ? (
                      <Text>
                        Income remaning
                        <Badge fontSize="1em" ml={1} colorScheme="green">
                          {Number(totalMonthlyBudget) - Number(totalMonthlyExpense)} RON
                        </Badge>
                      </Text>
                    ) : (
                      <Text> No income! </Text>
                    )}
                  </Box>
                </Flex>
                <Box position="relative" padding={4}>
                  <Divider />
                  <AbsoluteCenter bg="white" px="4">
                    Add Income:
                  </AbsoluteCenter>
                </Box>
                <Flex direction="row" justifyContent="center">
                  <Text fontSize={14} variant="outline">
                    Income Name
                  </Text>
                  <Input
                    focusBorderColor="black"
                    value={inputIncomeName}
                    onChange={(e) => setInputIncomeName(e.target.value)}
                  />
                </Flex>
                <Flex direction="row">
                  <Text fontSize={14} variant="outline">
                    Income Amount
                  </Text>
                  <Input
                    type="number"
                    focusBorderColor="black"
                    value={inputIncomeAmount}
                    onChange={(e) => setInputIncomeAmount(e.target.value)}
                  />
                </Flex>
                <Flex>
                  <Button
                    width="100vh"
                    backgroundColor="#e9041e"
                    textColor="white"
                    type="submit"
                    onClick={() =>
                      mutate({
                        transactionName: inputIncomeName,
                        transactionAmount: Number(inputIncomeAmount),
                        transactionTag: "",
                        transactionMonth: `${month[new Date().getMonth()]} - ${
                          month[new Date().getMonth() + 1]
                        }`,
                        transactionType: "Income",
                        transactionAt: new Date(),
                      })
                    }
                  >
                    Add Income
                  </Button>
                </Flex>
                <Box position="relative" padding={4}>
                  <Divider />
                  <AbsoluteCenter bg="white" px="4">
                    Incomes List:
                  </AbsoluteCenter>
                </Box>
                {hasData ? (
                  <Stack divider={<StackDivider />} spacing="3">
                    {expenses.data?.map((budget) => (
                      <div key={budget.transactionId}>
                        <HStack
                          justifyContent="space-between"
                          textAlign="center"
                        >
                          <Text textColor="black" fontWeight="medium">
                            {budget.transactionName}
                          </Text>
                          <Text textColor="gray.500">
                            {budget.transactionAmount} RON
                          </Text>
                          <Badge
                            colorScheme={
                              budget.transactionTag === "Needs"
                                ? "red"
                                : budget.transactionTag === "Wants"
                                ? "orange"
                                : budget.transactionTag === "Savings"
                                ? "green"
                                : "gray"
                            }
                          >
                            {budget.transactionTag}
                          </Badge>
                          <Text textColor="gray.500">
                            {budget.transactionAt.toDateString()}
                          </Text>
                          <Button position="unset" backgroundColor="white" onClick={()=>mutateDelete(budget.transactionId)}>
                            <DeleteIcon position="unset" textColor="#e9041e" />
                          </Button>
                        </HStack>
                      </div>
                    ))}
                  </Stack>
                ) : (
                  <Text> No income! </Text>
                )}
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
