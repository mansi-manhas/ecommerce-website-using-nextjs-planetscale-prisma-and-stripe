import currency from "currency.js";
import type { NextApiRequest, NextApiResponse } from "next";
//import nc from "next-connect";
import { createRouter } from "next-connect";

import { stripeServerSide } from "../../lib/stripe";
import { TApiErrorResp } from "../../types";

const router = createRouter<NextApiRequest, NextApiResponse>();


const checkoutSession = async (
    req: NextApiRequest,
    res: NextApiResponse<any | TApiErrorResp>
) => {
    try {
        debugger;
        const host = req.headers.origin;
        const referer = req.headers.referer;
        const body = JSON.parse(req.body);
        const formatedPrice = currency(body.price, {
            precision: 2,
            symbol: "",
        }).multiply(100);
        const session = await stripeServerSide.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: body?.title,
                            images: [body.image],
                            description: body?.description,
                        },
                        unit_amount_decimal: formatedPrice.toString(),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${host}/thank-you`,
            cancel_url: `${referer}?status=cancel`,
        });
        return res.status(200).json({ id: session.id });
    } catch (error) {
        console.log('this is the error', error);
        return res.status(500).json({
            message: "Something went wrong!! Please try again after sometime",
        });
    }
};

router.post(checkoutSession);

export default router.handler({
    onError: (err, req, res) => {
      console.log(err);
    },
  });


// const handler = nc({ attachParams: true }).post(checkoutSession);

// export default handler;