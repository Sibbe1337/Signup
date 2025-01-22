exports.handler = async (event) => {
    const { email } = JSON.parse(event.body);
    
    try {
        const response = await fetch('https://us7.api.mailchimp.com/3.0/lists/6e7521f3b5/members', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`anystring:${process.env.MAILCHIMP_API_KEY}`).toString('base64')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_address: email,
                status: 'subscribed'
            })
        });
        
        const data = await response.json();
        return {
            statusCode: response.ok ? 200 : 400,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
}; 