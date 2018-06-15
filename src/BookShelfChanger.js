import React, { Component } from 'react'

class BookShelfChanger extends Component {

    render() {
        const { shelfListForDropdown, book, onMoveBook } = this.props
        console.log(book.title, book.shelf)
        let currentValue = (book.shelf || "moveTo")
        console.log(currentValue)
        return (
            <div className="book-shelf-changer">
              <select value={ (book.shelf == null ? "moveTo" : book.shelf) } onChange={(event) => onMoveBook(book, event.target.value)}>
                <option key="moveTo" value="moveTo" disabled>Move to...</option>
                {
                    shelfListForDropdown.map(shelf => (
                        <option key={shelf.id} value={shelf.id}>{shelf.title}</option>
                    ))
                }
                <option value="none">None</option>
              </select>
            </div>
        )
    }
}

export default BookShelfChanger;
