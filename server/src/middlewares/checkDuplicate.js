import prisma from "../config/prismaClient.js";

export const checkDuplicate = (model, uniqueField) => {
  return async (req, res, next) => {
    const value = req.body[uniqueField];
    const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

    try {
      // check whether data with unique values ​​already exists
      const existingRecord = await prisma[model].findUnique({
        where: {
          [uniqueField]: value,
        },
      });

      // returning error message, if data already exists
      if (existingRecord) {
        return res.status(400).json({
          message: `${capitalize(uniqueField)} already exists.`,
        });
      }
      next();
    } catch (error) {
      res.status(500).json({
        message: "Server error during duplicate check",
        error: error.message,
      });
    }
  };
};
