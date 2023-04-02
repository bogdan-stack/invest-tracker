import { NextApiRequest, NextApiResponse } from "next";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const getInfo = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = await fetch('http://www.aaf.ro/fonduri-deschise/')
    const html = await response.text()

    const dom = new JSDOM(html)
    const document = dom.window.document

    const info = document.querySelector('.rownr25').textContent

    console.log('Live info', info)
    
    res.status(200).json({ info })
}

export default getInfo