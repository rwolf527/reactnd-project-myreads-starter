import React, { Component } from 'react'
import BooksList from './BooksList'

class BookShelf extends Component {
    render() {
        console.log(this.props);
        const {booksList, shelfTitle} = this.props

        return (
            <div className="list-books-content">
              <div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">{shelfTitle.title}</h2>
                    <BooksList books={booksList} shelfTitle={shelfTitle}/>
                  </div>
              </div>
            </div>
        )
    }
}

export default BookShelf;
