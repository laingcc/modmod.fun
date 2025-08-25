import requests
from configs import server_configs

HCAPTCHA_VERIFY_URL = 'https://api.hcaptcha.com/siteverify'

def verify_hcaptcha(token: str, remote_ip: str = None) -> bool:
    """Verifies an hCaptcha token."""
    data = {
        'secret': server_configs['hcaptcha_secret_key'],
        'response': token,
    }
    if remote_ip:
        data['remoteip'] = remote_ip

    try:
        response = requests.post(HCAPTCHA_VERIFY_URL, data=data)
        response.raise_for_status()
        result = response.json()
        return result.get('success', False)
    except requests.exceptions.RequestException as e:
        print(f"Error verifying hCaptcha token: {e}")
        return False
