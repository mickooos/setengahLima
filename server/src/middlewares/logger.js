export const logger = (req, res, next) => {
  const currentDate = new Date().toLocaleString();
  console.log(`[${currentDate}] ${req.method} ${req.url}`);

  // console.log('Headers:', JSON.stringify(req.headers, null, 2));

  // if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
  //   console.log('Body:', JSON.stringify(req.body, null, 2));
  // }
  next();
};
