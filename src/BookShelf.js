import React, { Component } from 'react'
import BookShelfChanger from './BookShelfChanger'
import sortBy from 'sort-by';

class BookShelf extends Component {
    bookCoverImageOrDefault(book) {
        return (book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : '')
    }

    render() {
        const {books, shelfListForDropdown, shelfTitle, onMoveBook, displayClassName } = this.props
        if (books) {
            books.sort(sortBy('title'))
        }

        return (
            <div className="list-books-content">
              <div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">{shelfTitle}</h2>

                        <div className={displayClassName}>
                          <ol className="books-grid">
                              { books.map(book => (
                                  <li key={book.id}>
                                      <div className="book">
                                          <div className="book-top">
                                              <div className="book-cover"
                                                   style={{
                                                       width: "128px",
                                                       height: "193px",
                                                       backgroundImage: `url(${this.bookCoverImageOrDefault(book)})`
                                                   }}>
                                                  <BookShelfChanger
                                                      shelfListForDropdown = { shelfListForDropdown }
                                                      book={ book }
                                                      onMoveBook={ onMoveBook }/>
                                              </div>
                                          </div>
                                          <div className="book-title">{book.title}</div>
                                          <div className="book-authors">{book.authors}</div>
                                      </div>
                                  </li>
                              ))}
                          </ol>
                        </div>
                  </div>
              </div>
            </div>
        )
    }
}

export default BookShelf;
