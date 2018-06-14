import React, { Component } from 'react'
import BookShelfChanger from './BookShelfChanger'

class BookShelf extends Component {
    render() {
        console.log(this.props);
        const {books, shelfTitle, onMoveBook } = this.props

        return (
            <div className="list-books-content">
              <div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">{shelfTitle.title}</h2>

                        <div className="bookshelf-books">
                          <ol className="books-grid">
                              { books.map(book => (
                                  <li key={book.title}>
                                      <div className="book">
                                          <div className="book-top">
                                              <div className="book-cover"
                                                   style={{
                                                       width: "128px",
                                                       height: "193px",
                                                       backgroundImage: `url(${book.imageLinks.thumbnail})`
                                                   }}>
                                                  <BookShelfChanger book={ book } onMoveBook={ onMoveBook }/>
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
