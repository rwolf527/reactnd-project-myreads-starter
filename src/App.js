import React from 'react'
import './App.css'
import BookShelf from './BookShelf'
import * as BooksAPI from './utils/BooksAPI';
import {Route, Link} from 'react-router-dom';
import {throttle, debounce} from "throttle-debounce";

class BooksApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            query: ''};
        this.autocompleteSearchDebounced = debounce(500, this.autocompleteSearch);
        this.autocompleteSearchThrottled = throttle(500, this.autocompleteSearch);
      }

    autocompleteSearch = q => {
        this._performQuery(q);
    };

    getCurrentShelf(book) {
        // This method will look for the given book in the set of books in our state object
        // which represents all books that are currently on a shelf
        // If the book is found on a shelf, we will return the shelf from that book (so the dropdown can properly)
        // show which shelf the book returned in search results is on
        let locatedBookList = this.state.books.filter((shelvedBook) => shelvedBook.id === book.id)
        if (locatedBookList.length > 0) {
            return locatedBookList[0].shelf
        } else {
            // book was not found, return the string "none" so the dropdown will display the correct option
            // option indicating that the book is NOT on any shelf yet.
            return "none"
        }
    }


    updateQuery = query => {
      this.setState({ query }, () => {
        const q = this.state.query;
        if (q.length < 5 || q.endsWith(' ')) {
          this.autocompleteSearchThrottled(this.state.query);
        } else {
          this.autocompleteSearchDebounced(this.state.query);
        }
      });
    };

    _performQuery = (query) => {
        if (query.trim().length > 0) {
            BooksAPI.search(query).then((searchResults) => {
                if (searchResults && !searchResults.error && searchResults.length > 0) {
                    let updatedSearchResults = []
                    if (!searchResults.error) {
                        updatedSearchResults = searchResults.map((book) => {
                            book.shelf = this.getCurrentShelf(book)
                            return book
                        })
                    }

                    this.setState({searchResults: updatedSearchResults})
                } else {
                    this.setState({searchResults: []})
                }
            })
        } else {
            this.setState({searchResults: []})
        }
    }

    clearQuery = () => {
        this.setState({query: '', searchResults: []})
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
            <Route exact path="/" render={() => (<div className="list-books">
                    <div className="list-books-title">
                        <h1>MyReads</h1>
                    </div>

                    <div className="list-books-content">
                        <div>
                            {
                                this.state.shelves.map((shelf) => {
                                    return (<BookShelf displayClassName="bookshelf-books" key={shelf.id} shelfListForDropdown={this.state.shelves} shelfTitle={shelf.title} books={this.state.books.filter((book) => book.shelf === shelf.id)} onMoveBook={(book, shelf) => {
                                            this.moveBook(book, shelf)
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
                        <Link to="/" className="close-search" onClick={()=>this.clearQuery()}>Close</Link>
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

                    <BookShelf displayClassName="search-books-results" key="none" shelfListForDropdown={this.state.shelves} shelfTitle="Results" books={this.state.searchResults} onMoveBook={(book, shelf) => {
                            this.moveBook(book, shelf)
                            history.push('/search')
                        }}/>

                </div>)}/>
        </div>)
    }
}

export default BooksApp
