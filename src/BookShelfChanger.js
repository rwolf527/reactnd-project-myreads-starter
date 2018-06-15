import React, { Component } from 'react'

class BookShelfChanger extends Component {

    render() {
        const { shelfListForDropdown, book, onMoveBook } = this.props
        return (
            <div className="book-shelf-changer">
              <select value={ (book.shelf == null ? "none" : book.shelf) } onChange={(event) => onMoveBook(book, event.target.value)}>
                <option key="moveTo" value="moveTo" disabled>Move to...</option>
                {
                    shelfListForDropdown.map(shelf => (
                        <option key={shelf.id} value={shelf.id}>{shelf.title}</option>
                    ))
                }
                <option key="none" value="none">None</option>
              </select>
            </div>
        )
    }
}

export default BookShelfChanger;
