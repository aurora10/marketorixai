# Full-Stack Deployment Guide: Next.js, Pre-Built Strapi, and Traefik

This guide provides step-by-step instructions to configure and deploy a full-stack application consisting of a Next.js frontend and a pre-built Strapi backend image. The entire stack is managed by Docker Compose and routed by a Traefik reverse proxy on a production VPS.

## Prerequisites

1.  **VPS with Docker and Traefik**: You have a Virtual Private Server (VPS) running, with Docker, Docker Compose, and a working Traefik instance already configured.
2.  **External Network**: Your Traefik instance is connected to an external Docker network (e.g., `n8n_default`).
3.  **Domain Name**: You have a domain name pointed at your VPS's IP address.
4.  **GitHub Repository**: Your project is hosted on GitHub, with a repository configured for GitHub Actions.
5.  **Pre-Built Strapi Image**: Your Strapi application has been containerized and pushed to Docker Hub as `aurora1010/my-blog-strapi:latest-prod`.

---

## Step 1: Add Secrets to GitHub Repository

Your deployment workflow requires sensitive information. Add the following as **Actions secrets** in your GitHub repository settings (`Settings` > `Secrets and variables` > `Actions`).

**Required Secrets:**

*   `DOCKERHUB_USERNAME`: Your Docker Hub username.
*   `DOCKERHUB_TOKEN`: Your Docker Hub access token.
*   `VPS_SSH_HOST`: The IP address of your VPS.
*   `VPS_SSH_USERNAME`: The SSH username for your VPS (e.g., `root` or `ubuntu`).
*   `VPS_SSH_KEY`: The private SSH key to access your VPS.
*   `DOMAIN_NAME`: Your primary domain name (e.g., `marketorix.ai`).
*   `APP_KEYS`: Strapi `APP_KEYS`.
*   `API_TOKEN_SALT`: Strapi `API_TOKEN_SALT`.
*   `ADMIN_JWT_SECRET`: Strapi `ADMIN_JWT_SECRET`.
*   `JWT_SECRET`: Strapi `JWT_SECRET`.
*   `TRANSFER_TOKEN_SALT`: Strapi `TRANSFER_TOKEN_SALT`.
*   `ENCRYPTION_KEY`: Strapi `ENCRYPTION_KEY`.
*   `POSTGRES_USER`: The username for the PostgreSQL database.
*   `POSTGRES_PASSWORD`: The password for the PostgreSQL database.
*   `POSTGRES_DB`: The name of the PostgreSQL database.
*   `NEXT_PUBLIC_GA_ID`: Your Google Analytics ID (optional).

---

## Step 2: Create the Production Docker Compose File

Create a file named `docker-compose.prod.yml` in the root of your project. This file will define all your services and configure Traefik routing. Note that for this to work, your Strapi image must be configured to serve its admin panel from the `/blog-admin` path.

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  # Next.js Frontend
  app:
    image: aurora1010/marketorix:latest
    container_name: marketorix-nextjs
    restart: unless-stopped
    networks:
      - n8n_default # Connect to Traefik's external network
    labels:
      - "traefik.enable=true"
      # Rule for the main domain: example.com
      - "traefik.http.routers.marketorix-app.rule=Host(`${DOMAIN_NAME}`)"
      - "traefik.http.routers.marketorix-app.entrypoints=websecure"
      - "traefik.http.routers.marketorix-app.tls.certresolver=mytlschallenge"
      - "traefik.http.services.marketorix-app.loadbalancer.server.port=3000"

  # Strapi Backend
  strapi:
    image: aurora1010/my-blog-strapi:latest-prod
    container_name: marketorix-strapi
    restart: unless-stopped
    env_file: .env
    volumes:
      - strapi-uploads:/opt/app/public/uploads
    networks:
      - n8n_default # Connect to Traefik's external network
      - default     # Internal network for database communication
    depends_on:
      - db
    labels:
      - "traefik.enable=true"
      # Rule for the admin panel: example.com/blog-admin
      - "traefik.http.routers.marketorix-strapi.rule=Host(`${DOMAIN_NAME}`) && PathPrefix(`/blog-admin`)"
      - "traefik.http.routers.marketorix-strapi.entrypoints=websecure"
      - "traefik.http.routers.marketorix-strapi.tls.certresolver=mytlschallenge"
      - "traefik.http.services.marketorix-strapi.loadbalancer.server.port=1337"
      # Middleware to remove /blog-admin before forwarding to the Strapi container
      - "traefik.http.middlewares.strip-blog-admin.stripprefix.prefixes=/blog-admin"
      - "traefik.http.routers.marketorix-strapi.middlewares=strip-blog-admin"

  # Strapi Database
  db:
    container_name: marketorix-db
    image: postgres:15-alpine
    restart: unless-stopped
    env_file: .env
    volumes:
      - strapi-data:/var/lib/postgresql/data
    networks:
      - default # Only accessible to other services on the internal 'default' network

