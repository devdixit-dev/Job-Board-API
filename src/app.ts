import express from 'express';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.end(`Home or / Page`);
});

app.listen(port, () => {
  console.log(`server is running on port ${port} with worker - ${process.pid}`);
});

export default app;