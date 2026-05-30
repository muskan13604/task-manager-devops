pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/muskan13604/task-manager-devops.git'
            }
        }

        stage('Success') {
            steps {
                echo 'DevOps Pipeline Executed Successfully'
            }
        }
    }
}