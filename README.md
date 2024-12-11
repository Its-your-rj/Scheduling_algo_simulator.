# Scheduling Algorithm Simulator

## Table of Contents
1. [Overview](#overview)
2. [Core Logic](#core-logic)
3. [Features](#features)
4. [Technologies Used](#technologies-used)
5. [How to Use](#how-to-use)
6. [File Structure](#file-structure)
7. [License](#license)

---

## Overview
This Scheduling Algorithm Simulator is a web application designed to simulate various CPU scheduling algorithms including **First Come First Serve (FCFS)**, **Shortest Remaining Time First (SRTF)**, **Shortest Job First (SJF)**, and **Round Robin (RR)** with a user-specified time quantum. Users can input the arrival time and burst time for each process, and the simulator will compute the completion time, turnaround time, and waiting time for each process. The application will display results in a table format and generate a dynamic Gantt chart representing the scheduling process. It also calculates and displays the average waiting time and average turnaround time for all processes.

---

## Core Logic
The core logic of the application revolves around implementing the four CPU scheduling algorithms and calculating relevant metrics for each process. Here's a breakdown of the core functions:

### 1. FCFS (First Come First Serve)
- **Description**: Processes are scheduled in the order they arrive.
- **Logic**:
  - Sort the processes based on their arrival time.
  - The CPU is allocated to the process that arrives first.
  - Completion time is computed sequentially for each process.
- **Time Complexity**: `O(n log n)` for sorting, where `n` is the number of processes.

### 2. SRTF (Shortest Remaining Time First)
- **Description**: The process with the shortest remaining burst time is executed first.
- **Logic**:
  - At each time unit, the process with the smallest remaining burst time is selected for execution.
  - Processes are checked periodically to update which process has the shortest remaining burst time.
- **Time Complexity**: `O(n^2)` in the worst case for finding the shortest process.

### 3. SJF (Shortest Job First)
- **Description**: The process with the smallest burst time is executed first.
- **Logic**:
  - Sort processes based on burst time when they are ready for execution.
  - The process with the smallest burst time is executed next.
- **Time Complexity**: `O(n log n)` for sorting.

### 4. Round Robin (RR)
- **Description**: Each process is executed for a fixed time quantum.
- **Logic**:
  - Processes are executed in a circular queue.
  - Each process gets a fixed time slice (quantum), and after the slice, if the process has more remaining burst time, it is put back in the queue.
- **Time Complexity**: `O(n * t)` where `n` is the number of processes and `t` is the number of time quanta required.

---

## Features
- **Input Fields**: Users can input the arrival time and burst time of each process.
- **Dynamic Table**: After calculating the scheduling, a table shows each process's details: Process ID, Arrival Time, Burst Time, Completion Time, Turnaround Time, and Waiting Time.
- **Gantt Chart Visualization**: A dynamic Gantt chart visually represents the execution timeline of each process.
- **Average Calculations**: Displays average waiting time and average turnaround time after the scheduling is completed.
- **Multiple Algorithm Options**: Users can select between FCFS, SRTF, SJF, or Round Robin algorithms.
- **Responsive UI**: A clean, user-friendly interface that adjusts to different screen sizes.

---

## Technologies Used
- **HTML5**: For structuring the webpage and inputs.
- **CSS3**: For styling the page, including the Gantt chart and result tables.
- **JavaScript**: For implementing the scheduling algorithms, dynamic content updates, and calculations.
- **DOM Manipulation**: To dynamically update the table, chart, and process details based on user input.

---

## How to Use

1. **Open the Application**: Load the `index.html` file in a web browser.
2. **Add Processes**: 
   - Enter the **Arrival Time** and **Burst Time** for each process in the input fields.
   - Click the **Add Process** button to add the process to the list.
3. **Select Scheduling Algorithm**: 
   - Choose an algorithm from the dropdown list: FCFS, SRTF, SJF, or Round Robin.
   - If you choose Round Robin, enter a **Time Quantum** value.
4. **Calculate**: Click the **Calculate** button to run the selected algorithm. The results will populate the table below and the Gantt chart will update dynamically.
5. **View Results**: The table shows the process details, and the Gantt chart visually displays the process execution timeline.

---

## File Structure

```
/scheduling-algorithm-simulator
│
├── index.html               # Main HTML file (UI structure)
├── styles.css               # CSS file for styling the page
├── script.js                # JavaScript file containing scheduling logic
└── README.md                # Documentation file (this file)
```

---
