// Book Class: Represents a book 
 // every time we create a new book, it instantiates a book object

class Book {
 constructor(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
 };
};


// UI Class: Handle UI Tasks
// to handle UI tasks; when a book displays in the list, or is removed, or an alert is shown
class UI {
 static displayBooks() {

  const books = Store.getBooks(); 

  // loops through all the books in the array && calls the addBookToList method, passing in the book we want added to the list. 
  books.forEach((book) => UI.addBookToList(book));
 };


 static addBookToList(book) {
  // grabs ID #book-list
  const list = document.querySelector("#book-list");
  
  // creates table row
  const row = document.createElement("tr");

  // add HTML colums for title, author and ISBN in their respective rows. last <td></td> is the delete button. 
  row.innerHTML = `
   <td>${book.title}</td>
   <td>${book.author}</td>
   <td>${book.isbn}</td>
   <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td> 
  `;

  list.appendChild(row);
 };
 
 // allows for deletion of books from the list; takes in target element and then removes the top-level parent, in this case <tr> line 42
 // Element.classList || read-only property that returns a live DOMTokenList collection of the class attributes, which can then be used to manipulate the list. 
 static deleteBook(el) {
  if(el.classList.contains("delete")) {
   el.parentElement.parentElement.remove();
  }
 };

 // Method for alerts; takes in className to assign different alert colors to text
 
 static showAlert(message, className) {
  const div = document.createElement("div"); // creates div element
  const container = document.querySelector(".container") // selects the parent element with class .container
  const form = document.querySelector("#book-form") // selects the element with ID of book-form

  div.className = `alert alert-${className}`; // assigns bootstrap alert classes based on whether ${'danger'} ${'warning'} ${'success'} is passed in as secondary variable 
  div.appendChild(document.createTextNode(message)) // creates the text message
  
  container.insertBefore(div, form);

  setTimeout(() => document.querySelector(".alert").remove(), 2000);
 };

 static clearFields() {
  document.querySelector("#title").value = " ";
  document.querySelector("#author").value = " ";
  document.querySelector("#isbn").value = " ";
 };
};
  

// Store class: Handles storage
// uses browsers storage (local storage); doesn't go away if you refresh or leave the browser. remains until cleared. 

class Store {

 static getBooks() {
  let books;

  if (localStorage.getItem("books") === null) {
   books = [];
  } else {
   books = JSON.parse(localStorage.getItem("books"));
  }
  return books;
 }

 static addBook(book) {
  const books = Store.getBooks();
  books.push(book);
  localStorage.getItem("books", JSON.stringify(books));
  
 }

 static removeBooks(isbn) {
  const books = Store.getBooks();

  books.forEach((book, index) => {
   if(book.isbn === isbn) {
    books.splice(index, 1);
   }
  });

  localStorage.setItem("books", JSON.stringify(books)); 
 }

}

// Displays the books as soon as the HTML document has been completely parsed. Does not wait for stylesheets to load.
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Submit a form and Add a Book (handles collecting data from form, and instantiating a new book)

document.querySelector("#book-form").addEventListener("submit", (e) => {

 // Need to prevent default value from submit ??

 e.preventDefault();
 
 // Get form values. Because these are inputs and we want value of the input rather than the element itself, we access the value property directly.  
 const title = document.querySelector("#title").value;
 const author = document.querySelector("#author").value;
 const isbn = document.querySelector("#isbn").value;

 // Validate inputs

 if(title === " "|| author === " "|| isbn === " ") {
  UI.showAlert("Please fill in all fields", "danger");
 } else {
  // once we get the values, we want to instantiate a book from the Book constructor class above. This is NOT static, so we need to actually instatiate a book to add a book.
  // Instantiates a new book; creates a new book Object with the relevant parameters as its properties. Logs to console.
  
  UI.showAlert("Book successfully added!", "success");
  const book = new Book(title, author, isbn);
 
  // Add Book to UI

  UI.addBookToList(book); /* in an of itself this doesn't persist in local storage as of 23:45  */

  // add Book to Store

  Store.addBook(book); /* persistence in local storage by 47:53 */

  // clear fields

  UI.clearFields();

 }

});

// Event: Remove a Book (using Event Propagation)

document.querySelector("#book-list").addEventListener("click", (e) => {
 UI.deleteBook(e.target);

 UI.showAlert("Book deleted!", "success");
});