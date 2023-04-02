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

    console.log('Live info', infoUfVal)

    res.status(200).json({ infoUfVal, infoFoName })
}

export default getInfo