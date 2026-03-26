from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./spire_dev.db"
    JWT_SECRET: str = "devSecretKeyForLocalDevelopmentOnly01234567890123456789"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    RAZORPAY_KEY_ID: str = "rzp_test_placeholder"
    RAZORPAY_KEY_SECRET: str = "placeholder_secret"
    AWS_S3_BUCKET: str = "spire-assets"
    AWS_S3_REGION: str = "ap-south-1"
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    model_config = {"env_file": ".env"}


settings = Settings()
