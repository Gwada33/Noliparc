import { Client } from 'pg';
import fs from 'fs';

const ca = `-----BEGIN CERTIFICATE-----
MIIETTCCArWgAwIBAgIULdzqkusi83cY2Cz1XkHb3TQX5icwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1OGM3ZDk0ZDItM2Q4MS00OGY3LWIxOTItYmRjNjdmYmM3
YTQxIEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwNTI3MjI1MjE5WhcNMzUwNTI1MjI1
MjE5WjBAMT4wPAYDVQQDDDU4YzdkOTRkMi0zZDgxLTQ4ZjctYjE5Mi1iZGM2N2Zi
YzdhNDEgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBANY8jipiy8hPkq3TV+3Jzr6a93+AW/FSfWHy5QBj3XtolFKAVefkEEz7
USREDdfm01LzxLGm5YCi/vKStHfpq1t4Y9jAjpxXdV711xSs/XRe0qddWeYZQrMS
qgYv7WgXwy8J8oVm4dKg5MQKG3TZReC1AygLDyjHCjeq/BvAZzIl+2G9TmoJFfBo
3LAFJF6SUltGnqN8JYLvouOaNPMadYJEAtMkwhUjyXTWN8kF4aMw1Wksa+tfcEeN
7i92tZO+WFpvnMQhSusRxTjs6ZHJK5e4rxHBhSVtVy4oGFxeVfNJcJIZge1M4LeI
2I7J60FPUBHHLn753HZ+kDlMkvGwfsoNu9jmYyDFo8PTAqU8fQDuy9N7fupO8E+8
FF4ngj19oxcWHeQeanIs/8fkueTMt+6PzMvjqPTyFu1aJQhwMaNetMt1ailFfGjn
9sZNBBZNl0jTX7RjiYFbp+1H8/WTBwxpj1A0t+1MODW24VO8d84nA+VdoelY2l5m
KuTsqHSgUwIDAQABoz8wPTAdBgNVHQ4EFgQU7aqdOK0tokLtNI+DjQfH9t23hqEw
DwYDVR0TBAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGB
AERwZXwb07yzg/6xZ60idEKhirn/4VcGnE/DeJ2BgoRZikvtyOniXrTxwu1dCuda
vOGi1/eyHWgsRRYHk7VN8cw/qgtrMfP3YdtLGiNE004QVWlKtJIBzafkvkBWadsg
SUGvTKAyuXdg0Err+qa2/X62KNBLx0E2UKPqjcCAVc484lfz+aYKCfWPwzpKGZzo
TvT4IE78FCFGnkXlKQe2ifrO6XBYhyknmgZGgeNrMBTQhhDH3UB+lcWgvyKcN+Ac
Tg6cqq0w0JcdBgXbsowvwco92Xf6kZCEQ+Eh7O+tjqls3RyU02LKtQigmah42UQM
mDIahe3fUrbddwL0zPpG0Ja1gqhbt3s4rQtgnLkhyKDmEZKiSVwzxPq7A+rXUNgK
38gb0r4a84TWKQBfRyl/dhJ8+Oc5k8p0DKVoq29oAg1d3Me7/a0lNh7dqKG+e3/E
Cg1lnZW36Gr6XjyrwNjxiRKOwLVvHID//q1JH+EDIUQxnfTGoFfh0NlVqp2iBRW3
bw==
-----END CERTIFICATE-----
`

export const client = new Client({
  connectionString: process.env.DATABASE_URL, // ex: 'postgresql://user:pass@host:5432/dbname'
  ssl: {
    rejectUnauthorized: true, // sécurise la connexion en vérifiant le certificat du serveur
    ca: ca, // charge le certificat CA
  },
});

client.connect()
  .then(() => console.log('Connecté à la base PostgreSQL'))
  .catch((err) => console.error('Erreur de connexion à PostgreSQL', err));
