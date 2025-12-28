document.addEventListener('DOMContentLoaded', () => {
    const stressorsInput = document.getElementById('stressors-input');
    const saveStressorsBtn = document.getElementById('save-stressors-btn');
    const approachesSection = document.getElementById('approaches-section');
    const printPlanBtn = document.getElementById('print-plan-btn');

    const approachDialog = document.getElementById('approach-dialog');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogDescription = document.getElementById('dialog-description');
    const dialogInput = document.getElementById('dialog-input');
    const stressorSelect = document.getElementById('stressor-select');
    const saveCloseBtn = document.getElementById('save-close-btn');

    const approachesData = {
        "Change Situation": "This involves taking steps to alter the source of stress. For example, you might set boundaries, delegate tasks, or address a conflict directly to reduce or eliminate the stressor.",
        "Change Perception": "This approach focuses on how you interpret or think about the stressful situation. By reframing the situation, finding positive angles, or adjusting unrealistic expectations, you can reduce the impact of the stress.",
        "Change Capacity": "This method involves improving your ability to handle the stress. You can build resilience, develop new skills, practice self-care, or seek support to increase your capacity to deal with the stressor effectively."
    };

    // To store user inputs
    let stressors = [];
    // Store applied strategies as { stressor: "", approach: "", plan: "" }
    let appliedStrategies = [];

    saveStressorsBtn.addEventListener('click', () => {
        const inputValue = stressorsInput.value.trim();
        if (inputValue) {
            stressors = inputValue.split('\n').map(line => line.trim()).filter(line => line);
        } else {
            stressors = [];
        }

        if (stressors.length > 0) {
            approachesSection.hidden = false;
        } else {
            approachesSection.hidden = true;
        }
    });

    const approachBoxes = document.querySelectorAll('.dimension-box');
    approachBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const approach = box.dataset.approach;
            openApproachDialog(approach);
        });
    });

    function openApproachDialog(approach) {
        dialogTitle.textContent = approach;
        dialogDescription.textContent = approachesData[approach];
        dialogInput.value = "";
        stressorSelect.innerHTML = "";
        
        // Populate stressor dropdown
        stressors.forEach((stressor, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = stressor;
            stressorSelect.appendChild(opt);
        });

        approachDialog.setAttribute('data-current-approach', approach);
        approachDialog.showModal();
    }

    saveCloseBtn.addEventListener('click', () => {
        const approach = approachDialog.getAttribute('data-current-approach');
        const selectedIndex = stressorSelect.value;
        const planText = dialogInput.value.trim();

        if (selectedIndex !== "" && planText) {
            const chosenStressor = stressors[selectedIndex];
            
            // If there's already a plan for this stressor & approach, update it
            // Otherwise, add a new entry
            const existingEntryIndex = appliedStrategies.findIndex(item => item.stressor === chosenStressor && item.approach === approach);
            if (existingEntryIndex > -1) {
                appliedStrategies[existingEntryIndex].plan = planText;
            } else {
                appliedStrategies.push({ stressor: chosenStressor, approach: approach, plan: planText });
            }
        }

        approachDialog.close();
    });

    printPlanBtn.addEventListener('click', () => {
        // Create print content
        let hasActivities = appliedStrategies.length > 0;
        let planHtml = `<html><head><title>My Stress Management Plan</title>
        <style>
        body { font-family: 'Lato', sans-serif; color: #2d3b45; padding: 20px; }
        h2 { font-weight:700; }
        h3 { margin-top:1em; font-size:1.25rem; font-weight:700; }
        p { margin-bottom:1em; }
        </style></head><body><h2>My Stress Management Plan</h2>`;

        if (hasActivities) {
            // Group by stressor
            const stressorMap = {};
            appliedStrategies.forEach(item => {
                if (!stressorMap[item.stressor]) {
                    stressorMap[item.stressor] = [];
                }
                stressorMap[item.stressor].push(item);
            });

            for (const s in stressorMap) {
                planHtml += `<h3>Stressor: ${s}</h3>`;
                stressorMap[s].forEach(entry => {
                    planHtml += `<p><strong>Approach:</strong> ${entry.approach}<br><strong>Plan:</strong> ${entry.plan}</p>`;
                });
            }
        } else {
            planHtml += `<p>You have not applied any strategies to your stressors yet.</p>`;
        }

        planHtml += `</body></html>`;

        // Open a new window for printing
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        // Write the content to the new window
        printWindow.document.write(planHtml);
        printWindow.document.close();

        // Focus on the new window
        printWindow.focus();

        // Wait for the content to load before printing
        printWindow.onload = function() {
            printWindow.print();
            printWindow.close();
        };
    });
});
