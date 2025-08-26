### Overview

**CentOps** is a custom management layer designed to simplify the management of clients, Kubernetes clusters, secrets, and application deployments.
CentOps streamlines DevOps workflows by integrating client management, secrets handling, and automated deployments into a single platform.

#### Terminology
**Client**
A logical tenant or organization managed by CentOps. Each client has its own set of apps, secrets, and deployment manifests.

**Cluster**
A Kubernetes cluster that CentOps can register and deploy workloads to via Argo CD.

**Secrets**
Sensitive data (API keys, credentials, certificates, etc.) stored securely in HashiCorp Vault and injected into deployments when needed.

**Deployment Manifest**
A Kubernetes resource definition (YAML) that describes how an app should be deployed. CentOps manages these manifests.

**Argo CD**
A GitOps continuous delivery tool used by CentOps to sync application state from Git repositories using custom **Deployment Manifests**, into Kubernetes clusters.

**Certificates**
TLS/SSL certificates managed using HashiCorp Vault and backed by PostgreSQL for persistence.


#### Features: 

- [X] Manage clients and their associated deployment manifests.
- [X] Manage secrets using HashiCorp Vault.
- [X] Manage certification using HashiCorp Vault and PostgresSQL
- [X] Deploy applications to Kubernetes clusters using ArgoCD.
- [X] Add and monitor clusters via the ArgoCD API.


### Setting up

Running CentOps:
1. **Clone the repository**
   
   ```bash
   git clone https://github.com/buerokratt/CentOps.git
   cd CentOps
   ```
2. **Install Argo**

   ```bash
   helm repo add argo https://argoproj.github.io/argo-helm
   ```
   ```bash
   helm repo update
   ```
   ```bash
   helm upgrade --install argocd argo/argo-cd -n centops --create-namespace -f ./ArgoCD/argocd-helm-values.yaml
   ```
3. **Install Vault**

   ```bash
   helm upgrade --install -n centops vault ./Vault
   ```

5. **Install CentOps**
   ```bash
   helm upgrade --install -n centops centops ./CentOps
   ```
6. **Install Auth-Layer**
   ```bash
   helm upgrade --install -n centops auth-layer ./Authentication-Layer
   ```
 
Configurations:  
**CentOps**:  

In values.yaml replace: 

**Global values**: *replace example.com*  

- domain: centops.example.com  
- domainruuter: ruuter.centops.example.com  
- secretname: centops.example.com01prod  
- secretnameruuter: ruuter.centops.example.com01prod  
- secretnametim: tim.centops.example.com01prod  
- secretnameadmin: admin.centops.example.com01prod
- 
**Ruuter environment**: *replace CORS*
  
- corsAllowedOrigins: "https://admin.centops.example.com,https://tim.centops.example.com"
  
**TIM environment**: *replace default password*
  
- jwtIntegrationSignatureKeyStorePassword: "defaultpassword"
  
**CentOps GUI**: *replace example.com*  

- reactAppApiUrl: "https://ruuter.centops.example.com/centops"  
- REACT_APP_LOGIN_URL: "https://admin.centops.example.com/en/log-in"  
- REACT_APP_MONITORING_URL: "https://monitoring.example.com"  
