let processes = [];

// Add Process Button
const addProcessBtn = document.getElementById('addProcess');
addProcessBtn.addEventListener('click', () => {
    const arrivalTime = parseInt(document.getElementById('arrivalTime').value);
    const burstTime = parseInt(document.getElementById('burstTime').value);

    if (!isNaN(arrivalTime) && !isNaN(burstTime)) {
        processes.push({
            id: processes.length + 1,
            arrivalTime,
            burstTime,
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0
        });
        document.getElementById('processForm').reset();
        updateProcessTable();
    }
});

// Update Process Table
function updateProcessTable() {
    const tableBody = document.getElementById('resultTable');
    tableBody.innerHTML = '';
    processes.forEach((process) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${process.id}</td>
            <td>${process.arrivalTime}</td>
            <td>${process.burstTime}</td>
            <td>${process.completionTime || '-'}</td>
            <td>${process.turnaroundTime || '-'}</td>
            <td>${process.waitingTime || '-'}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Calculate Button
const calculateBtn = document.getElementById('calculate');
calculateBtn.addEventListener('click', () => {
    const algorithm = document.getElementById('algorithm').value;
    const timeQuantum = parseInt(document.getElementById('timeQuantum').value);

    if (processes.length === 0) {
        alert('Please add at least one process.');
        return;
    }

    switch (algorithm) {
        case 'fcfs':
            generateGanttChart(fcfs());
            break;
        case 'srtf':
            generateGanttChart(srtf());
            break;
        case 'sjf':
            generateGanttChart(sjf());
            break;
        case 'rr':
            if (isNaN(timeQuantum) || timeQuantum <= 0) {
                alert('Please enter a valid time quantum.');
                return;
            }
            generateGanttChart(roundRobin(timeQuantum));
            break;
        default:
            alert('Invalid algorithm selected.');
    }

    updateProcessTable();
    calculateAverages();
});

// FCFS Algorithm
function fcfs() {
    let currentTime = 0;
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const ganttData = [];

    processes.forEach((process) => {
        if (currentTime < process.arrivalTime) {
            currentTime = process.arrivalTime;
        }
        ganttData.push({
            processId: process.id,
            startTime: currentTime,
            endTime: currentTime + process.burstTime
        });
        process.completionTime = currentTime + process.burstTime;
        process.turnaroundTime = process.completionTime - process.arrivalTime;
        process.waitingTime = process.turnaroundTime - process.burstTime;
        currentTime = process.completionTime;
    });

    return ganttData;
}

// SRTF Algorithm
function srtf() {
    let currentTime = 0;
    let completed = 0;
    const n = processes.length;
    const remainingBurstTime = processes.map(p => p.burstTime);

    const ganttData = [];
    let lastProcess = null;

    while (completed !== n) {
        let idx = -1;
        let minBurst = Infinity;

        for (let i = 0; i < n; i++) {
            if (processes[i].arrivalTime <= currentTime && remainingBurstTime[i] > 0 && remainingBurstTime[i] < minBurst) {
                minBurst = remainingBurstTime[i];
                idx = i;
            }
        }

        if (idx === -1) {
            currentTime++;
            continue;
        }

        if (lastProcess !== idx) {
            if (lastProcess !== null && remainingBurstTime[lastProcess] > 0) {
                ganttData[ganttData.length - 1].endTime = currentTime;
            }
            ganttData.push({ processId: processes[idx].id, startTime: currentTime, endTime: null });
            lastProcess = idx;
        }

        remainingBurstTime[idx]--;
        currentTime++;

        if (remainingBurstTime[idx] === 0) {
            completed++;
            processes[idx].completionTime = currentTime;
            processes[idx].turnaroundTime = processes[idx].completionTime - processes[idx].arrivalTime;
            processes[idx].waitingTime = processes[idx].turnaroundTime - processes[idx].burstTime;
        }
    }

    if (ganttData[ganttData.length - 1].endTime === null) {
        ganttData[ganttData.length - 1].endTime = currentTime;
    }

    return ganttData;
}

// SJF Algorithm
function sjf() {
    let currentTime = 0;
    let completed = 0;
    const n = processes.length;
    const isCompleted = new Array(n).fill(false);

    const ganttData = [];

    while (completed !== n) {
        let idx = -1;
        let minBurst = Infinity;

        for (let i = 0; i < n; i++) {
            if (processes[i].arrivalTime <= currentTime && !isCompleted[i] && processes[i].burstTime < minBurst) {
                minBurst = processes[i].burstTime;
                idx = i;
            }
        }

        if (idx === -1) {
            currentTime++;
            continue;
        }

        ganttData.push({ processId: processes[idx].id, startTime: currentTime, endTime: currentTime + processes[idx].burstTime });

        currentTime += processes[idx].burstTime;
        processes[idx].completionTime = currentTime;
        processes[idx].turnaroundTime = processes[idx].completionTime - processes[idx].arrivalTime;
        processes[idx].waitingTime = processes[idx].turnaroundTime - processes[idx].burstTime;
        isCompleted[idx] = true;
        completed++;
    }

    return ganttData;
}

// Round Robin Algorithm
function roundRobin(timeQuantum) {
    let currentTime = 0;
    const queue = [];
    const remainingBurstTime = processes.map(p => p.burstTime);
    const ganttData = [];

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    queue.push(0);

    while (queue.length > 0) {
        const idx = queue.shift();

        if (remainingBurstTime[idx] > timeQuantum) {
            ganttData.push({ processId: processes[idx].id, startTime: currentTime, endTime: currentTime + timeQuantum });
            currentTime += timeQuantum;
            remainingBurstTime[idx] -= timeQuantum;
        } else {
            ganttData.push({ processId: processes[idx].id, startTime: currentTime, endTime: currentTime + remainingBurstTime[idx] });
            currentTime += remainingBurstTime[idx];
            remainingBurstTime[idx] = 0;
            processes[idx].completionTime = currentTime;
            processes[idx].turnaroundTime = processes[idx].completionTime - processes[idx].arrivalTime;
            processes[idx].waitingTime = processes[idx].turnaroundTime - processes[idx].burstTime;
        }

        for (let i = 0; i < processes.length; i++) {
            if (
                i !== idx &&
                processes[i].arrivalTime <= currentTime &&
                remainingBurstTime[i] > 0 &&
                !queue.includes(i)
            ) {
                queue.push(i);
            }
        }

        if (remainingBurstTime[idx] > 0) {
            queue.push(idx);
        }
    }

    return ganttData;
}

// Calculate Averages
function calculateAverages() {
    const avgWaitingTimeElem = document.getElementById('avgWaitingTime');
    const avgTurnaroundTimeElem = document.getElementById('avgTurnaroundTime');

    const totalWaitingTime = processes.reduce((sum, p) => sum + p.waitingTime, 0);
    const totalTurnaroundTime = processes.reduce((sum, p) => sum + p.turnaroundTime, 0);

    const avgWaitingTime = (totalWaitingTime / processes.length).toFixed(2);
    const avgTurnaroundTime = (totalTurnaroundTime / processes.length).toFixed(2);

    avgWaitingTimeElem.textContent = `Average Waiting Time: ${avgWaitingTime}`;
    avgTurnaroundTimeElem.textContent = `Average Turnaround Time: ${avgTurnaroundTime}`;
}

// Generate Gantt Chart
function generateGanttChart(ganttData) {
    const chart = document.getElementById('chart');
    chart.innerHTML = '';

    ganttData.forEach(segment => {
        const processDiv = document.createElement('div');
        processDiv.className = 'gantt-segment';
        processDiv.style.width = `${(segment.endTime - segment.startTime) * 10}px`; // Adjust scaling factor as needed
        processDiv.textContent = `P${segment.processId}`;
        chart.appendChild(processDiv);
    });
}
