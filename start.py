import uvicorn
import dotenv

dotenv.load_dotenv()
from backend import app


if __name__ == "__main__":
    config = uvicorn.Config(app, port=8000, log_level="info")
    server = uvicorn.Server(config)
    server.run()
