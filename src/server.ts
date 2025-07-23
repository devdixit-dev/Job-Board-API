import cluster from 'cluster';
import os from 'os';
import 'dotenv/config';
import app from './app';

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
    app;
  }
}

export default Server;