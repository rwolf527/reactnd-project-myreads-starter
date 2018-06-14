import React, { Component } from 'react'
import BookShelfChanger from './BookShelfChanger'

class BooksList extends Component {
    render() {
        const {books} = this.props
        return (

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
                                      <BookShelfChanger book={ book }/>
                                  </div>
                              </div>
                              <div className="book-title">{book.title}</div>
                              <div className="book-authors">{book.authors}</div>
                          </div>
                      </li>
                  ))}
              </ol>
            </div>
        )
    }
}

export default BooksList;
