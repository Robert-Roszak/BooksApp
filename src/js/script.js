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

const ratings = {
  below6: 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%);',
  sixtoeight: 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);',
  eighttonine: 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);',
  above9: 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);',
};

class BooksList {
  constructor() {
    const thisBookList = this;
    thisBookList.getElements();
    thisBookList.bookPrint();
    thisBookList.initActions();
  }

  getElements(){
    const thisBookList = this;
    thisBookList.bookContainer = document.querySelector(select.booksList);
    thisBookList.filterContainer = document.querySelector(select.filters);
    thisBookList.bookList = dataSource.books;
    thisBookList.filtersArr = [];
    thisBookList.favoriteBooks = [];
  }

  bookPrint(){
    const thisBookList = this;

    for (let book of thisBookList.bookList){
      const ratingWidth = book.rating * 10;
      const ratingBgc = thisBookList.determineRatingBgc(book.rating);

      book.ratingWidth = ratingWidth;
      book.ratingBgc = ratingBgc;
      const generatedHTML = templates.bookTemplate(book);
      book = utils.createDOMFromHTML(generatedHTML);
      thisBookList.bookContainer.appendChild(book);
    }
  }

  determineRatingBgc(rating) {
    const thisBookList = this; // eslint-disable-line no-unused-vars
    let background = '';

    if (rating < 6) {
      background = ratings.below6;
    }
    else if (rating > 6 && rating <= 8) {
      background = ratings.sixtoeight;
    }
    else if (rating > 8 && rating <= 9) {
      background = ratings.eighttonine;
    }
    else if (rating > 9) {
      background = ratings.above9;
    }
    return background;
  }

  initActions() {
    const thisBookList = this;

    // obsluga obrazka i tablicy ulubionych ksiazek
    thisBookList.bookContainer.addEventListener('dblclick', function(event){
      thisBookList.toggleFavourite();
    });

    // obsluga filtrow
    thisBookList.filterContainer.addEventListener('click', function(event){
      thisBookList.filterElements(event);
    });
  }

toggleFavourite(){

  const imageWrapper = event.target.offsetParent;
  const imageId = imageWrapper.getAttribute('data-id');

  if(imageWrapper.classList.contains('book__image')){
    imageWrapper.classList.toggle('favorite');
    if (thisBookList.favoriteBooks.indexOf(imageId) == -1) {
      thisBookList.favoriteBooks.push(imageId);
    }
    else {
      const bookIndex = thisBookList.favoriteBooks.indexOf(imageId);
      thisBookList.favoriteBooks.splice(bookIndex,1);
    }
  }
}


  filterElements(event){
    const thisBookList = this;
    const input = event.target;

    if (input.type == 'checkbox' && input.name == 'filter' && input.tagName == 'INPUT') {
      if (input.checked && thisBookList.filtersArr.indexOf(input.value) == -1) {
        thisBookList.filtersArr.push(input.value);
      }
      else {
        const inputIndex = thisBookList.filtersArr.indexOf(input.value);
        thisBookList.filtersArr.splice(inputIndex,1);
      }
    }
    thisBookList.filterBooks();
  }

  filterBooks(){
    const thisBookList = this;

    for (let book of thisBookList.bookList){
      let filteredBook = document.querySelector('.book__image[data-id="'+book.id+'"]');
      book.shouldBeHidden = false;
      if(thisBookList.filtersArr.length) {
        book.shouldBeHidden = true;
        for(const detail in book.details) {
          if(book.details[detail] && thisBookList.filtersArr.includes(detail)) {
            book.shouldBeHidden = false;
            break;
          }
        }
      }
      if (book.shouldBeHidden) filteredBook.classList.add('hidden');
      else filteredBook.classList.remove('hidden');
    }
  }
}

const app = new BooksList(); // eslint-disable-line no-unused-vars
