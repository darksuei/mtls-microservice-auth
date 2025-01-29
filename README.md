### **Proof of Concept: Enforcing Security on Internal API Routes Using Dapr and Open Policy Agent (OPA)**

This proof of concept demonstrates securing internal API routes using **Dapr** and **Open Policy Agent (OPA)**.

### **Flow Overview:**

1. A simple **Node.js application** simulates a microservice with an exposed endpoint `/get-data`.
2. The `/get-data` endpoint makes a **Dapr invoke call** to another microservice to fetch sensitive data from the `/system/data` route.

### **Behind the Scenes:**

1. **Dapr mTLS and Token Authentication**:

   - Dapr ensures encrypted communication between services (mTLS).
   - Every service invocation event requires a **valid token** for authentication.

2. **Middleware for Token Validation**:

   - A middleware in the microservice checks the **Dapr API token** from the request.
   - The token is sent to **OPA** for validation.

3. **OPA Policy Evaluation**:

   - OPA checks the token against pre-defined rules.
   - OPA returns a decision (allow or deny) based on the token validity.

4. **Decision Enforcement**:
   - If OPA allows the request, the microservice proceeds to fetch the sensitive data.
   - If OPA denies the request, an error (e.g., 403 Forbidden) is returned.
