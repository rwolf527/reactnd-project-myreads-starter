import React from 'react'
import './App.css'
import BookShelf from './BookShelf'
import * as BooksAPI from './utils/BooksAPI';
import {Route, Link} from 'react-router-dom';

class BooksApp extends React.Component {
    state = {
        shelves: [
            {
                title: 'Currently Reading',
                id: 'currentlyReading'
            }, {
                title: 'Want to Read',
                id: 'wantToRead'
            }, {
                title: 'Read',
                id: 'read'
            }
        ],
        books: [],
        searchResults: [],
        query: ''
    }

    getCurrentShelf(book) {
        // This method will look for the given book in the set of books in our state object
        // which represents all books that are currently on a shelf
        // If the book is found on a shelf, we will return the shelf from that book (so the dropdown can properly)
        // show which shelf the book returned in search results is on
        let locatedBookList = this.state.books.filter((shelvedBook) => shelvedBook.id === book.id)
        if (locatedBookList.length > 0) {
            return locatedBookList[0].shelf
        } else {
            // book was not found, return the string "moveTo" so the dropdown will display the "moveTo"
            // option indicating that the book is NOT on any shelf yet.
            return "moveTo"
        }
    }

    updateQuery = (query) => {
        let trimmedQuery = query.trim()
        BooksAPI.search(trimmedQuery).then((searchResults) => {
            console.log("Search Results\n" + {
                searchResults
            })
            if (searchResults && searchResults.length > 0) {

                let updatedSearchResults = searchResults.map((book) => {
                    book.shelf = this.getCurrentShelf(book)
                    return book
                })

                this.setState({query: trimmedQuery, searchResults: updatedSearchResults})
            } else {
                this.setState({query: trimmedQuery})
            }
        })
    }

    clearQuery = () => {
        this.setState({query: ''})
    }

    componentDidMount() {
        BooksAPI.getAll().then((books) => {
            this.setState({books})
        })
    }

    moveBook(book, toShelf) {
        // Update the shelf on the Book
        book.shelf = toShelf

        // Now call the API to update the database for later
        BooksAPI.update(book, toShelf).then(() => {
            this.setState((state) => ({
                // Filter this book (using id) from the state list of shelved Books and then
                // add the updated version of this book that now has the new shelf value
                books: state.books.filter((b) => b.id !== book.id).concat(book)
            }))
        })
    }

    render() {
        return (<div className="app">
            <Route exact path="/" render={({history}) => (<div className="list-books">
                    <div className="list-books-title">
                        <h1>MyReads</h1>
                    </div>

                    <div className="list-books-content">
                        <div>
                            {
                                this.state.shelves.map((shelf) => {
                                    return (<BookShelf displayClassName="bookshelf-books" key={shelf.id} shelfListForDropdown={this.state.shelves} shelfTitle={shelf.title} books={this.state.books.filter((book) => book.shelf === shelf.id)} onMoveBook={(book, shelf) => {
                                            this.moveBook(book, shelf)
                                            history.push('/')
                                        }}/>)
                                })
                            }
                        </div>
                    </div>

                    <div className="open-search">
                        <Link to="/search">Add a Book</Link>
                    </div>
                </div>)}/>

            <Route path="/search" render={({history}) => (<div className="search-books">
                    <div className="search-books-bar">
                        <Link to="/" className="close-search">Close</Link>
                        <div className="search-books-input-wrapper">
                            {/*
                        NOTES: The search from BooksAPI is limited to a particular set of search terms.
                        You can find these search terms here:
                        https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                        However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                        you don't find a specific author or title. Every search is limited by search terms.
                      */
                            }
                            <input type="text" placeholder="Search by title or author" value={this.state.query} onChange={(event) => this.updateQuery(event.target.value)}/>

                        </div>
                    </div>

                    <BookShelf displayClassName="search-books-results"
                        key="none"
                        shelfListForDropdown={this.state.shelves}
                        shelfTitle="Wolf"
                        books={this.state.searchResults}
                        onMoveBook={(book, shelf) => {
                            this.moveBook(book, shelf)
                            history.push('/search')
                        }}/>

                </div>)}/>
        </div>)
    }
}

export default BooksApp
