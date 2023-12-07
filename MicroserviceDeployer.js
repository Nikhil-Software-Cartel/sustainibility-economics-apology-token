const { execSync } = require('child_process');

// Define the list of microservices to deploy
const microservices = [
    { name: 'microservice1', port: 3000 },
    { name: 'microservice2', port: 4000 },
    // Add more microservices as needed
];

// Define the SSH connection information
const sshUser = 'root';
const sshHost = '192.168.1.1'; // replace with machine ip
const sshKeyPath = './sshkey';

// Deploy each microservice
async function deployMicroservices() {
    try {
        // Connect to the remote machine
        const sshCommand = `ssh -i ${sshKeyPath} ${sshUser}@${sshHost}`;
        execSync(sshCommand);

        // Loop through each microservice
        for (const microservice of microservices) {
            console.log(`Deploying ${microservice.name}`);

            // Build the microservice
            console.log(`Building ${microservice.name}`);
            const buildCommand = `cd /path/to/microservices/${microservice.name} && npm ci`;
            execSync(`${sshCommand} "${buildCommand}"`);

            // Start the microservice using PM2
            console.log(`Starting ${microservice.name}`);
            const startCommand = `cd /path/to/microservices/${microservice.name} && pm2 start npm --name "${microservice.name}" -- start -- --port ${microservice.port}`;
            execSync(`${sshCommand} "${startCommand}"`);

            console.log(`${microservice.name} deployed and started`);
        }

        console.log('All microservices deployed and started successfully');
    } catch (error) {
        console.error('Deployment failed:', error);
    }
}

deployMicroservices();
