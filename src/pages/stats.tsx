/* eslint-disable */
/* elint-disable */
import React from "react";
import {
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
import Image from 'next/image';
import BRDlogoAM from "../../public/ico_logo-mob.svg";
import { motion } from "framer-motion";

type StatsPageProps = {
  totalSim: string | undefined;
  totalUfSim: string | undefined;
  totalAct: string | undefined;
  totalUfAct: string | undefined;
  infoUfVal: string;
  infoUfVal2: string;
};

const StatsPage = ({totalSim, totalUfSim, totalAct, totalUfAct, infoUfVal, infoUfVal2}: StatsPageProps) => {
const totalInvestAct =  totalUfAct ? Number(parseFloat(totalUfAct)) * Number(parseFloat(infoUfVal)) : 0;
const profitAct = totalUfAct && totalAct ? totalInvestAct - Number(totalAct) : 0;

const totalInvestSim =  totalUfSim ? Number(parseFloat(totalUfSim)) * Number(parseFloat(infoUfVal2)) : 0;
const profitSim = totalUfSim && totalAct ? totalInvestSim - Number(totalSim) : 0;

const procentProfit = totalSim && totalAct ?  (Number(totalAct) + Number(totalSim))/(totalInvestAct + totalInvestSim)  : 0;

const profitTotal = profitAct + profitSim;
const procentProfitTotal = profitTotal/(Number(totalAct) + Number(totalSim))*100;

const profitSign = () => {
  if (procentProfitTotal > 0) {
    return "increase";
  } else {
    return "decrease"
  }
}

const autoSign = profitSign();




  return (
      <Stack spacing={3}>
        <VStack spacing={3} alignItems='flex-start' justifyContent='left'>
          <Image src={BRDlogoAM} alt="BRD logo" width={200} height={200} />
        </VStack>
        <HStack justifyContent="center">
          <StatGroup>
            <Stat textAlign="center">
              {infoUfVal && (
              <>
              <motion.div
              initial={{ opacity: 0, y: 15}}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ delay: 0.75 }}
              >
              <StatLabel>Profit Portofoliu</StatLabel>
              <StatNumber>{profitTotal.toFixed(2).toString()} RON</StatNumber>
              <StatHelpText>
                <StatArrow type={autoSign} />
                {procentProfitTotal.toFixed(2).toString()}%
              </StatHelpText>
              </motion.div>
              </>)}
            </Stat>
          </StatGroup>
        </HStack>
      </Stack>
  );
};

export default StatsPage;