const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const bodyParser = require('body-parser');
require('./config/connect');
const nodemailer = require('nodemailer');
const https = require('https');

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8lahGFAiWuleK
1hZ9oCSI05rXazYaOcjl5iMYrgxFfv+j2IWftInVVFCcAt4hmrn57hNkb53aorHQ
X3WE8hWAmbMCfZ7By2PmJy9g6y8xvznPRfIhH/AdUeH6g8C3lYrn6mk47VsvQU8H
l0zU1EIruuipAH4cjL3J/Ppk4TIA8oM13CmUDniAA1CD6XrcCFFOTfwxF1iYrDjR
kM1Mk4PMkvNkTzYddZgpV3+sMAqnd+zvRv2LJgYSGeuGvTmhebVn9Sh5mDt+fyiT
qvLwYbroiL7B5LRtDZIz4k91YGacPsPIxig0JzovbDTpiVwTZ4c7DyoLhrBNfxvh
9/Q7Cn6tAgMBAAECggEATQY1OhYxodqPKeoiOoI/mdEPs7+a0+BZISk7mXdxFKt3
32Ruw1maWFL9L5NuRbxsDFxEeGesSiHcTXbHyZqU1LcyKajEQHQBo/3KOKQmXQO1
KWbwq73fNSJ+EXNhsbn3B50zB+jOLwFWNYwC+gSN2E2ZfHlyiNelJsxYOv7NjRvM
UB9ygQMJjjWlkhBbsJU9k7S6ysvEAqn1leF5yrNOoMU1VHtPuWfEvHWaeUxJ3lpz
lRu02Qrj7barX6Qvq0UMdvqIZbUgGIv4Y7UE8tv7Oupf+B8CKyYEmIbxdQEpFFXF
ejAjTQsj8rAUD2Vz8NdtrujT+a1+vuWLWfOphjmBcwKBgQDpljfKGrvT9b6J8EeH
6T0FQkQO0Dac6fOWKrlJrcnr2mCDam4BzB2kHvzr9wsTT7c4RWLeChgWFQJExkmo
mG7sgmE/qnPyPFx/dCilwVhM4EaGUiPevOd0NvCgQaQvj6fpHSitOylnamSgI4fZ
5y0dqb8eOuB3OPg8HixN50yOYwKBgQDOrgOYFSkNwlM9AimdSSMZ4p1oC0CVcTKG
KZ84QWtpF5QvAwzRemuZ0CKvwl+a8fiqEjS1V9isBHhOtXnyizkV+LNgKKPRKKgd
ckLOQikPtIMOB9BOZYQFqXmuqsGLy1xNJ5hIU1nnbd6Mx0D8OAbDPCROmqIPA8I4
WFm3SO4DrwKBgHYp8KUDqxrJiQ78hyMA4UaExCr+N3Jfg0Lm7/6OtMPkH8i7EVVF
bYU1y9qOiYLGY7hKmX4bex3ImPIzoNVx70MjnZB4aNkUofIzz9AyI7oYBnUynkSy
KSAIHufi7OzGbjml74raj9Jp5ud/sdyQbqk/0pe3Tw/guOqolN7/8CFjAoGAH8Nu
mfjmjk7HLCEg9CNBWcESH+Na0ZzL/wJ2jdbAAy60f2UgmzENSF5MdmaQ+uclKD4U
C6qsigNF2hLZ4wSyiUXni2ezhXmSHLRqv/g7B0bevVFGGkZPu+8H3GgxxqJCVTk4
liT5NDAWe9xDiH+zyl171vi830Hcn3w0jY6PxdECgYEAsLagQe8W0Y4YoIGs0h+O
+LFrddyAxwuaOLTqwKesUIi3xKErGiUy1rojJB4rPXdPtN1nMigSPjTbXW77InIs
Rptu+m1JnLxiBmmBa5bcFOGMtf8kJ7QgABOtgob+W6DC4a8CdiEVBnrdRZ6JcP/G
04KsRrI3WIVgmwN3lQiXjuI=
-----END PRIVATE KEY-----`;

const certificate = `-----BEGIN CERTIFICATE-----
MIIDpTCCAo2gAwIBAgIUaREVYqyV8citq3ThY8Vp22m6GkkwDQYJKoZIhvcNAQEL
BQAwezELMAkGA1UEBhMCYWIxFDASBgNVBAgMC25hYmlsIGtvdWtpMQ0wCwYDVQQH
DARiZWphMQwwCgYDVQQKDANwZmUxEjAQBgNVBAMMCWxvY2FsaG9zdDElMCMGCSqG
SIb3DQEJARYWa291a2luYWJpbDczQGdtYWlsLmNvbTAeFw0yNDA3MDkyMjUxNTVa
Fw0yNTA3MDkyMjUxNTVaMHsxCzAJBgNVBAYTAmFiMRQwEgYDVQQIDAtuYWJpbCBr
b3VraTENMAsGA1UEBwwEYmVqYTEMMAoGA1UECgwDcGZlMRIwEAYDVQQDDAlsb2Nh
bGhvc3QxJTAjBgkqhkiG9w0BCQEWFmtvdWtpbmFiaWw3M0BnbWFpbC5jb20wggEi
MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC8lahGFAiWuleK1hZ9oCSI05rX
azYaOcjl5iMYrgxFfv+j2IWftInVVFCcAt4hmrn57hNkb53aorHQX3WE8hWAmbMC
fZ7By2PmJy9g6y8xvznPRfIhH/AdUeH6g8C3lYrn6mk47VsvQU8Hl0zU1EIruuip
AH4cjL3J/Ppk4TIA8oM13CmUDniAA1CD6XrcCFFOTfwxF1iYrDjRkM1Mk4PMkvNk
TzYddZgpV3+sMAqnd+zvRv2LJgYSGeuGvTmhebVn9Sh5mDt+fyiTqvLwYbroiL7B
5LRtDZIz4k91YGacPsPIxig0JzovbDTpiVwTZ4c7DyoLhrBNfxvh9/Q7Cn6tAgMB
AAGjITAfMB0GA1UdDgQWBBQMyCnnDVCW47LXaZ3ZNS0vHgerKjANBgkqhkiG9w0B
AQsFAAOCAQEAUx/2qSSZRSMFNgfDY6EOAPEwTMPjf4gDeUAL5NGraMogSr2POO++
azwGaRKIQbUn+xeZIM1PW1IX1eQ6HdLIod+GibEaBLNVh+NfPVE5XefBdyNJanxr
766FBgv81m9ixk+k3ny13aByYZOSM8YPRNoksV5i0Hpgads/tPrVS+glxjyxmyjr
+w52wOzDao+qsa9CGe4zYHgX5ra4PutWmcvUpM/ljVO58d29RA8lKvMwGtKxvT6D
H5Jb1BT8zWMamGCn5+ifdRl/M6RxWFGjndqo5hkflbssK89JeGQoFpVUFnLvGHPk
XTsAzFJBEDtukiTUAbRW5xX7wFz/E8C67g==
-----END CERTIFICATE-----
`;

const options = {
  key: privateKey,
  cert: certificate
};
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Your routes go here
app.use('/uploads',express.static('./uploads'))
const AccountRoute = require('./routes/account');
app.use('/account', AccountRoute);
const userRoute = require('./routes/user');
const productRoute = require('./routes/product')
app.use('/user', userRoute);
app.use('/product',productRoute)
const server = https.createServer(options, app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
