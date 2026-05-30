pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/muskan13604/task-manager-devops.git'
            }
        }

        stage('Build Task Service') {
            steps {
                dir('backend') {
                    bat 'mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('Build Analytics Service') {
            steps {
                dir('analytics-service') {
                    bat '..\\backend\\mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('Build Notification Service') {
            steps {
                dir('notification-service') {
                    bat '..\\backend\\mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Success') {
            steps {
                echo 'Microservices DevOps Pipeline Executed Successfully'
            }
        }
    }
}
