/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const getInfo = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = await fetch('http://www.aaf.ro/fonduri-deschise/')
    const html = await response.text()

    const dom = new JSDOM(html)
    const document = dom.window.document

    const infoUfVal = document.querySelector('.rownr25 .valoare_unitara').textContent
    const infoFoName = document.querySelector('.rownr25 .denumirefond').textContent

    const infoFoName2 = document.querySelector('.rownr182 .denumirefond').textContent
    const infoUfVal2 = document.querySelector('.rownr182 .valoare_unitara').textContent

    console.log('Live info', infoUfVal)

    res.status(200).json({ infoUfVal, infoFoName, infoFoName2, infoUfVal2 })
}

export default getInfo