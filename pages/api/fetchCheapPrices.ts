import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { departureAirport, arrivalAirport, date_of_travel } = req.body;
    console.log(departureAirport, arrivalAirport, date_of_travel)
    const resp = await fetch(`https://api.travelpayouts.com/v1/prices/cheap?origin=${departureAirport}&destination=${arrivalAirport}&depart_date=${date_of_travel}&currency=USD`, {
        headers: {
            'X-Access-Token': process.env.NEXT_PUBLIC_API_KEY,
        }

    });
    const flightPrice = await resp.json();
    res.status(200).json(flightPrice);
}
