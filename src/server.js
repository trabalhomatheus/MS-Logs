require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const mongoose = require('mongoose');

const PROTO_PATH = path.join(__dirname, 'proto', 'logs.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  json: true
});
const logsProto = grpc.loadPackageDefinition(packageDefinition).logs;

const logsService = require('./services/logsService');

console.log("Conectando ao MongoDB...");
console.log(process.env.MONGO_URI);

async function main() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        readPreference: 'secondaryPreferred'
    });

    const server = new grpc.Server();
    server.addService(logsProto.Logs.service, logsService);

    const port = 50051;
    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(`Server running at http://0.0.0.0:${port}`);
        server.start();
    });
}

main();