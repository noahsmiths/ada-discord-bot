require('dotenv').config();

const TokenAPIs = require('./src/TokenAPIs');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] });

const updateData = async () => {
    let updateChannel;

    try {
        updateChannel = await client.channels.fetch(process.env.MESSAGE_CHANNEL);
    } catch (e) {
        console.log('Issue finding channel in discord');
    }

    try {
        let paviaData = await TokenAPIs.getTokenByPolicyMuesliswap('884892bcdc360bcef87d6b3f806e7f9cd5ac30d999d49970e7a903ae.PAVIA');
        let poolData = await TokenAPIs.getPoolPM();
        let date = new Date();

        updateChannel.messages.edit(process.env.MESSAGE_ID,
            {
                embeds: [
                    {
                        color: 13229,
                        fields: [
                            {
                                name: "Chain Load:",
                                value: `5m: ${(poolData.load_5m * 100).toFixed(1)}%\n1hr: ${(poolData.load_1h * 100).toFixed(1)}%\n24hr: ${(poolData.load_24h * 100).toFixed(1)}%`, //Rounds data to 1 decimal place
                                inline: true
                            },
                            {
                                name: "Token Prices:",
                                value: `ADA Price: $${poolData.ADAUSD}\nPavia: ${paviaData.price_change_dict.priceADA.toFixed(6)} ADA`,
                                inline: true
                            }
                        ],
                        author: {
                            name: "ADA Info Bot"
                        },
                        footer: {
                            text: `Updated at ${date.toLocaleString('en-US', {timeZone: 'America/New_York'})}`
                        }
                    }
                ]
            }
        );

    } catch (e) {
        updateChannel.send(`Error.\n${e}`);
    }

    setTimeout(updateData, process.env.REFRESH_INTERVAL_MS);
}

client.on('ready', async () => {
    let updateChannel = await client.channels.fetch(process.env.MESSAGE_CHANNEL);

    try {
        await updateChannel.messages.fetch(process.env.MESSAGE_ID);
        updateData();
    } catch (e) {
        let firstMessage = await updateChannel.send({embeds: [{title: "Loading ID..."}]});
        await firstMessage.edit(
            {
                "embeds": [
                    {
                        "title": "Edit the following field in your .env file:",
                        "description": `MESSAGE_ID=${firstMessage.id}`,
                        "color": null
                    }
                ]
            }
        );
        console.log("Read the message the bot just send and edit your .env accordingly.");
        process.exit();
    }

    //let updateChannel = await client.channels.fetch(process.env.MESSAGE_CHANNEL);
    //updateChannel.messages.edit(process.env.MESSAGE_ID, null);
    //console.log();
    // updateChannel.send({embeds: [{title: "test"}]});
    //let message = await updateChannel.messages.fetch(process.env.MESSAGE_ID);
    //message.edit("hello");
    //updateChannel.send('First Message');
    
});

client.login(process.env.DISCORD_TOKEN);