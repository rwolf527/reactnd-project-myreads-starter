import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelf from './BookShelf'
import * as BooksAPI from './utils/BooksAPI';


class BooksApp extends React.Component {
  state = {
      shelveTitles: [{title: 'Currently Reading', id: 'currentlyReading'},
                     {title: 'Want to Read', id: 'wantToRead'},
                     {title: 'Read', id: 'read'}
                    ],
      shelvedBooks: [
      ],
      showSearchPage: false
  }

  componentDidMount() {
    // BooksAPI.search('Astronomy').then((shelvedBooks) => {
    BooksAPI.getAll().then((shelvedBooks) => {
      console.log(shelvedBooks)
      this.setState({ shelvedBooks })
    })
  }

  moveBook(book, toShelf) {
    console.log(book)
    console.log(toShelf)
    BooksAPI.update(book, toShelf).then(book => {
      this.setState(state => ({
        shelvedBooks: state.shelvedBooks.filter((b) => b.id !== book.id).concat( [ book ])
      }))
    })

  }

  render() {
    console.log(this.state)
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>

            <div className="list-books-content">
              <div>
                {this.state.shelveTitles.map((title) => {
                    return (
                      <BookShelf
                        key={ title.id }
                        shelfTitle={ title }
                        books={this.state.shelvedBooks.filter((book) => book.shelf === title.id)}
                        onMoveBook={(book, shelf) => {
                                      this.moveBook(book, shelf)
                                      // history.push('/')
                                    }}
                      />
                    )
                })}
              </div>
            </div>

            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
