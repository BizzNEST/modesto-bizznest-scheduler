# NESTwork

This project aims to create a randomized scheduling app using HTML, CSS, and JavaScript. It will pair or group interns from various locations and departments based on customizable rules, allowing users to easily include or exclude interns with simple controls.

## Table of Contents

- [NESTwork](#nestwork)
- [Table of Contents](#table-of-contents)
- [Project Requirements](#project-requirements)
- [Project Setup](#project-setup)
- [How to Run the Project](#how-to-run-the-project)
- [Development Process](#development-process)
- [Deployment Instructions](#deployment-instructions)
 
## Project Requirements

Intern Data Management:
    Store all intern data in a static JSON object that is embedded or loaded into the application.
    Provide an interface to display intern details, such as name, department, and location, pulled from the JSON object.

Randomized Scheduling:
    The application should randomly generate a schedule that pairs or groups interns according to specified rules.

Pairing rules should include:
    Different city pairing: Interns are paired with others from different cities.
    Different department pairing: Interns are paired with others from different departments.
    Users should be able to turn these rules on or off depending on their requirements.

Selection and Filtering:
    Provide a user interface for selecting which interns to include or exclude from the scheduling.
    Include “Select All” and “Deselect All” options for easy management of selections.
    Allow filtering of interns by location and department.

Rule Configuration:
    Provide a simple UI to set and modify rules for pairing:
    Toggle city-based pairing on or off.
    Toggle department-based pairing on or off.
    Allow users to add or remove custom rules directly from the UI.

Manual Override:
    Enable users to manually adjust the random pairings after they are generated, providing flexibility to accommodate specific needs or preferences.

Edge Case Handling:
    The application must accommodate edge cases, such as:
        An uneven number of interns, where one or more interns may not be paired.
        Interns who meet multiple criteria that could lead to conflicts (e.g., limited availability). 
        Scenarios where all pairing rules cannot be satisfied, requiring fallback or best-effort solutions.
        Clearly communicate to users when edge cases are encountered and how they are resolved.

User Interface:
    A clean, intuitive interface that is responsive and accessible on both desktop and mobile devices.
    The dashboard should provide a clear overview of the current schedule, available pairing rules, and options to select or deselect interns.

Accessibility:
    Ensure the application is compliant with accessibility standards (e.g., WCAG 2.1) for visually impaired users.

Technical Requirements:
    Platform and Technology:
        Frontend Technologies Only: The application will be built using HTML, CSS, and JavaScript.
        Use JavaScript to handle the logic for schedule generation, rule application, selection management, and edge case handling.
        CSS for styling to create a responsive and visually appealing user interface.

Data Storage:
    Use a static JSON file or object to store intern data. 
    Intern data should be loaded into the application using JavaScript and manipulated within the client-side environment.

No Backend or Database:
    This will be a frontend-only project with no backend server or database.
    All data and logic are handled on the client side.

Integration:
    Optionally, provide an export feature to download the generated schedule as a file (e.g., CSV or PDF) or print it directly from the browser.

Non-Functional Requirements:
    Performance:
        The application should be lightweight and optimized for fast loading and execution.
        Schedule generation, including handling edge cases, should be quick, with a target response time of under a second for most operations.
    Scalability:
        Design the application to handle up to 100 interns without performance degradation.
        Ensure the UI remains responsive and easy to use, even with large amounts of data.
    Usability:
        Provide a user-friendly and intuitive experience for users, requiring minimal training or documentation.
        Include tooltips or help text where necessary to explain different features and controls.

## Project Setup

Step-by-step instructions on how to get the development environment running.

1. Clone the repository:
    ```sh
    git clone git@github.com:BizzNEST/modesto-bizznest-scheduler.git
    ```

2. Navigate to the project directory:
    ```sh
    cd modesto-bizznest-scheduler
    ```

3. Create the necessary files:
   - Create `index.html`, `style.css`, and `script.js` files in the project directory.
   - Ensure that `index.html` properly links to both `style.css` for styling and `script.js` for functionality.

4. Install dependencies:
    ```sh
    npm install
    ```

5. Run the development server:
    ```sh
    npm start
    ```

## How to Run the Project


## Project Development Process

### Phase 1: Planning and Design 
#### Time Frame (2-3 days)
* Finalize project requirements and features.
* Develop wireframes and design prototypes for the user interface.
* Interns should familiarize themselves with GitHub practices and read the documentation on commit messages, branching, and coding standards.

### Phase 2: Development 
#### Time Frame (7-10 days)
* Develop the HTML, CSS, and JavaScript components.
* Implement the logic for schedule generation, rule configuration, selection management, and edge case handling.
* Interns should actively create GitHub issues and update them according to progress.

### Phase 3: Testing
#### Time Frame (2-3 days)
* Perform user acceptance testing to ensure the application meets requirements.

### Phase 4: Deployment 
#### Time Frame (1-2 days)
Deploy the application to a web server or hosting platform.
Provide instructions for use and optional documentation.


## Deployment Instructions




