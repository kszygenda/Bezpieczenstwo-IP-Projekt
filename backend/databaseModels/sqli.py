from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from databaseModels.user import UserModel

sqliRouter = APIRouter(prefix="/sqli", tags=["sqli"])


class SqlLoginInput(BaseModel):
    login: str
    password: str


def contains_suspicious_pattern(value: str) -> bool:
    normalized = value.lower()
    patterns = [
        "' or '1'='1",
        "' or 1=1",
        '" or "1"="1',
        '--',
        ';',
        ' union ',
        '/*',
        '*/',
        ' or true',
    ]
    return any(pattern in normalized for pattern in patterns)


@sqliRouter.post('/login-safe')
def login_safe(payload: SqlLoginInput, db: Session = Depends(get_db)):
    # Safe path: ORM builds parameterized SQL under the hood.
    user = db.query(UserModel).filter(
        UserModel.name == payload.login,
        UserModel.password == payload.password,
    ).first()

    return {
        'ok': user is not None,
        'auth': 'granted' if user else 'denied',
        'query_template': "SELECT id, name FROM Users WHERE name = :login AND password = :password",
        'params': {'login': payload.login, 'password': payload.password},
        'mode': 'safe-parameterized',
    }


@sqliRouter.post('/login-reverse-proxy-check')
def login_reverse_proxy_check(payload: SqlLoginInput):
    blocked = contains_suspicious_pattern(payload.login) or contains_suspicious_pattern(payload.password)

    # Educational simulation: shows how a reverse-proxy/WAF could inspect payloads.
    return {
        'blocked': blocked,
        'reason': 'Suspicious SQL pattern detected by reverse-proxy rule set' if blocked else 'No suspicious SQL signature detected',
        'query_preview': f"SELECT id, name FROM Users WHERE name = '{payload.login}' AND password = '{payload.password}'",
        'mode': 'waf-simulation',
    }
