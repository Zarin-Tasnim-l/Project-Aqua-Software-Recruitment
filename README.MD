# Project Aqua – Underwater Waste Detection

## Overview
Custom YOLOv8 object detection model to detect underwater waste: bottles, polythene, and styrofoam.
Designed for deployment on Project Aqua ROVs.

## Repository Structure
- problem-1-control/        # ROV control tasks
- problem-2-telemetry/      # Backend and frontend telemetry monitoring
    - backend/
        - server.js
        - sensor_data_500.json
    - frontend/
        - index.html
        - script.js
    - api-spec.md
- problem-3-ml/             # Machine learning task
    - outputs/              # Test inference outputs
    - weights/              # Trained YOLOv8 weights
    - performanceGraphs/    # Training metrics plots
    - roboflowDatasetLink.txt
    - report.md
- README.md

## Setup & Usage

### Problem 3 – Underwater Waste Detection
1. Clone repository:  
   `git clone https://github.com/<your-username>/ProjectAquaSoftwareRecruitment.git`  
2. Navigate to `problem-3-ml/`  
3. Install dependencies:  
   `pip install ultralytics roboflow`  
4. Train model (optional):  
   `python train.py`  
5. Run inference on test images:  
   `python detect.py --weights weights/best.pt --source test_images/ --save-txt --save-conf`  
6. Check results in `outputs/` folder  

### Notes
- Original dataset split: 70/15/15 (train/val/test)  
- Augmentation applied only to training images  
- Model is CPU-compatible (~14 FPS)

## License
MIT / Project Aqua internal use
