import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.end(`Home or / Page`);
});

export default app;