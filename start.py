import asyncio

import dotenv
from hypercorn.asyncio import serve
from hypercorn.config import Config

dotenv.load_dotenv()
from backend import app

if __name__ == "__main__":
    config = Config()
    config.bind = ["localhost:8000"]
    asyncio.run(serve(app, config))
