document.getElementById("predictButton").addEventListener("click", async function () {
  // Get input values from the form
  const attendance = parseFloat(document.getElementById("attendance").value);
  const participation = parseFloat(document.getElementById("participation").value);
  const assignments = parseFloat(document.getElementById("assignments").value);
  const examMarks = parseFloat(document.getElementById("examMarks").value);

  // Validate the input values
  if (isNaN(attendance) || isNaN(participation) || isNaN(assignments) || isNaN(examMarks)) {
      alert("Please enter valid numeric values for all inputs.");
      return;
  }

  // Create the payload to send to the API
  const payload = {
      attendance: attendance,
      participation: participation,
      assignments: assignments,
      examMarks: examMarks
  };

  try {
      // Make a POST request to the Flask API
      const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
      });

      // Check if the response is successful
      if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Parse the JSON response
      const result = await response.json();

      // Display the prediction result
      if (result.prediction !== undefined) {
          document.getElementById("result").textContent = `Predicted Grade: ${result.prediction.toFixed(2)}`;
      } else if (result.error) {
          document.getElementById("result").textContent = `Error: ${result.error}`;
      } else {
          document.getElementById("result").textContent = "Unexpected response from the server.";
      }
  } catch (error) {
      // Handle any errors
      console.error("Error:", error);
      document.getElementById("result").textContent = `An error occurred: ${error.message}`;
  }
});
