const hashManager = require('./passwordHasher');

async function getPublicKey() {
    try {
        const response = await fetch('https://www.facebook.com/', {
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'vi-VN,vi;q=0.9',
                'cache-control': 'max-age=0',
                'dpr': '2',
                'sec-ch-prefers-color-scheme': 'light',
                'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'sec-ch-ua-full-version-list': '"Google Chrome";v="123.0.6312.122", "Not:A-Brand";v="8.0.0.0", "Chromium";v="123.0.6312.122"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-model': '""',
                'sec-ch-ua-platform': '"macOS"',
                'sec-ch-ua-platform-version': '"14.3.1"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'viewport-width': '2072'
            }
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        const text = await response.text();

        const publicKeyMatch = RegExp(/"publicKey":"(.*?)"/).exec(text);
        const keyIdMatch = RegExp(/"keyId":(\d+)/).exec(text); 

        if (publicKeyMatch && keyIdMatch) {
            const publicKey = publicKeyMatch[1];
            const keyId = keyIdMatch[1];
           return { publicKey, keyId };
        } else {
            console.log("No public key or key ID found.");
        }
    } catch (error) {
        console.error("Error fetching public key:", error);
    }
}


async function hashPassword() {

    const currentTime = Math.floor(Date.now() / 1e3).toString();
    const password = 'rDfrUyAb5V74';
    try {
        const publicKeyData = await getPublicKey();
        const hashedPassword = await hashManager(publicKeyData, currentTime, password);
        console.log("Hashed Password:", `#PWD_BROWSER:5:${currentTime}:${hashedPassword}`);
    } catch (error) {
        console.error("Error hashing password:", error);
    }
}

hashPassword();