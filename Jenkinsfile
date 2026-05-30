pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/muskan13604/task-manager-devops.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker build -t muskanyadav1/taskmanager-backend:v1 backend'
                bat 'docker build -t muskanyadav1/taskmanager-frontend:v1 frontend'
            }
        }

        stage('Push Docker Images') {
            steps {
                bat 'docker push muskanyadav1/taskmanager-backend:v1'
                bat 'docker push muskanyadav1/taskmanager-frontend:v1'
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s'
            }
        }
    }
}