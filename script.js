document.getElementById("predictButton").addEventListener("click", async function () {

  const attendance = parseFloat(document.getElementById("attendance").value);
  const participation = parseFloat(document.getElementById("participation").value);
  const assignments = parseFloat(document.getElementById("assignments").value);
  const examMarks = parseFloat(document.getElementById("examMarks").value);

  if (isNaN(attendance) || isNaN(participation) || isNaN(assignments) || isNaN(examMarks)) {
      alert("Please enter valid numeric values for all inputs.");
      return;
  }

  const payload = {
      attendance: attendance,
      participation: participation,
      assignments: assignments,
      examMarks: examMarks
  };

  try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.prediction !== undefined) {
          document.getElementById("result").textContent = `Predicted Grade: ${result.prediction.toFixed(2)}`;
      } else if (result.error) {
          document.getElementById("result").textContent = `Error: ${result.error}`;
      } else {
          document.getElementById("result").textContent = "Unexpected response from the server.";
      }
  } catch (error) {
      console.error("Error:", error);
      document.getElementById("result").textContent = `An error occurred: ${error.message}`;
  }
});
