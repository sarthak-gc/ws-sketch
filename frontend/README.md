# 📝 Ws-Sketch – User Tutorial

Welcome to the **Ws-Sketch**, a web-based drawing app designed to help you sketch ideas quickly and collaborate in real-time. This guide will walk you through the app's features, how to use them, and what technologies power it.

---

## 🚀 What Is Ws-Sketch?

The **Ws-Sketch** is a simple and powerful drawing application inspired by the popular [Excalidraw](https://excalidraw.com/). It lets you draw, edit, collaborate, and save your sketches directly in your browser.

---

## ✨ Features & How to Use Them

### 🎨 1. Drawing Shapes

- Use the toolbar to select shapes like **lines**, **rectangles**, **arrows**, **circles**, **diamonds**.
- Click and drag on the canvas to draw your selected shape.
- Shapes appear in a hand-drawn, sketch-like style thanks to `rough.js`.

### 🎯 2. Selecting and Editing Shapes

- Click on a shape to select it.
- Once selected, you can:

  - **Move** it around.
  - **Delete** it.
  - **Deselect** using the **Escape** key.

### 🔄 3. Real-Time Collaboration ( ⚠️ Work in progress)

- Invite others to your drawing session.
- As soon as someone makes a change, it appears **instantly** on everyone’s screen.
- Powered by **WebSockets**, this feature enables seamless live collaboration.

### 💾 4. Local Saving

- **No need to worry about losing your work!**
- Your canvas state is saved automatically in your **browser’s LocalStorage**.
- However if **you’re not logged in** and you close the browser , the work **might** get lost.
- If you are logged in, your work will be securely saved, and you can access it across different sessions and devices.

### ⌨️ 5. Handy Keyboard Shortcuts

- **Backspace**: Remove selected shape
- **1**: Select Rectangle
- **2**: Select Line
- **3**: Select Arrow
- **4**: Select Circle
- **5**: Select Diamond
- **Ctrl + D**: Clear everything
- **Ctrl + S**: Toggle Shortcuts Screen
- **Escape**: Deselect shape

### Upcoming Features

- **Real Time Collaboration**
- **Multiple tabs**
- **User-Based Profile**
- **Undo/Redo**
- **Project Sharing**
- **Auto-Save**

---

## Tools Used

- **React**: Builds the user interface and manages the state of the application, ensuring dynamic and responsive UI updates.
- **[rough.js](https://roughjs.com/)**: Creates sketch-style drawings that give the canvas a hand-drawn appearance. It provides a unique and artistic touch to the drawing experience.

- **WebSockets**: Powers real-time collaboration, allowing multiple users to draw on the same canvas at the same time, with live updates.

- **Node.js**: Runs the backend server, facilitating real-time communication between users and handling various server-side operations.

- **Prisma**: An ORM (Object-Relational Mapper) for Node.js, used to interact with the database and manage real-time data updates efficiently.

- **LocalStorage**: Saves your canvas data locally in the browser. This ensures that your work is retained even after closing the browser, unless the data is cleared or the user logs out.

---

## ✅ Final Thoughts

The **Ws-Sketch** is ideal for brainstorming, planning, and sketching together. Give it a try and bring your ideas to life!

---
