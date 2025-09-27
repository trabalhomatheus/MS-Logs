# 📜 Microserviço de Logs

Um microserviço para gerenciamento e armazenamento de logs usando Node.js, gRPC, MongoDB e Kubernetes.

## 📋 O que é este projeto?

- **Microserviço gRPC**: Responde a requisições de registro e consulta de logs
- **MongoDB**: Armazena os logs de forma persistente
- **Kubernetes**: Deploy automatizado em cluster

## 🏗️ Arquitetura de Deploy
```
┌────────────────────────────────────────────────────────────────────┐
│ Kubernetes Cluster                                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│              ┌─────────────────┐    ┌─────────────────┐            │
│              │      Logs       │    │     MongoDB     │            │
│              │ Microservice    │◄──►│   (ReplicaSet)  │            │
│              │     (gRPC)      │    │   (Read/Write)  │            │
│              └─────────────────┘    └─────────────────┘            │
│                      │                       │                     │
│                      ▼                       ▼                     │
│              ┌─────────────────┐    ┌─────────────────┐            │
│              │      Logs       │    │     mongodb-    │            │
│              │    Service      │    │     service     │            │
│              │    (50052)      │    │     (27017)     │            │
│              └─────────────────┘    └─────────────────┘            │
│                      │                       │                     │
│                      ▼                       ▼                     │
│              ┌─────────────────┐    ┌─────────────────┐            │
│              │      Logs       │    │   mongodb-hpa   │            │
│              │      HPA        │    │   (1-3 pods)    │            │
│              │   (1-10 pods)   │    └─────────────────┘            │
│              └─────────────────┘                                   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## 📊 Configurações Detalhadas
- Deployment: `logs-microservice:latest`, porta 50052
- Service: ClusterIP, 50052
- HPA: 1–10 pods
- MongoDB: banco `logsdb`

## ⚙️ Pré-requisitos
- Node.js 20+
- Docker
- Minikube
- kubectl

## 🚀 Como Rodar
- `npm install`
- Docker: `docker build -t logs-microservice:latest . && docker run -p 50052:50052 logs-microservice:latest`
- Kubernetes: `kubectl apply -k deploy/`

## 📁 Estrutura do Projeto
```
logs - microservice /
├── src /
│    ├── proto / logs.proto
│    └── server.js
├── deploy /
├── Dockerfile
└── package.json
```
