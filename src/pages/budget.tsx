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
} from "@chakra-ui/react";
import React from "react";
import Footer from "~/components/Footer";
import { api } from "~/utils/api";

const budget = () => {
  const { data: monthBudget } = api.example.getIncomeMonthly.useQuery();
  const totalMonthlyBudget =
    monthBudget?.[0]?._sum.transactionAmount?.toString();

  const { data: currentExpense } = api.example.getExpenseMonthly.useQuery();
  const totalMonthlyExpense =
    currentExpense?.[0]?._sum.transactionAmount?.toString();

  const currentBudget =
    Number(totalMonthlyBudget) - Number(totalMonthlyExpense);
  const percentBudget =
    (Number(currentBudget) / Number(totalMonthlyBudget)) * 100;

  const budgetNeeds = Number(totalMonthlyBudget) * (50 / 100);
  const budgetWants = Number(totalMonthlyBudget) * (30 / 100);
  const budgetSavings = Number(totalMonthlyBudget) * (20 / 100);

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
                  >
                    <CircularProgressLabel fontWeight="bold" fontSize={16}>
                      {percentBudget.toFixed(2)} %{" "}
                    </CircularProgressLabel>
                  </CircularProgress>
                  <HStack
                    display="flex"
                    justifyItems="center"
                    alignItems="center"
                  >
                    <Text
                      alignItems="flex-end"
                      fontWeight="bold"
                      fontSize="2xl"
                    >
                      {currentBudget}
                    </Text>
                    <Text alignItems="flex-end" fontWeight="normal" fontSize="md">
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
                  <VStack display="flex"
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
                    <Text textColor="red" fontWeight="semibold">
                      2300
                    </Text>
                    <Text textColor="red" fontWeight="medium">
                      / {budgetNeeds} RON
                    </Text>
                    </HStack>
                  </VStack>
                  <VStack display="flex"
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
                    <Text textColor="orange" fontWeight="semibold">
                      2300
                    </Text>
                    <Text textColor="orange" fontWeight="medium">
                      / {budgetWants} RON
                    </Text>
                    </HStack>
                  </VStack>
                  <VStack display="flex"
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
                    <Text textColor="whatsapp.500" fontWeight="semibold">
                      2300
                    </Text>
                    <Text textColor="whatsapp.500" fontWeight="medium">
                      / {budgetSavings} RON
                    </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </Stack>
      </Stack>
      <Footer />
    </>
  );
};

export default budget;
