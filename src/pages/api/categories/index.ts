import type { NextApiRequest, NextApiResponse } from "next";
//import nc from "next-connect";
import { createRouter } from "next-connect";

import { prisma } from "../../../lib/prisma";
import { TApiAllCategoriesResp, TApiErrorResp } from "../../../types";

const router = createRouter<NextApiRequest, NextApiResponse>();

const getCategories = async (
  _req: NextApiRequest,
  res: NextApiResponse<TApiAllCategoriesResp | TApiErrorResp>
) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        products: {
          orderBy: {
            createdAt: "desc",
          },
          take: 8,
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!! Please try again after sometime",
    });
  }
};

router.get(getCategories);

//const handler = nc({ attachParams: true }).get(getCategories);

export default router.handler({
  onError: (err, req, res) => {
    console.log(err);
  },
});
