# Tech Radar with React

## Introduction
This is a recreation of the [Tech Radar of Zalando](https://opensource.zalando.com/tech-radar/#). In this project, I have implemented a data management system using React for the frontend, Node.js for the backend, and MongoDB for database storage.

## New Functionalities
The project introduces several new functionalities to enhance the Tech Radar experience:
1. Adding New Technologies (referred to as "tech"): An Admin Panel allows users to add new tech spots to the radar. Users will be prompted to provide the name, Quadrants, and Rings of the tech they want to add.
2. Clearing/Resetting the Radar: Users have the ability to clear all existing techs on the radar and initialize it to a clean state.

3. Selecting Techs:
   - Single Selection: Users can click on individual tech spots to select them. Once a tech spot is selected, it will be displayed in the Selection Panel. From there, users can delete the selected tech or update its information such as tech name, quadrants, and rings.
   - Multiple Selection: Users can select multiple tech spots by dragging a rectangle area on the radar with the mouse. Once multiple techs are selected, they will be listed in the Multiple Selected Panel. This panel provides functionalities for data analysis, such as sorting, filtering, and batch deletion. Additionally, there is a "List all" button that allows users to select all existing techs at once.
   - Cancel Selection: Users can cancel their selection by clicking on any blank area on the page.
4. Searching: The search panel enables users to find specific technologies on the radar. As users input a string into the search bar, suggestions will be provided. Users can select multiple technologies from the suggestions list. Once selected, they can perform the same actions mentioned in the "Selecting Techs" section.



## How is it implemented:
1. Client-side:
- D3 and React Integration:
     Both [D3](https://D3js.org/) and React can handle the rendering of the DOM. The radar in the original zalando code is rendered by the D3. I didn't rewrite the whole project into React. Instead, I keep a lot of source code in the Radar.js, let D3 render and export this D3-rendered radar svg to the main component App.js. The new selection functionalities(clicking/draging rectangle) are implemented by D3 in Radar.js.
- Additional components:
   - AdminPanel.js: handles "adding new techs", "clear all" and "initialize".
   - AdminSelectionPanel.js: handles single selection and its operations.
   - AdminSelectionPanel_Multiple.js: handles multiple selection and its operations.
   - AdminSelectionPanelSearch.js: handles the search box, suggestions, and the "list-all" button.
   - Entries.js: handles fetching entries from the backend.
   - InfoHeader.js and InfoTable.js: stores the static data of the origin page, etc the introduction of the tech rader.

2. Server-side:
   [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/) Integration: The server-side is implemented using Express, which provides a RESTful API for CRUD operations. MongoDB is used as the database to store and retrieve data for the frontend.

## To Run it locally:
1. To start the backend:
```bash
cd server
npm install
node main.js
```
2. To start the frontend:
```bash
cd client
npm install
npm start
```
Note: Please have the MongoDB ready. You can either install it or use docker.
```bash
# for example for MacOS:
~ % brew services start mongodb-community
# check if it is up and running:
~ % brew services list
# incase error:
~ % brew services restart mongodb-community
```

See more details in the wiki.



     
     
