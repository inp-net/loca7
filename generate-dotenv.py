from pathlib import Path
from django.core.management.utils import get_random_secret_key

dotenv_file = Path(__file__).parent / '.env'

dotenv_file.write_text(f"""DEBUG=True
SECRET_KEY={get_random_secret_key()!r}
DB_HOST="127.0.0.1"
DB_NAME="loca7"
DB_USER="loca7"
DB_PASSWORD="TVn7>CAn7"
""")
