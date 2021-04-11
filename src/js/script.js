const select = {
  templateOf: {
    books: '#template-book',
  },
  booksList: '.books-list',
  filters: '.filters',

};

const templates = {
  bookTemplate: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML),
};

console.log(dataSource.books);

function bookPrint(){
  const bookList = dataSource.books;
  const bookContainer = document.querySelector(select.booksList);

  for (let book of bookList){

    const generatedHTML = templates.bookTemplate(book);
    book = utils.createDOMFromHTML(generatedHTML);
    bookContainer.appendChild(book);
  }
}

function initActions() {
  const favoriteBooks = [];
  const bookContainer = document.querySelector(select.booksList);
  // obsluga obrazka i tablicy ulubionych ksiazek
  //event listener na rodzica
  bookContainer.addEventListener('dblclick', function(event){
    // stala zawierajaca klikniety element
    const imageWrapper = event.target.offsetParent;
    const imageId = imageWrapper.getAttribute('data-id');
    //prevent.Default nie dziala? jak to?
    event.preventDefault();

    if(imageWrapper.classList.contains('book__image')){

      // ustawianie klasy na klikniecie
      imageWrapper.classList.toggle('favorite');

      console.log('tablica favoriteBooks przed dodaniem czegokolwiek: ',favoriteBooks);

      if (favoriteBooks.indexOf(imageId) == -1) {
      //jesli obrazka nie ma  w tablicy, dodaje go do favoriteBooks
        favoriteBooks.push(imageId);
        console.log('dodano do tablicy');
      }
      else {
      // sprawdzanie pozycji w tablicy kliknietego obrazka
        const bookIndex = favoriteBooks.indexOf(imageId);
        //usuwanie kliknietego obrazka z tablicy
        favoriteBooks.splice(bookIndex,1);
        console.log('usunieto z tablicy');
      }
      console.log('imageId klikniete obrazka: ', imageId);
      console.log('cala tablica po dodaniu: ', favoriteBooks);
    }
  });

  // obsluga filtrow
  const filterContainer = document.querySelector(select.filters);
  const filters = [];
  filterContainer.addEventListener('click', function(event){
    event.preventDefault();

    filterElements(event, filters);
  });
}

function filterElements(event, filtersArr){
  const input = event.target;
  /*console.log('event filtra: ', input);
  console.log(input.type);
  console.log(input.name);
  console.log(input.tagName);*/
  console.log('tablica filters przed dodaniem: ', filtersArr);
  if (input.type == 'checkbox' && input.name == 'filter' && input.tagName == 'INPUT') {
    if (input.checked && filtersArr.indexOf(input.value) == -1) {
      filtersArr.push(input.value);
      console.log('dodano do tablicy');
    }
    else {
      const inputIndex = filtersArr.indexOf(input.value);
      filtersArr.splice(inputIndex,1);
      console.log('usunieto z tablicy');
    }
  }
  console.log('tablica filters PO dodaniu: ', filtersArr);

  filterBooks(filtersArr);
}

function filterBooks(filtersArr){
  const bookList = dataSource.books;
  for (let book of bookList){
    // hmm do czego w koncu ta zmienna?
    const shouldBeHidden = false; // eslint-disable-line no-unused-vars
    //console.log('book: ', book);
    for (let filter of filtersArr){

      if (!book.details[filter]) {
        console.log('dana ksiazka NIE JEST w filtrach', book);
        const filteredBook = document.querySelector('.book__image[data-id="'+book.id+'"]');
        console.log(filteredBook);
        filteredBook.classList.toggle('hidden');
      }
    }

  }

}

bookPrint();
initActions();
