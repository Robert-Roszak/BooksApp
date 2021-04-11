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
    const favoriteBooks = [];

    // obsluga obrazka i tablicy ulubionych ksiazek
    thisBookList.bookContainer.addEventListener('dblclick', function(event){
      //prevent.Default nie dziala? jak to?
      event.preventDefault();
      //czy to co ponizej nie lepiej jakby bylo w osobnej funkcji?
      const imageWrapper = event.target.offsetParent;
      const imageId = imageWrapper.getAttribute('data-id');

      if(imageWrapper.classList.contains('book__image')){
        imageWrapper.classList.toggle('favorite');
        //console.log('tablica favoriteBooks przed dodaniem czegokolwiek: ',favoriteBooks);

        if (favoriteBooks.indexOf(imageId) == -1) {
          favoriteBooks.push(imageId);
          //console.log('dodano do tablicy');
        }
        else {
          const bookIndex = favoriteBooks.indexOf(imageId);
          favoriteBooks.splice(bookIndex,1);
          //console.log('usunieto z tablicy');
        }
        //console.log('imageId klikniete obrazka: ', imageId);
        //console.log('cala tablica po dodaniu: ', favoriteBooks);
      }
    });

    // obsluga filtrow
    const filters = [];
    thisBookList.filterContainer.addEventListener('click', function(event){
      event.preventDefault();
      thisBookList.filterElements(event, filters);
    });
  }

  filterElements(event, filtersArr){
    const thisBookList = this;
    const input = event.target;
    //console.log('tablica filters przed dodaniem: ', filtersArr);
    if (input.type == 'checkbox' && input.name == 'filter' && input.tagName == 'INPUT') {
      if (input.checked && filtersArr.indexOf(input.value) == -1) {
        filtersArr.push(input.value);
        //console.log('dodano do tablicy');
      }
      else {
        const inputIndex = filtersArr.indexOf(input.value);
        filtersArr.splice(inputIndex,1);
        //console.log('usunieto z tablicy');
      }
    }
    //console.log('tablica filters PO dodaniu: ', filtersArr);
    thisBookList.filterBooks(filtersArr);
  }

  filterBooks(filtersArr){
    const thisBookList = this;
    for (let book of thisBookList.bookList){
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
}
// jak poradzic sobie z errorem od eslint o nieuzywanej stalej?
const app = new BooksList(); // eslint-disable-line no-unused-vars
