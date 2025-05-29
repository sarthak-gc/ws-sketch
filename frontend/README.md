# Excali Draw Clone

This project is a clone of Excali Draw, a web-based drawing application. It aims to replicate the core features and functionality of Excali Draw, providing a similar user experience.

## Features

- Drawing shapes: The application allows users to draw shapes such as lines and rectangles on a canvas.
- Shape selection: Users can select shapes to modify or delete them.
- Real-time collaboration: The application utilizes WebSockets to enable real-time collaboration between users. Changes made by one user are instantly reflected on other connected clients.
- Local storage: The application stores the drawing state locally, allowing users to continue their work even after closing the browser.
- Undo functionality: Users can undo their last action, enabling them to experiment and correct mistakes easily.
- Delete functionality: Users can delete selected shapes from the canvas.
- Keyboard shortcuts: The application supports keyboard shortcuts for common actions like deleting selected shapes (Backspace) and deselecting shapes (Escape).

## Technologies Used

- React: The application is built using React, a popular JavaScript library for building user interfaces.
- rough.js: The drawing functionality is powered by rough.js, a JavaScript library for generating drawing shapes.
- WebSockets: Real-time collaboration is achieved through the use of WebSockets, enabling bi-directional communication between the client and server.
- LocalStorage: The application utilizes the browser's LocalStorage to store the drawing state locally.

## Development

This project is developed using modern web technologies and follows best practices for React applications. The code is organized into logical components, making it easy to understand and maintain.
