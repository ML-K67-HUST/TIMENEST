# TIMENEST Platform

TIMENEST is a modular, microservices-based time management assistant combining AI-driven features, vector search capabilities, and seamless user interfaces. This documentation covers all major components, their setup, and deployment workflows.

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Services](#services)
   - [GRAND-BACKEND](#grand-backend)
   - [Frontend](#frontend)
   - [Time-Management Agent](#time-management-agent)
   - [Vector Store](#vector-store)
4. [Development Setup](#development-setup)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Deployment](#deployment)
   - [Docker & Docker Compose](#docker--docker-compose)
   - [Kubernetes & Jenkins](#kubernetes--jenkins)
7. [Directory Structure](#directory-structure)
8. [Contributing](#contributing)
9. [License](#license)

---

## Overview
TIMENEST integrates several specialized services:
- **Backend API** powered by FastAPI.
- **Frontend UI** for calendar and task management.
- **Time-Management Agent** as a microservice.
- **Vector Store API** supporting ChromaDB and Milvus.
- **RAG Deployment** on Kubernetes with Jenkins for continuous delivery.

---

## Architecture
![TIMENEST Architecture](./assets/authorization.png)

1. **Client** interacts with Frontend.
2. **Frontend** communicates with Backend API.
3. **Backend** authenticates requests, orchestrates tasks, and interfaces with Agent and Vector Store.
4. **Agent** handles AI-driven task suggestions.
5. **Vector Store** manages embeddings and semantic searches.
6. **CI/CD** ensures automated testing and deployments via GitHub Actions, Docker, Helm, and Jenkins.

---

## Services

### GRAND-BACKEND
The core FastAPI application:

- **Repository**: `ML-K67-HUST/GRAND-BACKEND` citeturn0file0
- **Features**: Authorization workflow, task management endpoints, database abstraction.
- **Setup**:
  1. Clone:
     ```bash
     git clone https://github.com/ML-K67-HUST/GRAND-BACKEND.git
     ```
  2. Create & activate a virtual environment.
  3. Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
  4. Copy `.env.example` to `.env` and fill in variables.
  5. Run:
     ```bash
     bash run.sh          # single-node
     bash run.sh --scale=True  # scaled deployment
     ```
- **API Docs**: `http://localhost:5050/docs`
- **Fallback Docs**: `http://localhost:80/docs`

---

### Frontend
Interactive calendar UI:

- **Repository**: `ML-K67-HUST/GRAND-FRONTEND` citeturn0file1
- **Setup**:
  ```bash
  git clone https://github.com/ML-K67-HUST/GRAND-FRONTEND.git
  cd GRAND-FRONTEND
  pip install -r requirements.txt
  python app.py
  ```
- **Endpoints**:
  - Landing page: `http://localhost:5001/`
  - Login page: `http://localhost:5001/create-account`
  - Main UI (Calendar): `http://localhost:5001/calendar`

---

### TIME-MANAGEMENT-AGENT
AI agent microservice:

- **Repository**: `ML-K67-HUST/TIME-MANAGEMENT-AGENT` citeturn0file2
- **Prerequisites**: Docker or Docker Compose
- **Quickstart**:
  ```bash
  docker network create timenest
  docker-compose up --build
  ```
- **Manual Build & Run**:
  ```bash
  cd src/
  docker build -t timenest-agent:latest .
  docker run -d --name timenest-agent -p 5001:5001 \
    --env-file .env timenest-agent:latest
  ```
- **API Docs**: `http://localhost:5001/docs`

---

### TIMENEST-VECTOR-STORE
High-performance vector store API:

- **Repository**: `ML-K67-HUST/TIMENEST-VECTOR-STORE` citeturn0file3
- **Features**: Dual vector store (ChromaDB/Milvus), semantic reranking, caching, batch processing.
- **Prerequisites**: Python 3.9+, Docker & Docker Compose, Milvus or ChromaDB.
- **Local Setup**:
  ```bash
  git clone https://github.com/ML-K67-HUST/TIMENEST-VECTOR-STORE.git
  cd TIMENEST-VECTOR-STORE
  pip install -r requirements.txt
  # ChromaDB
  export CHROMA_PATH="./data"
  # Milvus
  export MILVUS_URI="your_milvus_uri"
  export MILVUS_TOKEN="your_milvus_token"
  uvicorn main:app --host 0.0.0.0 --port 8003
  ```
- **Docker Deployment**:
  ```bash
  docker-compose up -d
  ```
- **API Endpoints**:
  - `POST /collections` – Create a collection
  - `GET /collections` – List collections
  - `GET /collections/{name}` – Get collection details
  - `DELETE /collections/{name}` – Delete a collection
  - `POST /collections/{name}/add` – Add documents
  - `POST /collections/{name}/query` – Query documents
  - `GET /collections/{name}/peek` – Peek at documents

---

## Development Setup

1. Ensure the following tools are installed:
   - [Python 3.9+]
   - Docker & Docker Compose
   - Terraform & Ansible (for infrastructure provisioning)
   - Helm & kubectl (for Kubernetes deployments)
2. Clone all service repositories into a common parent directory:
   ```bash
   mkdir timenest && cd timenest
   git clone https://github.com/ML-K67-HUST/GRAND-BACKEND.git
   git clone https://github.com/ML-K67-HUST/GRAND-FRONTEND.git
   git clone https://github.com/ML-K67-HUST/TIME-MANAGEMENT-AGENT.git
   git clone https://github.com/ML-K67-HUST/TIMENEST-VECTOR-STORE.git
   git clone <deploying-rag-k8s-repo-url>
   ```
3. Set up virtual environments per service and install dependencies.

---

## CI/CD Pipeline

**Continuous Integration (CI)**
- Trigger: push to `main` & pull requests
- Actions:
  1. Set up PostgreSQL service container
  2. Install Python dependencies
  3. Run `pytest`
  4. Linting & security checks

**Continuous Deployment (CD)**
- Trigger: push to `main`
- Targets:
  - **Backend**: fly.io
  - **Agent & Vector Store**: Docker Compose or Kubernetes
- Requires GitHub Secrets:
  ```
  TOGETHER_AI_API_KEY, MONGODB_URL, MAILGUN_API_KEY,
  GOOGLE_CLIENT_ID/SECRET, SECRET_KEY, JWT_SECRET_KEY/REFRESH,
  REDIS_URL/PORT/PASSWORD, FLYCTL_ACCESS_TOKEN,
  AWS_POSTGRES_URL, POSTGRES_USER/PASSWORD/DB/PORT,
  MONGODB_TIMENEST_DB_NAME, REDIRECT_URL, FRONTEND_URL
  ```

---

## Deployment

### Docker & Docker Compose

From the root of each service directory:
```bash
docker-compose up --build
```
Services will run on:
- Backend: `localhost:5050`
- Frontend: `localhost:5001`
- Agent: `localhost:5001`
- Vector Store: `localhost:8003`

---

### Kubernetes & Jenkins

Deployment of RAG components on GKE with Jenkins:

1. **Provision GKE Cluster (Terraform)**
   ```bash
   cd terraform
   terraform init && terraform plan && terraform apply
   ```
2. **Helm Deployments**
   - **NGINX Ingress**:
     ```bash
     helm upgrade --install nginx-ingress ./nginx-ingress \
       --namespace nginx-system --create-namespace
     ```
   - **Embedding Model**:
     ```bash
     helm upgrade --install text-vectorizer ./embedding/helm_embedding \
       --namespace emb --create-namespace
     ```
   - **Weaviate (Vector DB)**:
     ```bash
     helm upgrade --install weaviate ./weaviate \
       --namespace weaviate --values ./weaviate/values.yaml --create-namespace
     ```
   - **RAG Controller**:
     1. Update `ingress.host` in `./rag_controller1/helm_rag_controller/values.yaml`
     2. Deploy:
        ```bash
        helm upgrade --install rag-controller \
          ./rag_controller1/helm_rag_controller \
          --namespace rag-controller --create-namespace
        ```
   - **Indexing Pipeline**:
     1. Update `ingress.host` in `./indexing_pipeline/helm_indexing_pipeline/values.yaml`
     2. Deploy:
        ```bash
        helm upgrade --install indexing-pipeline \
          ./indexing_pipeline/helm_indexing_pipeline \
          --namespace indexing-pipeline --create-namespace
        ```
3. **LLM Deployment**
   ```bash
   docker run --gpus all --shm-size 64g -p 8080:80 -v ./data:/data \
     --env HUGGING_FACE_HUB_TOKEN=<your_token> \
     ghcr.io/huggingface/text-generation-inference:2.2.0 \
     --model-id Viet-Mistral/Vistral-7B-Chat
   ```
   Expose via Pagekite:
   ```bash
   python pagekite.py --fe_nocertcheck 8080 your-domain.pagekite.me
   ```
4. **Observability**
   - **Jaeger**:
     ```bash
     helm upgrade --install jaeger-tracing ./jaeger-all-in-one \
       --namespace jaeger-tracing --create-namespace
     ```
   - **Prometheus & Grafana**:
     1. Add scrape config in `prometheus1/values-prometheus.yaml`
     2. Deploy:
        ```bash
        helm upgrade --install prometheus-grafana-stack \
          ./prometheus1/kube-prometheus-stack \
          -f ./prometheus1/values-prometheus.yaml \
          --namespace monitoring --create-namespace
        ```
   - **Loki**:
     ```bash
     helm upgrade --install loki ./loki/loki-stack \
       --namespace monitoring --create-namespace
     ```
5. **Jenkins CI/CD**
   - Build custom Jenkins image with Helm plugin (see `custom_image_jenkins`).
   - Provision Jenkins on GCE via Ansible: `ansible/playbooks/deploy_jenkins.yaml`.
   - Configure credentials, GitHub webhooks, and cluster role bindings.

---

## Directory Structure

At the top level, clone all service repositories:
```bash
timenest/
├── GRAND-BACKEND/             # Backend API
├── GRAND-FRONTEND/            # Frontend UI
├── TIME-MANAGEMENT-AGENT/     # AI Agent service
├── TIMENEST-VECTOR-STORE/     # Vector Store API
├── deploying-rag-k8s/         # K8s & Jenkins deployment charts
├── ansible/                   # Ansible playbooks
├── terraform/                 # Terraform configurations
```>

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/XYZ`).
3. Commit your changes (`git commit -m "Add XYZ feature"`).
4. Push to the branch and open a Pull Request.
5. Ensure all CI checks pass before merging.

---

## License

This project is licensed under the MIT License.

