# 🚀 SmartLift

A simple lift (elevator) simulator where you can test and visualize how different elevator algorithms perform in a building with multiple floors and lifts.

Live Demo: [arunsai63.github.io/SmartLift](https://arunsai63.github.io/SmartLift)  

🛠️ What it does
	•	Simulates a building with multiple elevators and floors
	•	You can press a floor button and see which lift comes to pick you up
	•	Implements a basic lift dispatch system that can be replaced with your own logic
	•	Helps you test how different strategies perform in real time
	•	Built with a minimal UI to focus on logic and movement


✍️ Customizing the Logic

All lift dispatch logic lives in src/logic/dispatch.ts . You can plug in your own algorithm to control which lift gets assigned based on current positions, direction, load, or whatever metric you want.
