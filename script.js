document.getElementById("predictButton").addEventListener("click", async () => {
    const attendance = document.getElementById("attendance").value;
    const participation = document.getElementById("participation").value;
    const assignments = document.getElementById("assignments").value;
    const examMarks = document.getElementById("examMarks").value;
  
    if (!attendance || !participation || !assignments || !examMarks) {
      alert("Please fill in all fields");
      return;
    }
  
    // Sending user inputs to the backend
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attendance: parseFloat(attendance),
        participation: parseFloat(participation),
        assignments: parseFloat(assignments),
        examMarks: parseFloat(examMarks),
      }),
    });
  
    const result = await response.json();
    document.getElementById("result").innerText = `Predicted Grade: ${result.grade}`;
  });
  