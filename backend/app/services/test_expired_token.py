import jwt
from datetime import datetime, timedelta, timezone

from app.services.security import SECRET_KEY, ALGORITHM

expired_payload = {
    "sub": "1",
    "exp": datetime.now(timezone.utc) - timedelta(minutes=5)
}

token = jwt.encode(
    expired_payload,
    SECRET_KEY,
    algorithm=ALGORITHM
)

print("Expired JWT Token:")
print(token)