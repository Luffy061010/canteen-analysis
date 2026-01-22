# Canteen Analysis System

This is the complete Canteen Analysis System, which includes all components merged from different branches.

## Project Structure

```
canteen-analysis/
├── back_end_java/          # Java Spring Boot backend service
├── canteen-analysis-python/ # Python FastAPI backend service
└── vite-project/           # Vue.js frontend application
```

## Components

### 1. Java Backend (`back_end_java/`)
Java Spring Boot application for handling student consumption and basic information data.

**Technologies:**
- Java
- Spring Boot
- MyBatis
- Redis
- Maven

### 2. Python Backend (`canteen-analysis-python/`)
Python FastAPI application for advanced data analysis and drift detection.

**Technologies:**
- Python
- FastAPI
- SQLAlchemy
- Redis
- Pandas/NumPy (for data analysis)

### 3. Frontend (`vite-project/`)
Vue.js application providing the user interface for the canteen analysis system.

**Technologies:**
- Vue.js 3
- Vite
- ECharts (for data visualization)
- Element Plus (UI components)

## Getting Started

Please refer to the individual README files in each component directory for specific setup instructions.

### Quick Start

1. **Backend Java:** Navigate to `back_end_java/` and run with Maven
2. **Backend Python:** Navigate to `canteen-analysis-python/` and run with uvicorn
3. **Frontend:** Navigate to `vite-project/` and run with npm

## Project History

This repository was created by merging code from multiple branches:
- The Java and Python backends were initially in the main branch
- The Vue.js frontend was merged from the master branch
- All components have been organized into a unified `canteen-analysis/` folder structure
