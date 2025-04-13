import subprocess
import sys
import os

# Set necessary environment variables for DockerHub and Kubernetes (you can replace these with actual values)
DOCKER_USERNAME = os.getenv('DOCKER_USERNAME')
DOCKER_PASSWORD = os.getenv('DOCKER_PASSWORD')
K8S_CONFIG = os.getenv('K8S_CONFIG')  # K8S cluster config (or path to the kubeconfig file)

# Set your image name and tag
IMAGE_NAME = "misa-j-social-network"
TAG = "latest"
DOCKER_REGISTRY = "docker.io"

# Function to run shell commands
def run_command(command):
    try:
        result = subprocess.run(command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"Command succeeded: {command}")
        return result.stdout.decode('utf-8')
    except subprocess.CalledProcessError as e:
        print(f"Command failed: {command}")
        print(f"Error: {e.stderr.decode('utf-8')}")
        sys.exit(1)

# Step 1: Build Docker Image
def build_docker_image():
    print("Building Docker image...")
    command = f"docker build -t {DOCKER_REGISTRY}/{DOCKER_USERNAME}/{IMAGE_NAME}:{TAG} ."
    run_command(command)

# Step 2: Scan Docker Image for vulnerabilities with Trivy
def scan_docker_image():
    print("Scanning Docker image for vulnerabilities using Trivy...")
    command = f"trivy image {DOCKER_REGISTRY}/{DOCKER_USERNAME}/{IMAGE_NAME}:{TAG}"
    run_command(command)

# Step 3: Log into DockerHub
def login_to_dockerhub():
    print("Logging into DockerHub...")
    command = f"echo {DOCKER_PASSWORD} | docker login -u {DOCKER_USERNAME} --password-stdin"
    run_command(command)

# Step 4: Push Docker Image to DockerHub
def push_docker_image():
    print("Pushing Docker image to DockerHub...")
    command = f"docker push {DOCKER_REGISTRY}/{DOCKER_USERNAME}/{IMAGE_NAME}:{TAG}"
    run_command(command)

# Step 5: Apply Kubernetes Deployment YAML
def deploy_to_k8s():
    print("Deploying to Kubernetes...")
    # Assuming kubectl is configured and the kubeconfig file is already set in K8S_CONFIG
    command = f"echo '{K8S_CONFIG}' | kubectl apply -f -"
    run_command(command)

# Step 6: Expose Service in Kubernetes (Optional)
def expose_service_in_k8s():
    print("Exposing service in Kubernetes...")
    command = f"kubectl expose deployment {IMAGE_NAME} --type=LoadBalancer --port=3000"
    run_command(command)

def main():
    # Build the Docker image
    build_docker_image()

    # Scan the Docker image for vulnerabilities
    scan_docker_image()

    # Log in to DockerHub
    login_to_dockerhub()

    # Push the Docker image to DockerHub
    push_docker_image()

    # Deploy the application to Kubernetes
    deploy_to_k8s()

    # Expose the service if desired
    expose_service_in_k8s()

    print("Deployment and Security Scanning complete!")

if __name__ == "__main__":
    main()
