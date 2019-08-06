let showCountries = () => {
  let ul = document.getElementById('countries');
  ul.innerHTML = "";
  axios.get('http://localhost:8080/countries')
    .then(response => {
      for (country of response.data) {
        addCountryToDom(country);
        fillCountrySelect(country);
      }
    })
}
showCountries();

axios.get('http://localhost:8080/authors')
  .then(response => {
    for (author of response.data) {
      addAuthorToDom(author);
      fillAuthorSelect(author);
    }
  })

axios.get('http://localhost:8080/books')
  .then(response => {
    for (book of response.data) {
      addBookToDom(book);
    }
  })

let addBookToDom = (book) => {
  let ulBook = document.getElementById('books');
  let liBook = document.createElement('li');
  liBook.className = "info-li";
  let bookTitle = document.createElement('h3');
  bookTitle.innerText = `${book.name}, ${book.year}`;
  bookTitle.className = "info-li__title";
  let bookDesc = document.createElement('p');
  bookDesc.innerText = book.description;
  bookDesc.className = "info-li__description";

  liBook.appendChild(bookTitle);
  liBook.appendChild(bookDesc);
  ulBook.appendChild(liBook);
}

let fillAuthorSelect = (author) => {
  let authorSelect = document.getElementById('author-select');
  let option = document.createElement('option');
  option.innerText = author.name;
  option.value = author.id;
  authorSelect.appendChild(option);
}

let fillCountrySelect = (country) => {
  let countrySelect = document.getElementById('country-select');
  let option = document.createElement('option');
  option.innerText = country.name;
  option.value = country.id;
  countrySelect.appendChild(option);
}


let addAuthorToDom = (author) => {
  let ulAuthor = document.getElementById('authors');
  let liAuthor = document.createElement('li');
  liAuthor.className = "info-li";
  let authorTitle = document.createElement('h3');
  let authorBio = document.createElement('p');
  authorTitle.innerText = author.name;
  authorTitle.className = "info-li__title";
  authorBio.innerText = author.bio;
  authorBio.className = "info-li__description";
  liAuthor.appendChild(authorTitle);
  liAuthor.appendChild(authorBio);
  ulAuthor.appendChild(liAuthor);
}

let addCountryToDom = (country) => {
  let countryID = country.id;
  let ul = document.getElementById('countries');
  let li = document.createElement('li');
  li.className = "info-li";
  let lidiv = document.createElement('div');
  let lip = document.createElement('p');
  lidiv.className = "li-div";
  lip.innerText = country.name;
  lip.className = "li-div__country";
  let updateDiv = document.createElement('div');
  updateDiv.className = "update-container";
  let countryName = document.createElement('input');
  countryName.value = country.name;
  countryName.className = "form-input";
  countryName.id = `newname-${country.id}`;

  let deleteBtn = document.createElement('button');
  let updateBtn = document.createElement('button');
  let saveBtn = document.createElement('button');
  saveBtn.className = "form-add-button";
  deleteBtn.innerText = "Delete";
  updateBtn.innerText = "Update";
  saveBtn.innerText = "Save changes";
  updateDiv.appendChild(countryName);
  updateDiv.appendChild(saveBtn);
  updateDiv.id = `updatediv-${country.id}`;

  deleteBtn.onclick = () => {
    axios.delete(`http://localhost:8080/countries/${country.id}`)
      .then(reload => showCountries())
      .catch(err => alert("Something went wrong"));
  };
  updateBtn.onclick = () => {
    let updateDiv = document.getElementById(`updatediv-${country.id}`);
    updateDiv.style.display = "block";
  };
  saveBtn.onclick = () => {
    let newCountryName = document.getElementById(`newname-${country.id}`).value;
    axios.patch(`http://localhost:8080/countries/${country.id}`, {
        name: newCountryName
      })
      .then(showNewList => {
        let updateDiv = document.getElementById(`updatediv-${country.id}`);
        updateDiv.style.display = "none";
        showCountries();
      });
  };

  deleteBtn.className = "delete-button form-add-button";
  updateBtn.className = "delete-button form-add-button";
  lidiv.appendChild(lip);
  lidiv.appendChild(deleteBtn);
  lidiv.appendChild(updateBtn);
  li.appendChild(lidiv);
  li.appendChild(updateDiv);
  ul.appendChild(li);
}

document.getElementById('addBookBtn').onclick = () => {
  let bookName = document.getElementById('book_name');
  let bookYear = document.getElementById('book_year');
  let bookDesc = document.getElementById('book_description');
  let authorSelect = document.getElementById('author-select');
  let authorId = authorSelect.options[authorSelect.selectedIndex].value;

  if (!bookName.value) {
    bookName.placeholder = "CAN'T BE EMPTY";
    return;
  }
  if (!bookYear.value) {
    bookYear.placeholder = "CAN'T BE EMPTY";
    return;
  }
  if (!bookDesc.value) {
    bookDesc.placeholder = "CAN'T BE EMPTY";
    return;
  }
  if (!authorId) {
    alert("Choose author");
  }
  axios.post('http://localhost:8080/books', {
    name: bookName.value,
    year: parseInt(bookYear.value),
    description: bookDesc.value,
    author_id: parseInt(authorId)
  }).then(response => addBookToDom(response.data));
}

document.getElementById('addCountryBtn').onclick = () => {
  let name = document.getElementById('country_name');

  if (name.value) {
    axios.post('http://localhost:8080/countries', {
      name: name.value
    }).then(response => {
      addCountryToDom(response.data);
      fillCountrySelect(response.data);
    });
  } else {
    name.placeholder = "CAN'T BE EMPTY";
  }
}

document.getElementById('addAuthorBtn').onclick = () => {
  let authorName = document.getElementById('author_name');
  let authorBio = document.getElementById('author_bio');
  let countrySelect = document.getElementById('country-select');
  let countryId = countrySelect.options[countrySelect.selectedIndex].value;


  if (!authorName.value) {
    authorName.placeholder = "CAN'T BE EMPTY";
    return;
  }

  if (!authorBio.value) {
    authorBio.placeholder = "CAN'T BE EMPTY";
    return;
  }

  if (!countryId) {
    alert('Choose country');
    return;
  }
  axios.post('http://localhost:8080/authors', {
    name: authorName.value,
    country_id: parseInt(countryId),
    bio: authorBio.value
  }).then(response => {
    addAuthorToDom(response.data);
    fillAuthorSelect(response.data);
  });
}