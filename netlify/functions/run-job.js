const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Only POST allowed" };

    try {
        const { script, userId } = JSON.parse(event.body);
        const { GH_OWNER, GH_REPO, GH_TOKEN } = process.env;

        await axios.post(
            `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/dispatches`,
            {
                event_type: "run-live-script",
                client_payload: { script_code: script, user_id: userId }
            },
            {
                headers: {
                    'Authorization': `Bearer ${GH_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        return { statusCode: 200, body: JSON.stringify({ message: "Action Triggered" }) };
    } catch (error) {
        return { statusCode: 500, body: error.message };
    }
};
