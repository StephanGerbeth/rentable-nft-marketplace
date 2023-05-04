const { AutotaskClient } = require('defender-autotask-client');
const dotenv = require('dotenv');

dotenv.config();

async function uploadCode(autotaskId, apiKey, apiSecret) {    
    const client = new AutotaskClient({ apiKey, apiSecret });
    await client.updateCodeFromFolder(autotaskId, './build/relay/');
}

async function main() {  
    await uploadCode(process.env.DEFENDER_AUTOTASK_ID, process.env.DEFENDER_TEAM_API_KEY, process.env.DEFENDER_TEAM_SECRET_KEY);
    console.log(`Code updated`);
}

(async () => {
    try {
        await main()
        process.exit(0)
    }
    catch(error) { 
        console.error(error); 
        process.exit(1); 
    };
})();

