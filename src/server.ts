import cluster from 'cluster';
import os from 'os';
import 'dotenv/config';
import app from './app';
import AuthRouter from './routes/auth.route';

const Server = () => {
  if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;

    console.log(`Primary - ${process.pid}`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  }
  else {
    const port = process.env.PORT || 8000

    app.use('/auth', AuthRouter);
    
    app.listen(port, () => {
      console.log(`server is running on port ${port} with worker - ${process.pid}`);
    });
  }
}

export default Server;