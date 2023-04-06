/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const getInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await fetch("https://www.bursa.ro/cotatii/fonduri-mutuale");
  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const divSim = document.querySelector('div[titlu_view="BRD Simfonia"]')
  let infoUfVal2 = divSim.getAttribute('cotatie_view')
  infoUfVal2 = parseFloat(infoUfVal2.replace(',','.').trim())
  const infoFoName2 = divSim.getAttribute('titlu_view')

  const divAct = document.querySelector('div[titlu_view="BRD Actiuni Clasa A"]')
  let infoUfVal = divAct.getAttribute('cotatie_view')
  infoUfVal = parseFloat(infoUfVal.replace(',','.').trim())
  const infoFoName = divAct.getAttribute('titlu_view')


  console.log("Live info", infoUfVal);

  res.status(200).json({ infoUfVal, infoFoName, infoFoName2, infoUfVal2 });
};

export default getInfo;
