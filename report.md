# Project Overview

**Objective:**  
Train a **YOLOv26** object detection model to detect underwater waste — **bottles, polythene, and styrofoam** — for deployment on Project Aqua ROVs.

---

# Dataset

- **Original Annotated Images:** 457  
- **Augmented Training Images:** 777 (used only for training)  
- **Classes:** bottle, polythene, styrofoam  

**Original Data Split:**  
- Training: 70% (320 images)  
- Validation: 15% (68 images)  
- Test: 15% (69 images)  

**Training Split with Augmentation:**  
- 320 training images were augmented to 777 images  

**Preprocessing:**  
- Auto-orient  
- Resize to 640×640  

**Augmentations:**  
- Horizontal flip  
- Rotation ±15°  
- Hue ±5%  
- Saturation ±15%  
- Brightness ±20%  
- Blur up to 2px  

**Public Dataset:** [Roboflow Link]  

---

# Model & Training

- **Model:** YOLOv26n (nano), input 640×640  
- **Training Configuration:**  
  - Epochs: 50  
  - Batch Size: 8  
  - Optimizer: AdamW  
  - Early Stopping: 10  
- **Hardware:** CPU (AMD GPU constraints)  
- **Training Time:** 2.065 hours  

---

# Performance Metrics

## Final Validation Metrics

| Metric               | Value    | Interpretation                            |
|--------------------- |--------- |------------------------------------------|
| Overall mAP@0.5      | 0.887    | Excellent detection rate                  |
| Overall mAP@0.5-0.95 | 0.681    | Strong performance across IoU thresholds |
| Precision            | 0.846    | 84.6% of detections correct               |
| Recall               | 0.833    | 83.3% of actual objects detected          |
| Inference Speed      | 68.4 ms  | ~14.6 FPS on CPU                          |
| Training Time        | 2.065 h  | Efficient CPU training                     |

## Per-Class Performance

| Class         | Precision | Recall | mAP@0.5 | mAP@0.5-0.95 | Instances |
|---------------|---------- |------- |---------|--------------|-----------|
| **styrofoam** | 0.983     | 0.886  | 0.975   | 0.813        | 35        |
| **polythene** | 0.796     | 0.842  | 0.880   | 0.701        | 19        |
| **bottle**    | 0.760     | 0.770  | 0.805   | 0.531        | 37        |

# Conclusion

The **YOLOv26n** model trained on augmented images achieves strong detection performance across all three classes, with **real-time inference (~14 FPS on CPU)**.

- Original dataset balanced at **70/15/15** (train/validation/test)  
- Augmentation applied **only to training images** to improve robustness  
- Model ready for **deployment on Project Aqua ROVs**  
- Future improvements possible with **additional data, augmentations, or larger model variants**
