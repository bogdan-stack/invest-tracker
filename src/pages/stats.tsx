import {
  Heading,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  HStack,
  Stack,
} from "@chakra-ui/react";

type StatsPageProps = {
  totalSim: string | undefined;
  totalUfSim: string | undefined;
  totalAct: string | undefined;
  totalUfAct: string | undefined;
  infoUfVal: string;
  infoUfVal2: string;
};

export const StatsPage = ({totalSim, totalUfSim, totalAct, totalUfAct, infoUfVal, infoUfVal2}: StatsPageProps) => {
const totalInvestAct =  totalUfAct ? Number(parseFloat(totalUfAct)) * Number(parseFloat(infoUfVal)) : 0;
const profitAct = totalUfAct && totalAct ? totalInvestAct - Number(totalAct) : 0;

const totalInvestSim =  totalUfSim ? Number(parseFloat(totalUfSim)) * Number(parseFloat(infoUfVal2)) : 0;
const profitSim = totalUfSim && totalAct ? totalInvestSim - Number(totalSim) : 0;

const procentProfit = totalSim && totalAct ? (totalInvestAct + totalInvestSim) / (Number(totalAct) + Number(totalSim)) : 0;
const profitTotal = profitAct + profitSim;


  return (
    <div>
      <Stack spacing={3}>
        <VStack spacing={3}>
          <Heading fontSize="2xl">BRD Investment Tracker</Heading>
        </VStack>
        <HStack justifyContent="center">
          <StatGroup>
            <Stat textAlign="center">
              <StatLabel>Profit Portofoliu</StatLabel>
              <StatNumber>{profitTotal.toFixed(2).toString()} RON</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {procentProfit.toFixed(2).toString()}%
              </StatHelpText>
            </Stat>
          </StatGroup>
        </HStack>
      </Stack>
    </div>
  );
};
