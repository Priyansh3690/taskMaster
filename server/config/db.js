import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.USER_DB,
  host: process.env.HOST_DB,
  database: process.env.DB_NAME,
  password: process.env.PASSWORD_DB,
  port: process.env.DBPORT_DB,
  ssl: {
    rejectUnauthorized: true,
    ca: `-----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUW14kgDDk0dfQgMglJygF0AsoLvYwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1NmRlZjA1MmYtZTY3Ny00ZjhhLWI4NWYtMjM0OGExNDA1
NzRkIEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwOTI3MTQwMTEzWhcNMzUwOTI1MTQw
MTEzWjBAMT4wPAYDVQQDDDU2ZGVmMDUyZi1lNjc3LTRmOGEtYjg1Zi0yMzQ4YTE0
MDU3NGQgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBAKpnVkkzzyeGywyQ3cnLcDqrrJGy1WRCCZvGa1lF1s8nuAeje+qnpMqd
LUjaWE2oY4MTPXt70zt6rAvF+X6BA8Evq3XM4a/gIrO9/45yabgkhzZ5ADBsbHj3
isE9QgPtfH09H0v4a71iBCEExuTmoctum/IxHzTSbJBF4+YvtOVdyd+w7ZhfN6Ui
/DOZBMIWAbIWiJgJoh23BBiAXEW4SsjPTpSoXhvBgsKRimXVrTkG7+uPRbvGGHeK
CwoQKl2/S5OLEZmMIhvXxz2Km1ZP+JNud/ua54uNxXk/CPadLpaqhPv/ueHm6D49
dv2IZEQr64t/BCgnuzwxJeL1w4WzkTTbKvXDXp2Zei0uPBbHVgPSEtFfvbabDiTU
z5X2avEFzjuKt85CC9Uc0/Gsk39ZFDtgW2rverfjSoqaHrMC5vwHIJb831F63n6+
1ZRdkJxz7e4As2vWzPQBba25FXFrnAJydC6Yf1EJX99ViN5R+N3g/SzbLdhaz/66
cE2xRe0ZhwIDAQABo0IwQDAdBgNVHQ4EFgQU+X+mLpoIeAfANbNfKq3u4BLAoWcw
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBAHB6YHXkcjkQ5+0j67HrOsYGq/28P+g3Vp+cmfucTDhpSbO/JLxWowV7jeeM
DU0qOrfCQwvb1dQLLxy+i2J0xLbN1NFrdw6tCrlFLprbqPKsVkrMCQW05Z/rcS/a
B1wCq5gqEdWGbaWiR7RPh+TgsiMLI4a3BVZG19NQg1zbk9labujhQ8lot5glSnwB
O3ocTYVHeZMXuSpcu6b+/FNhSLOjgRYnFukSe1XKHz7bY3QT/X5HlqAKMQPbC39p
MTByaXcWl3zst51bHrG9R5EABmRKZyZovSqPX9WV3+XEfe4p+fcCSs9+FK402y3z
cnE/HqLG9pncfombHowC4qMf6aRx1CoAlO/hhiHcqGkhMc9yfPe6dhLaLmbcdJp6
j/BTod/34bRib+/VDHwUOuSPcftp+7WZlyvl3b1YhDoAJSe1aMDzf1sXy1/VzRWr
JZ2aBhtFGCMUnrj0iTM0uLmlE51FQj3oA8LLmM9JgZf6iI+Uj1isGX4nuZOajwiJ
yl2UJw==
-----END CERTIFICATE-----`,
  },
});
pool.connect()
  .then(client => {
    console.log("✅ Cloud Database Connected Successfully");
    client.release();
  })
  .catch(err => {
    console.error("❌ Cloud Database connection error:", err.message);
  });

export default pool;