volumes:
  strapi-data:
  strapi-uploads:

networks:
  n8n_default:
    external: true # This tells Docker Compose to use the existing network created by Traefik
  default:
    driver: bridge
```

---

## Step 3: Update the GitHub Actions Workflow

Modify your workflow file at `.github/workflows/deploy-nextjs.yml`. This new version removes the Strapi build step and only focuses on building the Next.js app and deploying the services.

Replace the entire file content with the following:

```yaml
# .github/workflows/deploy-nextjs.yml
name: Deploy Full Stack App to VPS

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build-and-deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push Next.js image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          platforms: linux/amd64,linux/arm64
          tags: aurora1010/marketorix:latest
          build-args: |
            NEXT_PUBLIC_GA_ID=${{ secrets.NEXT_PUBLIC_GA_ID }}

      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_SSH_HOST }}
          username: ${{ secrets.VPS_SSH_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            # Navigate to the project directory on the VPS
            cd ~/marketorix || exit 1

            # Create the .env file for Strapi and the database from GitHub Secrets
            echo "Creating production .env file..."
            cat << EOF > .env
            # Server & Environment
            HOST=0.0.0.0
            PORT=1337
            NODE_ENV=production
            DOMAIN_NAME=${{ secrets.DOMAIN_NAME }}
            PUBLIC_URL=https://${{ secrets.DOMAIN_NAME }}

            # Application Secrets
            APP_KEYS=${{ secrets.APP_KEYS }}
            API_TOKEN_SALT=${{ secrets.API_TOKEN_SALT }}
            ADMIN_JWT_SECRET=${{ secrets.ADMIN_JWT_SECRET }}
            JWT_SECRET=${{ secrets.JWT_SECRET }}
            TRANSFER_TOKEN_SALT=${{ secrets.TRANSFER_TOKEN_SALT }}
            ENCRYPTION_KEY=${{ secrets.ENCRYPTION_KEY }}

            # Database Credentials
            POSTGRES_USER=${{ secrets.POSTGRES_USER }}
            POSTGRES_PASSWORD=${{ secrets.POSTGRES_PASSWORD }}
            POSTGRES_DB=${{ secrets.POSTGRES_DB }}

            # Strapi Database Connection
            DATABASE_CLIENT=postgres
            DATABASE_HOST=db
            DATABASE_PORT=5432
            DATABASE_NAME=${{ secrets.POSTGRES_DB }}
            DATABASE_USERNAME=${{ secrets.POSTGRES_USER }}
            DATABASE_PASSWORD=${{ secrets.POSTGRES_PASSWORD }}
            DATABASE_SSL=false
            EOF

            echo "Pulling latest images from Docker Hub..."
            sudo docker-compose -f docker-compose.prod.yml pull

            echo "Restarting all services with new images..."
            sudo docker-compose -f docker-compose.prod.yml up -d --force-recreate --remove-orphans

            echo "Pruning old Docker images to save space..."
            sudo docker image prune -af

            echo "Deployment complete!"
```

---

## Step 4: Commit and Deploy

You are now ready to deploy.

1.  **Commit your changes**: Add the new and modified files to git.
    *   `strapi-deployment-guide.md` (updated)
    *   `docker-compose.prod.yml` (new)
    *   `.github/workflows/deploy-nextjs.yml` (updated)
2.  **Push to GitHub**: Push your commits to the `main` branch.

    ```bash
    git add .
    git commit -m "refactor: Simplify deployment for pre-built Strapi"
    git push origin main
    ```

Pushing to `main` will automatically trigger the GitHub Actions workflow. It will build your Next.js app, pull the latest Strapi image, and deploy both services on your VPS.
