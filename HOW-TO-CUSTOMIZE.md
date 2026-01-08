# How to Customize Your Portfolio

## Step 1: Add Your Project Images

### For the home page thumbnails:

1. Save your project thumbnail images in the `images/` folder
2. Name them something like: `project1.jpg`, `project2.jpg`, etc.
3. Open `index.html` in a text editor
4. Find this code:
   ```html
   <div class="project-thumbnail"></div>
   ```
5. Replace it with:
   ```html
   <div class="project-thumbnail">
       <img src="images/project1.jpg" alt="Project Name" style="width: 100%; height: 100%; object-fit: cover;">
   </div>
   ```

### For project detail pages:

1. Open `project.html` in a text editor
2. Find this code:
   ```html
   <div class="image-placeholder"></div>
   ```
3. Replace it with:
   ```html
   <div class="image-placeholder">
       <img src="images/your-image.jpg" alt="Project image" style="width: 100%; height: 100%; object-fit: cover;">
   </div>
   ```

## Step 2: Update Project Information

1. Open `project.js` in a text editor
2. Find the project you want to edit, for example:
   ```javascript
   brands: {
       category: 'BRANDS',
       title: 'Testarossa Winery',
       description: 'Your description here...'
   }
   ```
3. Change the title and description to match your project

## Step 3: Update About Page

1. Open `about.html` in a text editor
2. Find this line:
   ```html
   <p class="project-description">
       Add your bio and information about yourself here.
   </p>
   ```
3. Replace the text with your bio

## Step 4: Update Contact Page

1. Open `contact.html` in a text editor
2. Replace the placeholder text with your contact info:
   ```html
   <p class="project-description">
       Email: your.email@example.com<br>
       Phone: +1 234 567 8900<br>
       Instagram: @yourusername
   </p>
   ```

## Step 5: Change Your Name

If you want to change "OLENA KOVTASH" to your name:

1. Open each HTML file (index.html, project.html, about.html, contact.html)
2. Find: `<h1 class="name">OLENA KOVTASH</h1>`
3. Replace "OLENA KOVTASH" with your name

## Need Help?

- To edit HTML/CSS files, you can use:
  - **TextEdit** (Mac) - make sure to use "Plain Text" mode
  - **Notepad** (Windows)
  - **VS Code** (free download) - recommended for easier editing
- Save files after making changes
- Refresh your browser to see updates
