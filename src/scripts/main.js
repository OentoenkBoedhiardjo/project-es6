const baseUrl = "https://web-server-book-dicoding.appspot.com";
function main() {
  getBook();
}

function getBook() {
  fetch(`${baseUrl}/list`)
    .then((r) => {
      return r.json();
    })
    .then((j) => {
      renderAllBooks(j.books);
    })
    .catch((e) => {
      showResponseMessage(e);
    });
}

const findBook = (bookId) => {
  fetch(`${baseUrl}/list`)
    .then((r) => {
      return r.json();
    })
    .then((j) => {
      let foundBook = j.books.filter((book) => book.id == bookId);
      if (foundBook.length > 0) renderAllBooks(foundBook);
      else {
        if (bookId) showResponseMessage("Oops.. something error!");
        else renderAllBooks(j.books);
      }
    });
};
const insertBook = (book) => {
  // Membuat instance dari XMLHttpRequest
  const xhr = new XMLHttpRequest();

  //menetapkan callback jika response sukses dan error
  xhr.onload = function () {
    const responseJson = JSON.parse(this.responseText);
    showResponseMessage(responseJson.message);
    getBook();
  };

  xhr.onerror = function () {
    showResponseMessage();
  };

  // Membuat POST request dan menetapkan target URL
  xhr.open("POST", "https://web-server-book-dicoding.appspot.com/add");

  // Mementapkan properti Content-Type dan X-Auth-Token pada Header request
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Auth-Token", "12345");

  // Mengirimkan request dan menyisipkan JSON.stringify(book) pada body
  xhr.send(JSON.stringify(book));
};
const updateBook = (book) => {
  // Membuat instance dari XMLHttpRequest
  const xhr = new XMLHttpRequest();

  //menetapkan callback jika response sukses dan error
  xhr.onload = function () {
    const responseJson = JSON.parse(this.responseText);
    showResponseMessage(responseJson.message);
    getBook();
  };

  xhr.onerror = function () {
    showResponseMessage();
  };

  // Membuat PUT request dan menetapkan target URL
  xhr.open("PUT", `${baseUrl}/edit/${book.id}`);

  // Mementapkan properti Content-Type dan X-Auth-Token pada Header request
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Auth-Token", "12345");

  // Mengirimkan request dan menyisipkan JSON.stringify(book) pada body
  xhr.send(JSON.stringify(book));
};
const removeBook = (bookId) => {
  fetch(`${baseUrl}/delete/${bookId}`, {
    method: "DELETE",
    headers: {
      "X-Auth-Token": "12345",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      getBook();
      showResponseMessage(responseJson.message);
    })
    .catch((error) => {
      showResponseMessage(error);
    });
};

/*
        jangan ubah kode di bawah ini ya!
    */

const renderAllBooks = (books) => {
  const listBookElement = document.querySelector("#listBook");
  listBookElement.innerHTML = "";

  books.forEach((book) => {
    listBookElement.innerHTML += `
                <div class="col-lg-4 col-md-6 col-sm-12" style="margin-top: 12px;">
                    <div class="card">
                        <div class="card-body">
                            <h5>(${book.id}) ${book.title}</h5>
                            <p>${book.author}</p>
                            <button type="button" class="btn btn-danger button-delete" id="${book.id}">Hapus</button>
                        </div>
                    </div>
                </div>
            `;
  });

  const buttons = document.querySelectorAll(".button-delete");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const bookId = event.target.id;
      removeBook(bookId);
    });
  });
};

const showResponseMessage = (message = "Check your internet connection") => {
  alert(message);
};

document.addEventListener("DOMContentLoaded", () => {
  const inputBookId = document.querySelector("#inputBookId");
  const inputBookTitle = document.querySelector("#inputBookTitle");
  const inputBookAuthor = document.querySelector("#inputBookAuthor");
  const buttonSave = document.querySelector("#buttonSave");
  const buttonUpdate = document.querySelector("#buttonUpdate");
  const searchBookId = document.querySelector("#searchBookId");
  let timer;

  searchBookId.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      let bookId = searchBookId.value;
      findBook(bookId);
    }, 1000);
  });

  buttonSave.addEventListener("click", function () {
    const book = {
      id: Number.parseInt(inputBookId.value),
      title: inputBookTitle.value,
      author: inputBookAuthor.value,
    };
    insertBook(book);
    inputBookId.value = "";
    inputBookTitle.value = "";
    inputBookAuthor.value = "";
  });

  buttonUpdate.addEventListener("click", function () {
    const book = {
      id: Number.parseInt(inputBookId.value),
      title: inputBookTitle.value,
      author: inputBookAuthor.value,
    };

    updateBook(book);
    inputBookId.value = "";
    inputBookTitle.value = "";
    inputBookAuthor.value = "";
  });

  // getBook();
});

export default main;
